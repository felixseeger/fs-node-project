/**
 * AI Pipeline Editor - Backend API
 * 
 * A modular Express.js server providing AI generation capabilities:
 * - Image generation (Nano Banana, Kora)
 * - Image editing (upscale, relight, style transfer, etc.)
 * - Video generation (Kling, Runway, MiniMax, etc.)
 * - Audio generation (music, sound effects)
 * - Vision analysis (Claude Sonnet)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

// Mount all API routes
app.use(routes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Check API keys
const hasFreepikKey = !!process.env.FREEPIK_API_KEY;
const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;

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
║   ${hasFreepikKey ? '✅' : '❌'} Freepik API (images, video, audio)               ║
║   ${hasAnthropicKey ? '✅' : '❌'} Anthropic API (Claude Vision)                 ║
║   ${hasElevenLabsKey ? '✅' : '❌'} ElevenLabs API (Voiceover)                    ║
║                                                            ║
║   Available endpoints:                                     ║
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
});

export default app;
