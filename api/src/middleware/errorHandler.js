/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Application error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not found handler for unmatched routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
}

/**
 * Global error handler
 */
export function errorHandler(err, req, res, _next) {
  // Log error for debugging
  console.error(`[Error] ${err.message}`, {
    method: req.method,
    path: req.path,
    stack: err.stack,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Handle Firebase Auth errors
  if (err.code?.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: err.message,
      code: err.code,
    });
  }

  // Handle Firestore errors
  if (err.code?.startsWith('FIRESTORE_') || err.message?.includes('firestore')) {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while accessing the database',
      code: 'DATABASE_ERROR',
    });
  }

  // Handle Stripe errors
  if (err.type?.startsWith('Stripe')) {
    return res.status(400).json({
      error: 'Payment error',
      message: err.message,
      code: 'STRIPE_ERROR',
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: err.message,
      code: 'VALIDATION_ERROR',
    });
  }

  // Default: Internal server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  AppError,
  notFoundHandler,
  errorHandler,
  asyncHandler,
};
