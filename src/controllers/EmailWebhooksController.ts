import { Request, Response } from 'express';
import { s3 } from '../clients/S3Client';
import { InboundMessage, Attachment } from 'postmark/dist/client/models';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export class EmailWebhooksController {
  private bucket = process.env.S3_BUCKET as string;

  async post(req: Request, res: Response) {
    const email = req.body as InboundMessage;
    const attachments = (email.Attachments ?? []) as Attachment[];

    if (!attachments.length) {
      return res.status(200).send('No attachments to upload');
    }

    // Use the first inbound "To" address as the S3 key prefix
    const toEmail = email.ToFull?.[0]?.Email;
    if (!toEmail) {
      return res.status(400).send('No valid To address found');
    }

    try {
      for (const att of attachments) {
        const key = `${toEmail}/${att.Name}`;
        const body = Buffer.from(att.Content, 'base64');

        await s3.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: att.ContentType,
          })
        );
      }

      return res.status(200).send('OK');
    } catch (err) {
      console.error('Error uploading attachments to S3', err);
      return res.status(500).send('Upload failed');
    }
  }
}

export const controller = new EmailWebhooksController();
