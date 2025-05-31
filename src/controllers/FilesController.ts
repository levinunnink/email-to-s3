import { Request, Response } from 'express';
import crypto from 'crypto';
import { storageClient } from '../clients/StorageClient';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class FilesController {
  private bucket = process.env.STORAGE_BUCKET as string;

  // Get method to list contents in S3 bucket based on the user email
  async get(req: Request & { user?: any }, res: Response) {
    try {
      console.log('req.user', req.user);
      const email = req.user?.email;
      if (!email) {
        return res.status(400).json({ message: 'User email is required' });
      }

      const prefix = req.query.prefix as string || '';
      const cursor = req.query.cursor as string;

      // MD5 encode the user's email to create the base path
      const baseKey = crypto.createHash('md5').update(email).digest('hex');
      const fullPrefix = `${baseKey}/${prefix}`;

      // Set up S3 list parameters
      const listParams = {
        Bucket: this.bucket,
        Prefix: fullPrefix,
        ContinuationToken: cursor, // For pagination
      };

      const { Contents, NextContinuationToken } = await storageClient.send(
        new ListObjectsV2Command(listParams)
      );

      // Prepare the file listing data
      const fileList = await Promise.all(Contents?.map(async (item) => ({
        Key: item.Key,
        LastModified: item.LastModified,
        Size: item.Size,
        ReadUrl: (await getSignedUrl(storageClient, new GetObjectCommand({
          Bucket: this.bucket,
          Key: item.Key,
          ResponseContentDisposition: 'inline',
        }))),
      })) || []);

      return res.json({
        files: fileList,
        cursor: NextContinuationToken, // Next cursor for pagination
      });
    } catch (err) {
      console.error('Error fetching files', err);
      return res.status(500).json({ message: 'Error fetching files from S3' });
    }
  }
}

export const controller = new FilesController();
