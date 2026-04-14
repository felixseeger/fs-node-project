import { Router } from 'express';
import * as recraft from '../services/recraft.js';
import { generationLimiter } from '../middleware/rateLimiter.js';
import generateQueue from '../queue/index.js';

const router = Router();

async function getBufferFromUrl(url) {
  if (url.startsWith('data:')) {
    const base64 = url.split(',')[1];
    return Buffer.from(base64, 'base64');
  }
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function getFilenameFromUrl(url, defaultName = 'image.png') {
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mimeMatch && mimeMatch[1]) {
      const ext = mimeMatch[1].split('/')[1];
      return `image.${ext}`;
    }
  }
  // Try to parse URL path
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.includes('.')) {
      return lastPart;
    }
  } catch { /* invalid URL — use defaultName */ }
  
  return defaultName;
}

// Generate Image
router.post('/recraft/generate', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Generate with prompt:', req.body.prompt?.substring(0, 50));
    const result = await generateQueue.add(() => recraft.generateImage(req.body));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft generation failed:', err.message);
    next(err);
  }
});

// Image to Image
router.post('/recraft/image-to-image', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Image-to-Image with prompt:', req.body.prompt?.substring(0, 50));
    const { image_url, ...params } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    const buffer = await getBufferFromUrl(image_url);
    const filename = getFilenameFromUrl(image_url);
    
    const result = await generateQueue.add(() => recraft.imageToImage(params, buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Image-to-Image failed:', err.message);
    next(err);
  }
});

// Vectorize
router.post('/recraft/vectorize', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Vectorize');
    const { image_url } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    const buffer = await getBufferFromUrl(image_url);
    const filename = getFilenameFromUrl(image_url);
    
    const result = await generateQueue.add(() => recraft.vectorize(buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Vectorize failed:', err.message);
    next(err);
  }
});

// Remove Background
router.post('/recraft/remove-background', generationLimiter, async (req, res, next) => {
  try {
    console.log('[API] Recraft Remove Background');
    const { image_url } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    let buffer;
    let filename;
    
    if (image_url.startsWith('data:image')) {
      const base64Data = image_url.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
      const mimeMatch = image_url.match(/data:(.*?);/);
      const extension = mimeMatch ? mimeMatch[1].split('/')[1] : 'jpg';
      filename = `image.${extension}`;
    } else {
      buffer = await getBufferFromUrl(image_url);
      filename = getFilenameFromUrl(image_url);
    }
    
    const result = await generateQueue.add(() => recraft.removeBackground(buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Remove Background failed:', err.message);
    next(err);
  }
});

// Upscale (Crisp/Creative)
router.post('/recraft/upscale', generationLimiter, async (req, res, next) => {
  try {
    const type = req.body.type || 'crisp';
    console.log(`[API] Recraft Upscale (${type})`);
    const { image_url } = req.body;
    if (!image_url) throw new Error('image_url is required');
    
    const buffer = await getBufferFromUrl(image_url);
    const filename = getFilenameFromUrl(image_url);
    
    const result = await generateQueue.add(() => recraft.upscale(type, buffer, filename));
    res.json(result);
  } catch (err) {
    console.error('[API] Recraft Upscale failed:', err.message);
    next(err);
  }
});

export default router;
