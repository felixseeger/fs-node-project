# API Security Hardening Guide

> **Scope**: `/api` endpoint (Node.js/Express application)  
> **Last Updated**: 2026-04-11  
> **Framework**: Express.js 5.2.1 with ES modules

---

## Executive Summary

This guide provides comprehensive security hardening for the AI Pipeline Editor's API layer. The API serves as a proxy to multiple AI service providers (Anthropic, Google, Freepik, ElevenLabs, etc.) and handles file uploads, image/video generation, and workflow management.

### Current Security Posture

| Control | Status | Risk Level |
|---------|--------|------------|
| Rate Limiting | ⚠️ Partial | Medium |
| CORS | ⚠️ Default (permissive) | Medium |
| Input Validation | ❌ Missing | High |
| Security Headers | ❌ Missing | Medium |
| Error Handling | ⚠️ Basic | Low |
| File Upload Security | ⚠️ Basic | Medium |
| Request Timeouts | ❌ Missing | Medium |
| Authentication | ❌ Not Implemented | High |

---

## 1. OWASP API Security Alignment

This hardening guide addresses the following OWASP API Security Top 10 (2023) risks:

1. **API1:2023 - Broken Object Level Authorization** → Input validation & URL sanitization
2. **API2:2023 - Broken Authentication** → API key validation middleware
3. **API3:2023 - Broken Object Property Level Authorization** → Request body validation
4. **API4:2023 - Unrestricted Resource Consumption** → Rate limiting & request timeouts
5. **API6:2023 - Unrestricted Access to Sensitive Business Flows** → CORS tightening & origin validation
6. **API7:2023 - Server Side Request Forgery** → URL validation for external API calls
7. **API8:2023 - Security Misconfiguration** → Security headers & error handling
8. **API10:2023 - Unsafe Consumption of APIs** → External API timeout/retry logic

---

## 2. Immediate Hardening Actions

### 2.1 Security Headers (Helmet)

**Current State**: No security headers configured  
**Risk**: XSS, clickjacking, MIME sniffing attacks  
**Implementation**:

```javascript
// Add to api/server.js
import helmet from 'helmet';

// After app creation, before routes
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust for frontend needs
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.freepik.com", "https://api.anthropic.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // May conflict with external resources
}));
```

### 2.2 Request Timeout Configuration

**Current State**: No timeout handling  
**Risk**: Resource exhaustion from hung connections  
**Implementation**:

```javascript
// Add to api/server.js
import timeout from 'connect-timeout';

// Timeout middleware
const TIMEOUT_MS = 120000; // 2 minutes for generation endpoints

app.use((req, res, next) => {
  // Longer timeout for generation endpoints
  if (req.path.match(/\/(generate|upscale|relight|style-transfer|kling|runway|minimax|ltx|video)/)) {
    return timeout(TIMEOUT_MS)(req, res, next);
  }
  next();
});

// Error handler for timeouts
app.use((err, req, res, next) => {
  if (err.timeout) {
    return res.status(503).json({
      error: 'Request timeout - generation took too long',
      code: 'TIMEOUT'
    });
  }
  next(err);
});
```

### 2.3 Enhanced Rate Limiting

**Current State**: Basic global (500/15min) and generation (20/min) limiters  
**Improvements Needed**:

```javascript
// Update lib/api/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';

// Redis-based store for production (requires REDIS_URL env var)
const getStore = () => {
  if (process.env.REDIS_URL) {
    return new RedisStore({
      client: createClient({ url: process.env.REDIS_URL }),
      prefix: 'api:rl:'
    });
  }
  // Fallback to memory store (not suitable for multi-instance deployments)
  return undefined;
};

// Global limiter - reduce from 500 to 100 per 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Reduced from 500
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  // Add custom key generator for trusted proxies
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  }
});

// Stricter AI generation limiter
export const generationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // Reduced from 20
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

// Strict limiter for expensive operations
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 per minute for video generation
  message: {
    error: 'Too many video generation requests. Maximum 5 per minute.',
    code: 'STRICT_RATE_LIMIT'
  },
});
```

