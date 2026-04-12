import { body, param, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(v => v.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  };
};

// Common validators
export const validators = {
  prompt: body('prompt')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 4000 })
    .withMessage('Prompt must be a string with max 4000 characters'),
  
    negativePrompt: body('negative_prompt')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 4000 })
    .withMessage('Negative prompt must be a string with max 4000 characters'),
  
  imageUrls: body('image_urls')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Image URLs must be an array (max 5)'),
    
  imageUrlItem: body('image_urls.*')
    .optional()
    .isString()
    .isURL({ protocols: ['http', 'https', 'data'] })
    .withMessage('Invalid image URL format in array'),
    
  model: body('model')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Invalid model name format'),

  aspectRatio: body('aspect_ratio')
    .optional()
    .isString()
    .isIn(['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '4:5', '5:4'])
    .withMessage('Invalid aspect ratio'),

  resolution: body('resolution')
    .optional()
    .isString()
    .isIn(['1K', '2K', '4K'])
    .withMessage('Invalid resolution'),

  numImages: body('num_images')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Number of images must be an integer between 1 and 4'),

  imageUrl: body('image_url')
    .optional()
    .isString()
    .isURL({ protocols: ['http', 'https', 'data'] })
    .withMessage('Invalid image URL format'),
  
  taskId: param('taskId')
    .optional()
    .isString()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .isLength({ max: 128 })
    .withMessage('Invalid task ID format'),
  
  workflowId: body('workflowId')
    .optional()
    .isString()
    .isLength({ min: 1, max: 64 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invalid workflow ID format'),
};
