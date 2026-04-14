import rateLimit from 'express-rate-limit';
import { storageGuard } from './storageGuard.js';

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
});

// Stricter AI generation limiter (base)
const baseGenerationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.GENERATION_RATE_LIMIT_MAX ? parseInt(process.env.GENERATION_RATE_LIMIT_MAX) : 10,
  message: {
    error: 'Too many generation requests. Maximum 10 per minute.',
    code: 'GENERATION_RATE_LIMIT'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Daily generation limit to protect from bankruptcy
export const dailyGenerationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 generations per day
  keyGenerator: (req) => {
    return req.user?.uid || req.ip;
  },
  message: {
    error: 'Daily generation limit reached. Please try again tomorrow.',
    code: 'DAILY_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generationLimiter = [baseGenerationLimiter, dailyGenerationLimiter, storageGuard];

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
const baseStrictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 per minute for video generation
  message: {
    error: 'Too many expensive operations requested. Maximum 5 per minute.',
    code: 'STRICT_RATE_LIMIT'
  },
});

export const strictLimiter = [baseStrictLimiter, dailyGenerationLimiter, storageGuard];
