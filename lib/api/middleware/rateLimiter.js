import rateLimit from 'express-rate-limit';

// Global limiter: 500 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for resource-intensive AI generation endpoints
// 20 requests per minute per IP
export const generationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    error: 'Too many generation requests. Please slow down and try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
