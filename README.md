# AI Cloud Projects Portfolio

A responsive static website designed for an AWS / AI / Cloud Security portfolio.

## Files
- `index.html` — site content
- `styles.css` — visual design and responsive layout
- `script.js` — mobile navigation and reveal animations

## Customize before publishing
Search `index.html` for these placeholders and replace them:
- `your-email@example.com`
- LinkedIn URL
- GitHub URL
- About Me paragraphs
- Project descriptions and project links

## Option 1: AWS Amplify Hosting
1. Create a GitHub repository and add these files.
2. Open AWS Amplify in the AWS Console.
3. Choose **Deploy an app** / connect your Git repository.
4. Select your repository and branch.
5. Amplify detects the static site and deploys it.
6. Add a custom domain from Amplify when ready.

## Option 2: Amazon S3 + CloudFront
1. Create an S3 bucket for the site files.
2. Upload `index.html`, `styles.css`, and `script.js`.
3. Keep the S3 bucket private for a production setup.
4. Create a CloudFront distribution using the S3 bucket as the origin.
5. Configure the default root object as `index.html`.
6. Use Origin Access Control (OAC) so CloudFront can securely access the private bucket.
7. Add an ACM TLS certificate and Route 53 DNS record if you use a custom domain.

## Local preview
Open `index.html` in a browser, or run a simple local web server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.
