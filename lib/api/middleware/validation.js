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
