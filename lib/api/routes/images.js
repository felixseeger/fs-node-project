/**
 * Image Generation Routes
 * Handles image generation via Freepik APIs (Mystic/Nano Banana, Kora)
 */

import { Router } from 'express';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import * as google from '../services/google.js';
import * as replicate from '../services/replicate.js';
import * as googleImageToImage from '../services/googleImageToImage.js';
import * as ideogram from '../services/ideogram.js';
import * as topaz from '../services/topaz.js';
import * as fluxKontext from '../services/fluxKontext.js';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { validate, validators } from '../middleware/validation.js';
import generateQueue from '../queue/index.js';

const router = Router();

// Configure multer for image uploads with limits
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 5, // Max 5 files
    parts: 10 // Max 10 parts
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

// Post-upload file type verification (magic numbers)
const verifyFileType = async (buffer) => {
  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    throw new Error('Could not determine file type from content');
  }
  
  const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff'];
  if (!allowedTypes.includes(type.ext)) {
    throw new Error(`File content type .${type.ext} not allowed`);
  }
  
  return type;
};

/**
 * POST /api/generate-image
 */
router.post('/generate-image',
  generationLimiter,
  validate([validators.prompt, validators.negativePrompt, validators.model, validators.aspectRatio, validators.resolution, validators.numImages, validators.imageUrls, validators.imageUrlItem]),
  async (req, res, next) => {
  try {
    console.log('[API] Route handler reached - no 403 block yet');
    const { model } = req.body;
    const selectedModel = model || 'Nano Banana 2';
    console.log(`[API] Generating image with model: ${selectedModel}, prompt: ${req.body.prompt?.substring(0, 50)}...`);

    let result;

    // Direct provider routing by model
    switch(true) {
      case selectedModel.startsWith('flux') || selectedModel === 'Flux':
        // Flux variants → Replicate (with image reference support)
        result = await generateQueue.add(() => replicate.generateImage({
          ...req.body,
          image: req.body.image || undefined
        }));
        break;
      case selectedModel === 'Nano Banana 2' ||
           selectedModel === 'Nano Banana 2 Pro':
        // Nano Banana variants → Google Gemini
        result = await generateQueue.add(() => google.generateImage(req.body));
        break;
      case selectedModel === 'google-imagegen-4':
        // Google Imagegen 4 → Google API (with image-to-image workaround if image provided)
        const googleService = req.body.image ? googleImageToImage : google;
        result = await generateQueue.add(() => googleService.generateImage(req.body));
        break;
      case selectedModel === 'ideogram-v3-turbo':
        // Ideogram V3 Turbo → Ideogram API (with character/style reference support)
        result = await generateQueue.add(() => ideogram.generateImage({
          ...req.body,
          image: req.body.image || undefined
        }));
        break;
      case selectedModel.includes('Recraft'):
        // Recraft → Route to recraft endpoint (handled separately)
        throw new Error('Recraft generation should be routed to /api/recraft');
      case selectedModel.includes('Quiver') || selectedModel.includes('quiver'):
        // Quiver → Route to quiver endpoint (handled separately)
        throw new Error('Quiver generation should be routed to /api/quiver');
      default:
        throw new Error(`Model "${selectedModel}" is not supported for image generation`);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/status/:taskId
 */
router.get('/status/:taskId', validate([validators.taskId]), async (req, res, next) => {
  try {
    const result = await freepik.getTaskStatus(req.params.taskId, req.query.model);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/topaz-upscale
 */
router.post('/topaz-upscale', generationLimiter, async (req, res, next) => {
  try {
    const result = await generateQueue.add(() => topaz.upscaleImage(req.body));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/flux-kontext-pro
 */
router.post('/flux-kontext-pro', generationLimiter, async (req, res, next) => {
  try {
    const result = await generateQueue.add(() => fluxKontext.generateImage(req.body));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/upload-image
 */
router.post('/upload-image', generationLimiter, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        status: 'error',
        error: 'No images uploaded',
        message: 'No images uploaded'
      });
    }

    let verifiedFiles;
    try {
      verifiedFiles = await Promise.all(
        req.files.map(async (file) => {
          const type = await verifyFileType(file.buffer);
          return { ...file, verifiedType: type };
        })
      );
    } catch (err) {
      return res.status(415).json({
        status: 'error',
        error: err.message,
        message: err.message
      });
    }

    const totalSize = verifiedFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      return res.status(413).json({
        status: 'error',
        error: 'Total upload size exceeds 50MB',
        message: 'Total upload size exceeds 50MB'
      });
    }

    const urls = verifiedFiles.map(file => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.verifiedType.mime};base64,${base64}`;
    });

    res.json({
      status: 'success',
      success: true,
      urls,
      count: urls.length
    });
  } catch (err) {
    console.error('[Upload Error]', err);
    next(err);
  }
});

export default router;
