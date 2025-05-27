import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';

// Configure a client that works against AWS S3 or any S3‑compatible endpoint
export const storageClient = new S3Client({
  region: process.env.STORAGE_REGION,
  endpoint: process.env.STORAGE_ENDPOINT || undefined,
  forcePathStyle: true, // required for most S3‑compatible providers
  credentials: fromEnv(), // picks up ACCESS_KEY_ID and SECRET_ACCESS_KEY from env
});
