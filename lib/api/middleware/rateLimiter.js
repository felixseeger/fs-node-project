import rateLimit from 'express-rate-limit';

// Global limiter - reduce from 500 to 100 per 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.GLOBAL_RATE_LIMIT_MAX ? parseInt(process.env.GLOBAL_RATE_LIMIT_MAX) : 100,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  }
});

// Stricter AI generation limiter
export const generationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.GENERATION_RATE_LIMIT_MAX ? parseInt(process.env.GENERATION_RATE_LIMIT_MAX) : 10,
  message: {
    error: 'Too many generation requests. Maximum 10 per minute.',
    code: 'GENERATION_RATE_LIMIT'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Status check limiter (lighter - just polling)
export const statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // 1 per second for polling
  message: {
    error: 'Too many status checks. Please slow down polling.',
    code: 'POLLING_RATE_LIMIT'
  },
});

// Strict limiter for expensive operations (video, long-running tasks)
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 per minute for video generation
  message: {
    error: 'Too many expensive operations requested. Maximum 5 per minute.',
    code: 'STRICT_RATE_LIMIT'
  },
});
