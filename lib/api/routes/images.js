/**
 * Image Generation Routes
 * Handles image generation via Freepik APIs (Mystic/Nano Banana, Kora)
 */

import { Router } from 'express';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import * as freepik from '../services/freepik.js';
import * as google from '../services/google.js';
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
router.post('/generate-image', generationLimiter, validate([validators.prompt, validators.negativePrompt, validators.model, validators.aspectRatio, validators.resolution, validators.numImages, validators.imageUrls, validators.imageUrlItem]), async (req, res, next) => {
  try {
    const { model, prompt, image_urls } = req.body;
    console.log(`[API] Generating image with model: ${model || 'default'}, prompt: ${prompt?.substring(0, 50)}...`);
    
    const hasStructureReference = Array.isArray(image_urls) && image_urls.length > 0;
    const useGoogle = process.env.GOOGLE_GEMINI_API_KEY && 
                      !hasStructureReference &&
                      (model === 'freepik-mystic' || model === 'Nano Banana 2' || !model);

    let result;
    if (useGoogle) {
      result = await generateQueue.add(() => google.generateImage(req.body));
    } else {
      result = await generateQueue.add(() => freepik.generateImage(req.body));
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
 * POST /api/upload-image
 */
router.post('/upload-image', generationLimiter, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    const verifiedFiles = await Promise.all(
      req.files.map(async (file) => {
        try {
          const type = await verifyFileType(file.buffer);
          return { ...file, verifiedType: type };
        } catch (err) {
          throw new Error(`File ${file.originalname}: ${err.message}`);
        }
      })
    );
    
    const totalSize = verifiedFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      return res.status(413).json({ error: 'Total upload size exceeds 50MB' });
    }
    
    const urls = verifiedFiles.map(file => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.verifiedType.mime};base64,${base64}`;
    });
    
    res.json({ success: true, urls, count: urls.length });
  } catch (err) {
    if (!res.headersSent) {
      res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
});

export default router;
