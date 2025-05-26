import express from 'express';
import bodyParser from 'body-parser';
import { controller } from './controllers/EmailWebhooksController';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Postmark will POST inbound emails here
app.post('/webhooks/email', controller.post.bind(controller));

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`email-to-s3 listening on http://localhost:${port}`)
);
