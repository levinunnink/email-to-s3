import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { controller } from './controllers/EmailWebhooksController';
import { controller as files } from './controllers/FilesController';
import { auth } from './middleware/auth';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Postmark will POST inbound emails here
app.post('/webhooks/email', controller.post.bind(controller));

app.use(auth);
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204
}));
app.get('/files', files.get.bind(files));

export default app;
