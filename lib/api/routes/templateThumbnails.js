import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { uploadTemplateCover } from '../services/firebaseStorage.js';

const router = Router();

const MAX_DATA_URL_SIZE_BYTES = 10 * 1024 * 1024; // ~10MB string payload cap
const PNG_DATA_URL_REGEX = /^data:image\/png;base64,[a-zA-Z0-9+/=\s]+$/;

router.post('/template-thumbnail', generationLimiter, async (req, res) => {
  try {
    const { imageDataUrl, templateId } = req.body || {};

    if (!imageDataUrl || !templateId) {
      return res.status(400).json({
        success: false,
        error: 'imageDataUrl and templateId are required',
      });
    }

    if (typeof imageDataUrl !== 'string' || !PNG_DATA_URL_REGEX.test(imageDataUrl)) {
      return res.status(400).json({
        success: false,
        error: 'imageDataUrl must be a valid PNG data URL',
      });
    }

    if (Buffer.byteLength(imageDataUrl, 'utf8') > MAX_DATA_URL_SIZE_BYTES) {
      return res.status(413).json({
        success: false,
        error: 'imageDataUrl too large',
      });
    }

    const { url, path } = await uploadTemplateCover(imageDataUrl, templateId);

    return res.json({
      success: true,
      url,
      path,
    });
  } catch (error) {
    console.error('[TemplateThumbnail] Upload failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload template thumbnail',
    });
  }
});

export default router;
