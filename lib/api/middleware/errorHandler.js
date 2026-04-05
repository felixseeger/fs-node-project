/**
 * Centralized Error Handler Middleware
 * Provides consistent error responses across all routes
 */

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);
  
  // Handle specific error types
  if (err.status) {
    return res.status(err.status).json({ 
      error: err.message,
      details: err.data 
    });
  }
  
  // Validation errors
  if (err.message && err.message.includes('required')) {
    return res.status(400).json({ error: err.message });
  }
  
  // Default to 500 internal server error
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    path: req.path,
    method: req.method
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
