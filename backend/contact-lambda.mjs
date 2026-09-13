import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://dumm.cloud';
const destinationEmail = process.env.DESTINATION_EMAIL;
const senderEmail = process.env.SENDER_EMAIL;

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Vary': 'Origin'
  },
  body: JSON.stringify(body)
});

const clean = (value, max = 5000) => String(value || '').replace(/[<>]/g, '').trim().slice(0, max);

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') return response(204, {});

  try {
    const origin = event.headers?.origin || event.headers?.Origin || '';
    if (origin && origin !== allowedOrigin && origin !== 'https://www.dumm.cloud') {
      return response(403, { message: 'Origin not allowed.' });
    }

    if (!destinationEmail || !senderEmail) {
      console.error('Missing DESTINATION_EMAIL or SENDER_EMAIL environment variable.');
      return response(500, { message: 'Contact service is not configured.' });
    }

    const data = JSON.parse(event.body || '{}');

    // Honeypot: bots often fill hidden fields.
    if (data.website) return response(200, { message: 'Message received.' });

    const name = clean(data.name, 120);
    const email = clean(data.email, 254);
    const company = clean(data.company, 160);
    const subject = clean(data.subject, 200);
    const message = clean(data.message, 6000);

    if (!name || !email || !subject || !message) {
      return response(400, { message: 'Please complete all required fields.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response(400, { message: 'Please enter a valid email address.' });
    }

    const textBody = [
      'New portfolio contact form message',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Subject: ${subject}`,
      '',
      'Message:',
      message
    ].join('\n');

    await ses.send(new SendEmailCommand({
      Source: senderEmail,
      Destination: { ToAddresses: [destinationEmail] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `[dumm.cloud] ${subject}`, Charset: 'UTF-8' },
        Body: { Text: { Data: textBody, Charset: 'UTF-8' } }
      }
    }));

    return response(200, { message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return response(500, { message: 'Unable to send your message right now.' });
  }
};
