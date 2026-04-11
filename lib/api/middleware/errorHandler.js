/**
 * Centralized Error Handler Middleware
 * Provides consistent and sanitized error responses across all routes
 */

export function errorHandler(err, req, res, next) {
  // Log full error internally
  console.error(`[Error] ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    code: err.code,
    status: err.status
  });
  
  // Don't leak internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Handle timeout errors
  if (err.timeout) {
    return res.status(503).json({
      error: 'Request timeout - generation took too long',
      code: 'TIMEOUT'
    });
  }

  // Handle specific error types
  if (err.status && err.status < 500) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code || 'CLIENT_ERROR'
    });
  }
  
  // Validation errors
  if (err.message && err.message.includes('required')) {
    return res.status(400).json({ 
      error: err.message,
      code: 'VALIDATION_ERROR'
    });
  }
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      code: 'FILE_SIZE_LIMIT'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      error: 'Too many files',
      code: 'FILE_COUNT_LIMIT'
    });
  }
  
  // External API errors - sanitize
  if (err.code && err.code.includes('EXTERNAL_')) {
    return res.status(502).json({
      error: 'External service error',
      code: 'EXTERNAL_SERVICE_ERROR'
    });
  }
  
  // Default to generic error
  res.status(err.status || 500).json({ 
    error: isProduction ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
    ...(isProduction ? {} : { path: req.path, method: req.method })
  });
}

/**
 * 404 Not Found Handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
}
