# email-to-s3

Express.js application to upload Postmark inbound email attachments to AWS S3. Each attachment is stored under a key with the pattern `<email-address>/<attachment-name>`.

[![Deploy to AWS](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=email-to-s3&templateURL=https://raw.githubusercontent.com/levinunnink/email-to-s3/main/serverless.yml)

## Features

- Receives inbound email webhooks from Postmark
- Uploads attachments to S3
- No database dependencies

## Requirements

- Node.js >= 14
- AWS credentials with S3 `PutObject` permissions
- Postmark server API token

## Installation

```bash
git clone https://github.com/<your-username>/email-to-s3.git
cd email-to-s3
npm install
```

## Configuration

Copy .env.example to .env and fill in your values:

```bash
PORT=3000
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket
POSTMARK_SERVER_TOKEN=your-postmark-token
```

## Development

```bash
npm run dev
```

Configure your Postmark inbound webhook to POST to http://<your-host>/webhooks/email.

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