### 2.4 Input Validation Middleware

**Current State**: No centralized input validation  
**Risk**: Injection attacks, malformed data, DoS via large payloads  
**Implementation**:

```javascript
// Create lib/api/middleware/validation.js
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
```

### 2.5 Enhanced CORS Configuration

**Current State**: `app.use(cors())` - allows all origins  
**Implementation**:

```javascript
// Update api/server.js CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : process.env.NODE_ENV === 'production' 
    ? [] // Must be explicitly set in production
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
```

### 2.6 Request Size Limits Review

**Current State**: 50MB JSON limit  
**Recommendation**: 

```javascript
// Update api/server.js
app.use(express.json({ 
  limit: '10mb', // Reduced from 50MB
  strict: true,  // Only parse arrays and objects
  verify: (req, res, buf) => {
    // Store raw body for potential signature verification
    req.rawBody = buf;
  }
}));

// Separate limit for specific routes
app.use('/api/upload-image', express.json({ limit: '25mb' }));
app.use('/api/workflow-thumbnail', express.json({ limit: '15mb' }));
```

---

## 3. File Upload Security

### 3.1 Enhanced Multer Configuration

**Current State**: Basic file type checking, 20MB limit  
**Enhancement**:

```javascript
// Update lib/api/routes/images.js multer configuration
import { fileTypeFromBuffer } from 'file-type';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 20 * 1024 * 1024, // 20MB
    files: 5, // Max 5 files
    parts: 10 // Max 10 parts (files + fields)
  },
  fileFilter: async (req, file, cb) => {
    // Whitelist allowed MIME types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
    
    cb(null, true);
  }
});

// Post-upload file type verification (magic numbers)
const verifyFileType = async (buffer) => {
  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    throw new Error('Could not determine file type');
  }
  
  const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff'];
  if (!allowedTypes.includes(type.ext)) {
    throw new Error(`File type .${type.ext} not allowed`);
  }
  
  return type;
};
```

### 3.2 Image Processing Limits

```javascript
// Add to upload-image route
router.post('/upload-image', generationLimiter, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    // Verify file types with magic numbers
    const verifiedFiles = await Promise.all(
      req.files.map(async (file) => {
        try {
          const type = await verifyFileType(file.buffer);
          return { ...file, verifiedType: type };
        } catch (err) {
          throw new Error(`File ${file.originalname}: ${err.message}`);
        }
      })
    );
    
    // Check total batch size (prevent ZIP bomb-style attacks)
    const totalSize = verifiedFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      return res.status(413).json({ error: 'Total upload size exceeds 50MB' });
    }
    
    const urls = verifiedFiles.map(file => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.verifiedType.mime};base64,${base64}`;
    });
    
    res.json({ 
      success: true, 
      urls,
      count: urls.length 
    });
  } catch (err) {
    console.error('[API] Image upload failed:', err.message);
    next(err);
  }
});
```

---

## 4. Error Handling Improvements

### 4.1 Sanitized Error Responses

**Current Issue**: Error messages may leak internal details  
**Implementation**:

```javascript
// Update lib/api/middleware/errorHandler.js
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
  res.status(500).json({ 
    error: isProduction ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
    ...(isProduction ? {} : { path: req.path, method: req.method })
  });
}
```

---

## 5. Environment-Based Security Controls

### 5.1 Production Checklist

Add these environment variables to your production deployment:

```bash
# Required for production
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Optional: Redis for distributed rate limiting
REDIS_URL=redis://localhost:6379

# Request timeout configuration
REQUEST_TIMEOUT_MS=120000

# Rate limit configuration
GLOBAL_RATE_LIMIT_MAX=100
GENERATION_RATE_LIMIT_MAX=10

# Security
TRUST_PROXY=true  # If behind reverse proxy
```

### 5.2 Health Check Security

```javascript
// Enhance health check endpoint
app.get('/health', (req, res) => {
  // Don't expose sensitive info in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ...(!isProduction && {
      version: '1.0.0',
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    })
  };
  
  res.json(health);
});

