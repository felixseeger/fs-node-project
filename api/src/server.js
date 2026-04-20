/**
 * User Flow Backend API
 *
 * Complete user flow backend with:
 * - Firebase Authentication
 * - User profiles and preferences
 * - Workflow management (CRUD, forking, duplication)
 * - Subscription billing with Stripe
 * - Usage tracking and limits
 *
 * Architecture:
 * - Routes: Express route definitions
 * - Controllers: Request/response handling
 * - Services: Business logic
 * - Models: Firestore data access
 * - Middleware: Auth, validation, error handling
 */

import './env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import timeout from 'connect-timeout';
import userFlowRoutes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import { globalLimiter } from '../lib/api/middleware/rateLimiter.js';
import { generateProjectName } from './utils/nameGenerator.js';
import '../lib/api/services/renderingWorker.js';

const app = express();

// --- SECURITY MIDDLEWARE ---

// 1. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.freepik.com", "https://api.anthropic.com", "https://api.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. Request Timeout (2 minutes for AI generation)
const TIMEOUT_MS = process.env.REQUEST_TIMEOUT_MS ? parseInt(process.env.REQUEST_TIMEOUT_MS) : 120000;
app.use((req, res, next) => {
  if (req.path.match(/\/(generate|upscale|relight|style-transfer|kling|runway|minimax|ltx|video|music|voiceover)/)) {
    return timeout(TIMEOUT_MS)(req, res, next);
  }
  next();
});

// 3. Tightened CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176'];

app.use(cors({
  origin: (origin, callback) => {
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
  maxAge: 86400
}));

// 4. Request Size Limits
app.use(express.json({
  limit: '10mb',
  strict: true,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Apply global rate limiting
app.use(globalLimiter);

// Request logging middleware (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount user flow routes
app.use('/api', userFlowRoutes);

// Mount existing AI pipeline routes (from lib/api)
import legacyRoutes from '../lib/api/routes/index.js';
app.use(legacyRoutes);

// --- UTILITY ROUTES ---
app.get('/api/generate-name', (req, res) => {
  try {
    const projectName = generateProjectName();
    res.json({ name: projectName });
  } catch {
    res.status(500).json({ error: 'Failed to generate name' });
  }
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Check API keys
const hasFreepikKey = !!process.env.FREEPIK_API_KEY;
const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;
const hasLtxKey = !!process.env.LTX_API_KEY;
const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
const hasCloudinaryCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
const hasCloudinaryApiKey = !!process.env.CLOUDINARY_API_KEY;
const hasCloudinaryApiSecret = !!process.env.CLOUDINARY_API_SECRET;
const hasCloudinaryConfig = hasCloudinaryCloudName && hasCloudinaryApiKey && hasCloudinaryApiSecret;

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   AI Pipeline Editor API                                   ║
║   Server running on port ${PORT}                              ║
║                                                            ║
║   API Status:                                              ║
║   ${hasFreepekKey ? '✅' : '❌'} Freepik API (images, video, audio)               ║
║   ${hasAnthropicKey ? '✅' : '❌'} Anthropic API (Fallback Vision)                 ║
║   ${hasElevenLabsKey ? '✅' : '❌'} ElevenLabs API (Voiceover)                    ║
║   ${hasLtxKey ? '✅' : '❌'} LTX Video API (direct)                      ║
║   ${hasGeminiKey ? '✅' : '❌'} Google Gemini API (Gemini 3 Pro + Imagen 4)                 ║
║   ${hasStripeKey ? '✅' : '❌'} Stripe API (billing)                          ║
║   ${hasCloudinaryConfig ? '✅' : '❌'} Cloudinary API (workflow thumbnails)         ║
║                                                            ║
║   User Flow Endpoints:                                     ║
║   • Auth: POST /api/auth/verify, GET /api/auth/me          ║
║   • Profile: GET/PUT /api/profile                          ║
║   • Workflows: CRUD /api/workflows                         ║
║   • Billing: /api/billing/*                                ║
║   • Webhooks: POST /api/webhooks/stripe                    ║
║                                                            ║
║   AI Pipeline Endpoints:                                   ║
║   • Image Generation: /api/generate-image                  ║
║   • Image Editing: /api/upscale-creative, /api/relight     ║
║   • Video Generation: /api/kling3, /api/runway             ║
║   • Audio Generation: /api/music, /api/voiceover           ║
║   • Vision: /api/analyze-image                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);

  if (!hasFreepikKey) {
    console.warn('⚠️  WARNING: FREEPIK_API_KEY not set. Image/video/audio APIs will fail.');
  }
  if (!hasAnthropicKey) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set. Vision analysis API will fail.');
  }
  if (!hasElevenLabsKey) {
    console.warn('⚠️  WARNING: ELEVENLABS_API_KEY not set. Voiceover API will fail.');
  }
  if (!hasLtxKey) {
    console.warn('⚠️  WARNING: LTX_API_KEY not set. Direct LTX Video API will fail.');
  }
  if (!hasGeminiKey) {
    console.warn('⚠️  WARNING: GOOGLE_GEMINI_API_KEY not set. Nano Banana 2 (Google) integration will use Freepik fallback.');
  }
  if (!hasStripeKey) {
    console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not set. Billing APIs will fail.');
  }
  if (!hasCloudinaryConfig) {
    console.warn('⚠️  WARNING: CLOUDINARY_* env vars not fully set. Workflow thumbnail uploads will be skipped.');
  }
});

export default app;
