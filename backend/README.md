# dumm.cloud Secure Contact Backend

The portfolio contact form is designed so the destination email address never appears in browser HTML or JavaScript.

## Architecture

Browser -> API Gateway HTTP API -> Lambda -> Amazon SES -> private destination email

The Lambda also validates the request origin, checks required fields, validates the reply email, uses a hidden honeypot field for basic bot filtering, limits input sizes, and returns CORS headers for both `https://dumm.cloud` and `https://www.dumm.cloud`.

## Deploy with AWS SAM

Prerequisites: AWS CLI and AWS SAM CLI authenticated to the AWS account that hosts the contact backend.

From the repository root:

```bash
cd backend
sam build
sam deploy --guided
```

During guided deployment provide:

- `SenderEmail`: an SES-verified sender identity
- `DestinationEmail`: the private address that should receive website messages
- `AllowedOrigins`: keep the default `https://dumm.cloud,https://www.dumm.cloud`

The stack output named `ContactApiUrl` is the public HTTPS endpoint for the form.

## Connect the website

Put only the API endpoint in `contact-config.js`:

```js
window.CONTACT_API_URL = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/contact';
```

Do not put sender or destination email addresses in that file. Those values stay in Lambda environment variables created by CloudFormation.

## SES note

If the AWS account is still in the SES sandbox, the sender and destination identities must be verified. For normal public website use, request SES production access so visitors can use any valid reply-to email address.

## Security notes

- No email address or credential is exposed in the website source.
- The Lambda execution role only receives `ses:SendEmail` permission.
- Requests from unapproved browser origins are rejected.
- The frontend uses a request timeout and does not send cookies or credentials.
