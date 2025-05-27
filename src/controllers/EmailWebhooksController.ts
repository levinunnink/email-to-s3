import { Request, Response } from 'express';
import crypto from 'crypto';
import { storageClient } from '../clients/StorageClient';
import nodePath from 'path';
import { client } from '../clients/EmailClient';
import { InboundMessage, Attachment } from 'postmark/dist/client/models';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class EmailWebhooksController {
  private bucket = process.env.STORAGE_BUCKET as string;

  async post(req: Request, res: Response) {
    const email = req.body as InboundMessage;
    const attachments = (email.Attachments ?? []) as Attachment[];

    if (!attachments.length) {
      return res.status(200).send('No attachments to upload');
    }

    const toEmail = email.ToFull?.[0]?.Email;
    if (!toEmail) {
      return res.status(400).send('No valid To address found');
    }
    const path = toEmail.includes('+') ? toEmail.split("+")[0] : toEmail.split("@")[0];
    const keys = [];
    const buf = Buffer.from(email.From, 'utf8');
    const fromKey = crypto.createHash('md5').update(buf).digest('hex');
    try {
      for (const att of attachments) {
        const key = `${fromKey}/${path}/${att.Name}`;
        keys.push(key);
        const body = Buffer.from(att.Content, 'base64');

        await storageClient.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: att.ContentType,
            Metadata: {
              FromEmail: email.From,
              Subject: email.Subject,
            }
          })
        );
      }
      if(process.env.SEND_EMAIL_RESPONSE) {
        const keysPublic = [];
        for(const key of keys) {
          const readCommand = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ResponseContentDisposition: 'inline',
          });
  
          const readURL = await getSignedUrl(storageClient, readCommand, { expiresIn: 60 * 60 });
          keysPublic.push(readURL);
        }
        const HtmlBody = `<p>Uploaded Attachments:</p> <ul>${
          keysPublic.map((key) => `<li><a href="${key}">${nodePath.basename(new URL(key).pathname)}</a></li>`).join('\n')
        }</ul><p>~ <a href="https://email-to-s3.email">Email to S3</a></p>`;
        const TextBody = `Uploaded Attachments:\n\n${
          keysPublic.map((key) => `- ${nodePath.basename(new URL(key).pathname)}: ${key}`).join('\n')
        }\n~ https://email-to-s3.email`;
        console.log('SEnding', TextBody);
        await client.sendEmail({
          "From": "levi@smmall.site",
          "To": email.From,
          "Subject": "Attachments uploaded",
          "HtmlBody": HtmlBody,
          "TextBody": TextBody,
          "MessageStream": "outbound"
        });
      }
      return res.status(200).send('OK');
    } catch (err) {
      console.error('Error uploading attachments', err);
      return res.status(500).send('Upload failed');
    }
  }
}

export const controller = new EmailWebhooksController();
