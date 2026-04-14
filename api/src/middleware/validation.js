/**
 * Validation Middleware
 * Request validation using express-validator
 */
import { body, param, query, validationResult } from 'express-validator';

/**
 * Run validation and return errors if any
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  next();
}

/**
 * Validate workflow creation/update
 */
export const validateWorkflow = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be 1-100 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be under 1000 characters'),
  body('nodes')
    .optional()
    .isArray()
    .withMessage('Nodes must be an array'),
  body('edges')
    .optional()
    .isArray()
    .withMessage('Edges must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  validate,
];

/**
 * Validate profile update
 */
export const validateProfileUpdate = [
  body('bio')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be under 500 characters'),
  body('company')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company must be under 100 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('location')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be under 100 characters'),
  body('social')
    .optional()
    .isObject()
    .withMessage('Social must be an object'),
  validate,
];

/**
 * Validate preferences update
 */
export const validatePreferencesUpdate = [
  body('language')
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage('Language must be a valid code'),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('emailNotifications must be a boolean'),
  validate,
];

/**
 * Validate workflow ID parameter
 */
export const validateWorkflowId = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('Workflow ID is required'),
  validate,
];

/**
 * Validate pagination params
 */
export const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('cursor')
    .optional()
    .isString()
    .withMessage('Cursor must be a string'),
  query('orderBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name'])
    .withMessage('orderBy must be createdAt, updatedAt, or name'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  validate,
];

export default {
  validate,
  validateWorkflow,
  validateProfileUpdate,
  validatePreferencesUpdate,
  validateWorkflowId,
  validatePagination,
};
