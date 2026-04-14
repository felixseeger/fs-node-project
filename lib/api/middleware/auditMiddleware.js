import { logAuditEvent } from '../services/auditLogger.js';

/**
 * Middleware that logs the details of the request for compliance and auditing.
 * It hooks into the response finish event to record the final status code.
 */
export const auditMiddleware = (actionName) => {
  return (req, res, next) => {
    // Determine action name based on route if not provided
    const action = actionName || (req.method + '_' + req.path.split('/').filter(Boolean).join('_').toUpperCase());
    
    res.on('finish', () => {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      const status = isSuccess ? 'SUCCESS' : 'FAILURE';
      
      const details = {
        statusCode: res.statusCode,
        query: req.query,
        // Log keys of the body but not the values to avoid sensitive info leaks
        bodyKeys: req.body ? Object.keys(req.body) : []
      };

      logAuditEvent({
        req,
        action,
        status,
        details
      });
    });

    next();
  };
};
