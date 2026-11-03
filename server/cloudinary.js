import { createHash } from 'node:crypto';
import { isValidSession, requireEnv } from './session.js';

const UPLOAD_FOLDER = 'bumper-to-bumper-car-accessories';

/**
 * Returns a signature for a single Cloudinary upload into UPLOAD_FOLDER.
 * The API secret never leaves the server; the browser uploads straight to Cloudinary.
 */
export async function cloudinarySign({ method, headers }) {
  if (method !== 'POST') {
    return { status: 405, body: { error: 'Method not allowed' } };
  }
  if (!isValidSession(headers)) {
    return { status: 401, body: { error: 'Session expired. Please sign in again.' } };
  }

  requireEnv('CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET');

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${UPLOAD_FOLDER}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');

  return {
    status: 200,
    body: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: UPLOAD_FOLDER,
      timestamp,
      signature,
    },
  };
}
