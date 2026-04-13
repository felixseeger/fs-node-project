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
 * Performs compositing of multiple layers.
 * @param {Array<{url: string, left?: number, top?: number, blend?: string, opacity?: number}>} layers 
 * @returns {Promise<Buffer>}
 */
export async function compositeImages(layers) {
  if (!layers || !Array.isArray(layers) || layers.length === 0) {
    throw new Error('No layers provided for compositing');
  }

  const baseLayer = layers[0];
  let baseBuffer = await fetchImageBuffer(baseLayer.url);
  
  if (baseLayer.opacity !== undefined && baseLayer.opacity >= 0 && baseLayer.opacity < 1) {
    baseBuffer = await sharp(baseBuffer)
      .ensureAlpha()
      .composite([
        {
          input: Buffer.from([255, 255, 255, Math.round(baseLayer.opacity * 255)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in'
        }
      ])
      .toBuffer();
  }

  let baseImage = sharp(baseBuffer);

  const overlays = [];
  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    let overlayBuffer = await fetchImageBuffer(layer.url);
    
    if (layer.opacity !== undefined && layer.opacity >= 0 && layer.opacity < 1) {
      overlayBuffer = await sharp(overlayBuffer)
        .ensureAlpha()
        .composite([
          {
            input: Buffer.from([255, 255, 255, Math.round(layer.opacity * 255)]),
            raw: { width: 1, height: 1, channels: 4 },
            tile: true,
            blend: 'dest-in'
          }
        ])
        .toBuffer();
    }

    overlays.push({
      input: overlayBuffer,
      top: parseInt(layer.top || 0, 10),
      left: parseInt(layer.left || 0, 10),
      blend: layer.blend || 'over'
    });
  }

  if (overlays.length > 0) {
    baseImage = baseImage.composite(overlays);
  }

  return await baseImage.toBuffer();
}

/**
 * Resizes an image to target dimensions.
 */
export async function resizeImage(imageUrl, width, height, fit = 'contain') {
  const image = await getImage(imageUrl);
  return await image
    .resize(parseInt(width, 10), parseInt(height, 10), { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
}

/**
 * Converts image to a specific format.
 */
export async function convertFormat(imageUrl, format = 'png') {
  const image = await getImage(imageUrl);
  return await image.toFormat(format).toBuffer();
}
