// Runtime contact endpoint configuration.
// Keep email addresses and credentials out of browser code.
window.CONTACT_API_URL = 'https://v5u4ucab2mc3lznhms54fkgwfe0tfejo.lambda-url.us-east-2.on.aws/';

// Cloudflare Turnstile site key is intentionally public and safe for browser use.
// The Turnstile secret must remain server-side in AWS Lambda configuration.
window.TURNSTILE_SITE_KEY = '0x4AAAAAAE4Dtepok5rdpb-s';
