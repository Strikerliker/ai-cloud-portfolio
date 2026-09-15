import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});
const destinationEmail = process.env.DESTINATION_EMAIL;
const senderEmail = process.env.SENDER_EMAIL;
const allowedOrigins = new Set(
  String(process.env.ALLOWED_ORIGINS || 'https://dumm.cloud,https://www.dumm.cloud')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
);

const requestOrigin = event => event?.headers?.origin || event?.headers?.Origin || '';
const response = (statusCode, body, origin = '') => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://dumm.cloud',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  },
  body: statusCode === 204 ? '' : JSON.stringify(body)
});

const clean = (value, max = 5000) => String(value || '')
  .replace(/[<>]/g, '')
  .replace(/[\u0000-\u001F\u007F]/g, ' ')
  .trim()
  .slice(0, max);

const cleanSubject = value => clean(value, 200).replace(/[\r\n]+/g, ' ');
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const handler = async event => {
  const origin = requestOrigin(event);
  const method = event?.requestContext?.http?.method || event?.httpMethod || '';

  if (origin && !allowedOrigins.has(origin)) {
    return response(403, { message: 'Origin not allowed.' }, origin);
  }
  if (method === 'OPTIONS') return response(204, {}, origin);
  if (method && method !== 'POST') return response(405, { message: 'Method not allowed.' }, origin);

  try {
    if (!destinationEmail || !senderEmail) {
      console.error('Missing DESTINATION_EMAIL or SENDER_EMAIL environment variable.');
      return response(500, { message: 'Contact service is not configured.' }, origin);
    }

    const rawBody = event?.body || '{}';
    if (rawBody.length > 20000) return response(413, { message: 'Message is too large.' }, origin);
    const data = JSON.parse(rawBody);

    // Honeypot: bots commonly populate this hidden field.
    if (data.website) return response(200, { message: 'Message received.' }, origin);

    const name = clean(data.name, 120);
    const email = clean(data.email, 254);
    const company = clean(data.company, 160);
    const subject = cleanSubject(data.subject);
    const message = clean(data.message, 6000);

    if (!name || !email || !subject || !message) {
      return response(400, { message: 'Please complete all required fields.' }, origin);
    }
    if (!validEmail(email)) {
      return response(400, { message: 'Please enter a valid email address.' }, origin);
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

    return response(200, { message: 'Message sent successfully.' }, origin);
  } catch (error) {
    console.error('Contact form error:', error);
    return response(500, { message: 'Unable to send your message right now.' }, origin);
  }
};
