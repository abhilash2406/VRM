import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Configure S3 Client to connect to Backblaze B2 using the S3-compatible API.
 * The credentials come from the .env configuration.
 */
const b2Client = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID,
    secretAccessKey: process.env.BACKBLAZE_APP_KEY,
  },
  // Ensure path style is used if virtual-hosted styling fails or is not preferred
  forcePathStyle: false,
});

const bucketName = process.env.BACKBLAZE_BUCKET_NAME;

/**
 * Uploads a file buffer to Backblaze B2.
 * @param {string} name - Original filename
 * @param {Buffer} buffer - File data
 * @param {string} mimetype - MIME type of the file
 * @param {string|null} customKey - Optional custom path/key to save under
 * @returns {Promise<string>} The key (path) of the uploaded file
 */
export const uploadToB2 = async (name, buffer, mimetype, customKey = null) => {
  if (!name) name = 'file';
  const key = customKey || `uploads/${Date.now()}-${name.replace(/\s+/g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await b2Client.send(command);
  return key;
};

/**
 * Deletes a file from Backblaze B2.
 * @param {string} key - The key/path of the file to delete
 * @returns {Promise<boolean>}
 */
export const deleteFromB2 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await b2Client.send(command);
  return true;
};

/**
 * Generates a public URL for a file stored in Backblaze B2.
 * Note: The bucket must be configured as "Public" in B2 settings for this URL to work without auth.
 * @param {string} key - The key/path of the file
 * @returns {string} The public URL
 */
export const generateB2PublicUrl = (key) => {
  // Using the path-style endpoint for public access: https://s3.<region>.backblazeb2.com/<bucket>/<key>
  return `${process.env.BACKBLAZE_ENDPOINT}/${bucketName}/${key}`;
};

/**
 * Generates a pre-signed URL for a file stored in a private Backblaze B2 bucket.
 * @param {string} key - The key/path of the file
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string>} The pre-signed URL
 */
export const generateB2PresignedUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return await getSignedUrl(b2Client, command, { expiresIn });
};

export default {
  uploadToB2,
  deleteFromB2,
  generateB2PublicUrl,
  generateB2PresignedUrl,
  b2Client,
};
