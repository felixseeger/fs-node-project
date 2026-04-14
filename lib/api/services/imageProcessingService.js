import sharp from 'sharp';
import axios from 'axios';

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

async function fetchImageBuffer(imageUrl) {
  validateImageUrl(imageUrl);
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 50 * 1024 * 1024
    });
    return Buffer.from(response.data);
  } catch (error) {
    const status = error.response ? ` (Status: ${error.response.status})` : '';
    throw new Error(`Failed to fetch image from ${imageUrl}${status}: ${error.message}`);
  }
}

/**
 * Performs compositing of multiple layers and applies filters.
 * @param {Array<{url: string, x?: number, y?: number, blend?: string, opacity?: number}>} layers 
 * @param {Object} filters - Optional filters to apply to the final image (e.g., { blur: 5, grayscale: true })
 * @returns {Promise<Buffer>}
 */
export async function processAndCompositeImages(layers, filters = {}) {
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
      top: layer.y || layer.top || 0,
      left: layer.x || layer.left || 0,
      blend: layer.blend || 'over'
    });
  }

  if (overlays.length > 0) {
    baseImage = baseImage.composite(overlays);
  }

  // Apply filters if provided
  if (filters.blur) {
    baseImage = baseImage.blur(parseFloat(filters.blur));
  }
  if (filters.grayscale || filters.greyscale) {
    baseImage = baseImage.grayscale();
  }
  if (filters.brightness) {
    baseImage = baseImage.modulate({ brightness: parseFloat(filters.brightness) });
  }
  if (filters.saturation) {
    baseImage = baseImage.modulate({ saturation: parseFloat(filters.saturation) });
  }
  if (filters.hue) {
    baseImage = baseImage.modulate({ hue: parseInt(filters.hue, 10) });
  }
  if (filters.tint) {
    baseImage = baseImage.tint(filters.tint);
  }
  if (filters.negate) {
    baseImage = baseImage.negate();
  }
  if (filters.sharpen) {
    baseImage = baseImage.sharpen();
  }

  return await baseImage.toBuffer();
}
