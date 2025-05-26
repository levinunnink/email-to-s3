import { Request, Response } from 'express';
import { storageClient } from '../clients/StorageClient';
import { InboundMessage, Attachment } from 'postmark/dist/client/models';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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

    try {
      for (const att of attachments) {
        const key = `${toEmail}/${att.Name}`;
        const body = Buffer.from(att.Content, 'base64');

        await storageClient.send(
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
      console.error('Error uploading attachments', err);
      return res.status(500).send('Upload failed');
    }
  }
}

export const controller = new EmailWebhooksController();