// Add readiness probe for Kubernetes
app.get('/ready', (req, res) => {
  // Check critical dependencies
  const checks = {
    apiKeys: !!process.env.FREEPIK_API_KEY,
    // Add more checks as needed
  };
  
  const allReady = Object.values(checks).every(Boolean);
  
  res.status(allReady ? 200 : 503).json({
    ready: allReady,
    checks
  });
});
```

---

## 6. Implementation Priority Matrix

| Priority | Control | Effort | Impact | File(s) |
|----------|---------|--------|--------|---------|
| **P0 (Critical)** | Security Headers (Helmet) | Low | High | `api/server.js` |
| **P0** | Request Timeouts | Low | High | `api/server.js` |
| **P0** | Enhanced Error Sanitization | Low | High | `lib/api/middleware/errorHandler.js` |
| **P1 (High)** | Rate Limiting Improvements | Medium | High | `lib/api/middleware/rateLimiter.js` |
| **P1** | CORS Restriction | Low | Medium | `api/server.js` |
| **P1** | Request Size Limits | Low | Medium | `api/server.js` |
| **P2 (Medium)** | Input Validation | Medium | High | New: `lib/api/middleware/validation.js` |
| **P2** | File Upload Verification | Medium | Medium | `lib/api/routes/images.js` |
| **P3 (Low)** | Redis Rate Limiting | High | Medium | `lib/api/middleware/rateLimiter.js` |
| **P3** | Health Check Hardening | Low | Low | `api/server.js` |

---

## 7. Testing Security Controls

### 7.1 Rate Limiting Test

```bash
# Test global rate limit
for i in {1..110}; do 
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/health
done

# Should see 429 responses after 100 requests
```

### 7.2 File Upload Security Test

```bash
# Test oversized file
curl -X POST http://localhost:3001/api/upload-image \
  -F "images=@/path/to/30mb-file.jpg" \
  -w "\n%{http_code}\n"

# Test wrong file type
curl -X POST http://localhost:3001/api/upload-image \
  -F "images=@/path/to/malicious.exe" \
  -w "\n%{http_code}\n"
```

### 7.3 CORS Test

```bash
# Test from unauthorized origin
curl -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3001/api/generate-image \
  -w "\n%{http_code}\n"
```

---

## 8. Dependencies to Add

```json
{
  "dependencies": {
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "connect-timeout": "^1.9.0",
    "file-type": "^19.0.0"
  }
}
```

Install with:
```bash
cd api && npm install helmet express-validator connect-timeout file-type
```

---

## 9. Monitoring & Alerting

Add monitoring for these security events:

1. **Rate limit triggers** - Log when IPs hit rate limits
2. **File upload rejections** - Track blocked file types
3. **CORS violations** - Log unauthorized origin attempts
4. **Error spikes** - Alert on 5xx error rate increase
5. **Request timeout events** - Monitor slow endpoints

---

## Appendix A: Security Checklist

- [ ] Helmet security headers configured
- [ ] Request timeouts implemented
- [ ] Rate limiting enhanced with IP validation
- [ ] CORS restricted to known origins
- [ ] Input validation middleware created
- [ ] File uploads verified with magic numbers
- [ ] Error messages sanitized in production
- [ ] Request size limits reviewed
- [ ] Health endpoint secured
- [ ] Security event logging added
- [ ] Penetration testing performed
- [ ] Dependency audit (`npm audit`)

---

## Appendix B: Incident Response

### If API is under attack:

1. **Immediate**:
   - Enable stricter rate limits
   - Block suspicious IPs at firewall level
   - Enable request logging

2. **Short-term**:
   - Review access logs
   - Identify attack patterns
   - Implement additional filters

3. **Long-term**:
   - Consider WAF (Cloudflare/AWS WAF)
   - Implement API authentication
   - Add geographic restrictions if applicable
