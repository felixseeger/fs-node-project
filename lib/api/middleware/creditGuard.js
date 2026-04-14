import { deductCredits } from '../utils/credits.js';

/**
 * Middleware to check and deduct credits before executing an AI task
 * @param {number|Function} cost - Fixed number or function (req) => number
 */
export const creditGuard = (cost) => {
  return async (req, res, next) => {
    // Return 401 if user not authenticated
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      });
    }

    const uid = req.user.uid;
    const requiredCredits = typeof cost === 'function' ? cost(req) : cost;

    try {
      // Perform atomic deduction
      const newBalance = await deductCredits(uid, requiredCredits);
      
      // Attach info for possible downstream use or logging
      req.creditInfo = {
        deducted: requiredCredits,
        newBalance: newBalance
      };

      next();
    } catch (error) {
      if (error.message === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json({
          error: 'Insufficient credits',
          code: 'PAYMENT_REQUIRED',
          required: requiredCredits
        });
      }
      
      console.error('[Credit Guard Error]', error.message);
      next(error);
    }
  };
};
