# Email to S3

Lightweight Express.js service that receives inbound emails via Postmark and uploads attachments to any S3-compatible block storage (AWS S3, Cloudflare R2, DigitalOcean Spaces, etc.) under the pattern `<email-address>/<attachment-name>`. No database dependencies.

- [![Deploy to AWS](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=email-to-s3&templateURL=https://raw.githubusercontent.com/levinunnink/email-to-s3/main/serverless.yml)
- [![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-lightgrey)](https://dash.cloudflare.com/?to=/pages/project-create&repo=https://github.com/levinunnink/email-to-s3)
- [![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/levinunnink/email-to-s3/tree/master)

## Features

- Receives inbound email webhooks from Postmark
- Uploads attachments to S3
- No database dependencies

## Requirements

- Node.js >= 14
- Credentials for your storage (Access Key and Secret)
- S3 bucket or bucket-equivalent name created in your provider
- Postmark server API token
- Serverless Framework installed (`npm install -g serverless`)

## Installation

```bash
git clone https://github.com/levinunnink/email-to-s3.git
cd email-to-s3
npm install
```

## Configuration

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```dotenv
# .env
STORAGE_ENDPOINT=https://<account>.<region>.r2.cloudflarestorage.com  # e.g. Cloudflare R2 endpoint
STORAGE_REGION=auto                             # Some providers may ignore region
STORAGE_ACCESS_KEY_ID=your-access-key-id
STORAGE_SECRET_ACCESS_KEY=your-secret-access-key
STORAGE_BUCKET=your-bucket-name
POSTMARK_SERVER_TOKEN=your-postmark-token
PORT=3000  
```

| Tip: For AWS S3, you can omit STORAGE_ENDPOINT (SDK will default to AWS)

## Development

```bash
npm run dev
```

Configure your Postmark inbound webhook to POST to `http://<your-host>/webhooks/email`.

## Build & Deployment

```bash
npm run build
npm start
```

### License

```MIT```


## Deploying with Serverless Framework

1. Install Serverless globally if you haven't yet: ```npm install -g serverless```
2. Configure AWS credentials (e.g. via aws configure).
3. Deploy your service: ```serverless deploy```
4. After deployment, note the generated endpoint under endpoints in the CLI output.
5. In Postmark, configure your inbound webhook to use: ```https://<your-api-id>.execute-api.<region>.amazonaws.com/dev/webhooks/email```
