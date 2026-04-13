import sharp from 'sharp';
import axios from 'axios';

/**
 * VFX Service for backend image processing using sharp.
 */

const ALLOWED_DOMAINS = [
  'amazonaws.com',
  'freepik.com',
  'firebasestorage.googleapis.com',
  'cloudinary.com',
  'klingai.com',
  'runwayml.com',
  'anthropic.com',
  'fal.media'
];

/**
 * Validates that the URL is a valid URL and belongs to a trusted domain.
 */
function validateImageUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const isAllowed = ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    if (!isAllowed) {
      throw new Error(`Domain ${hostname} is not in the allowlist`);
    }
    return true;
  } catch (err) {
    throw new Error(`Invalid or untrusted image URL: ${err.message}`);
  }
}

/**
 * Fetches an image buffer from a URL with validation and error handling.
 */
async function fetchImageBuffer(imageUrl) {
  validateImageUrl(imageUrl);
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 50 * 1024 * 1024 // 50MB limit
    });
    return Buffer.from(response.data);
  } catch (error) {
    const status = error.response ? ` (Status: ${error.response.status})` : '';
    throw new Error(`Failed to fetch image from ${imageUrl}${status}: ${error.message}`);
  }
}

/**
 * Fetches an image from a URL and returns a sharp instance.
 */
async function getImage(imageUrl) {
  const buffer = await fetchImageBuffer(imageUrl);
  return sharp(buffer);
}

/**
 * Performs basic compositing: places an overlay image on top of a base image.
 */
export async function compositeImages(baseImageUrl, overlayImageUrl, options = {}) {
  const base = await getImage(baseImageUrl);
  const overlayBuffer = await fetchImageBuffer(overlayImageUrl);

  const { left = 0, top = 0, blend = 'over' } = options;

  const resultBuffer = await base
    .composite([{
      input: overlayBuffer,
      top,
      left,
      blend
    }])
    .toBuffer();

  return resultBuffer;
}

/**
 * Resizes an image to target dimensions.
 */
export async function resizeImage(imageUrl, width, height, fit = 'contain') {
  const image = await getImage(imageUrl);
  return await image
    .resize(width, height, { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
}

/**
 * Converts image to a specific format.
 */
export async function convertFormat(imageUrl, format = 'png') {
  const image = await getImage(imageUrl);
  return await image.toFormat(format).toBuffer();
}
