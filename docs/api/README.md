# Nodespace API Documentation

This document is the first pass of the backend API documentation for the AI Pipeline Editor / Nodespace app.

The backend is an Express API mounted from [`lib/api/routes`](../../lib/api/routes) and exposed by [`api/server.js`](../../api/server.js). Most routes proxy to third-party AI providers and follow a small set of recurring patterns.

## Base URL

- Development: `http://localhost:3001`
- Production: same origin as the deployed frontend

## Current Architecture

- Express 5 app with modular route files
- JSON request bodies up to `50mb`
- CORS enabled
- Global rate limiting on all requests
- Stricter rate limiting on generation-heavy endpoints
- No user auth on the current API surface
- Most media generation endpoints are async job starters plus polling endpoints

## Rate Limits

Defined in [`lib/api/middleware/rateLimiter.js`](../../lib/api/middleware/rateLimiter.js):

- Global limiter: `500` requests per `15` minutes per IP
- Generation limiter: `20` requests per minute per IP

When a limit is hit, the API returns a JSON error message.

## Error Format

Defined in [`lib/api/middleware/errorHandler.js`](../../lib/api/middleware/errorHandler.js).

Common shapes:

```json
{ "error": "Not found", "path": "/api/unknown", "method": "GET" }
```

```json
{ "error": "Image URL is required" }
```

```json
{
  "error": "Provider failure message",
  "path": "/api/generate-image",
  "method": "POST"
}
```

## Common Response Patterns

### 1. Async generation job

Typical flow:

1. `POST` to start a job
2. Receive provider-style task metadata, usually with `data.id`
3. `GET` a polling endpoint until `data.status === "COMPLETED"` or `FAILED`

Typical polling response:

```json
{
  "data": {
    "id": "task_123",
    "status": "COMPLETED",
    "generated": ["https://..."]
  }
}
```

### 2. Synchronous utility response

Example:

```json
{
  "analysis": "Detailed Claude vision analysis..."
}
```

### 3. Success envelope

Some utility endpoints return:

```json
{
  "success": true,
  "workflow": {}
}
```

## Endpoint Inventory

### Health and Utility

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Service health check |
| `GET` | `/api/generate-name` | Generate a project name |

### Image Generation

Routes in [`lib/api/routes/images.js`](../../lib/api/routes/images.js).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/generate-image` | Main image generation endpoint using Google Imagen fallback or Freepik |
| `POST` | `/api/generate-kora` | Realism-focused image generation |
| `GET` | `/api/status/:taskId` | Generic image-generation status polling |
| `POST` | `/api/upload-image` | Upload up to 5 images and return data URLs |

Notes:

- `POST /api/generate-image` accepts a flexible JSON body. Known fields include `model`, `prompt`, and optional image reference fields forwarded to provider services.
- `POST /api/upload-image` is multipart form-data, field name `images`.

### Image Editing

Routes in [`lib/api/routes/imageEditing.js`](../../lib/api/routes/imageEditing.js).

| Start Job | Poll Status | Purpose |
|---|---|---|
| `POST /api/upscale-creative` | `GET /api/upscale-creative/:taskId` | Creative upscale |
| `POST /api/upscale-precision` | `GET /api/upscale-precision/:taskId` | Precision upscale |
| `POST /api/relight` | `GET /api/relight/:taskId` | Relight image |
| `POST /api/style-transfer` | `GET /api/style-transfer/:taskId` | Style transfer |
| `POST /api/image-expand` | `GET /api/image-expand/:taskId` | Flux image outpaint/expand |
| `POST /api/seedream-expand` | `GET /api/seedream-expand/:taskId` | Seedream image expand |
| `POST /api/ideogram-expand` | `GET /api/ideogram-expand/:taskId` | Ideogram image expand |
| `POST /api/skin-enhancer/:mode` | `GET /api/skin-enhancer/:taskId` | Skin enhancement mode |
| `POST /api/ideogram-inpaint` | `GET /api/ideogram-inpaint/:taskId` | Ideogram inpaint |
| `POST /api/change-camera` | `GET /api/change-camera/:taskId` | Camera angle change |

Standalone route:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/remove-background` | Remove background, requires `image_url` |
| `POST` | `/api/reimagine-flux` | Flux reimagine |

### Vision and LLM Utilities

Routes in [`lib/api/routes/vision.js`](../../lib/api/routes/vision.js).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/analyze-image` | Claude-based image analysis |
| `POST` | `/api/image-to-prompt` | Generate prompt from image |
| `GET` | `/api/image-to-prompt/:taskId` | Poll image-to-prompt task |
| `POST` | `/api/improve-prompt` | Improve a prompt |
| `GET` | `/api/improve-prompt/:taskId` | Compatibility status route, currently always completed |
| `POST` | `/api/classifier/image` | AI image classification |
| `POST` | `/api/text-to-icon` | Generate icon from text |
| `GET` | `/api/text-to-icon/:taskId` | Poll text-to-icon task |

Key request notes:

- `POST /api/analyze-image` accepts `images`, `prompt`, `systemDirections`
- `POST /api/image-to-prompt` accepts `image_url` or `image`
- `POST /api/improve-prompt` requires `prompt`; optional `type`, `language`
- `POST /api/classifier/image` accepts `image_url` or `image`

### Video Generation and Editing

Routes in [`lib/api/routes/videos.js`](../../lib/api/routes/videos.js).

| Start Job | Poll Status | Purpose |
|---|---|---|
| `POST /api/kling-elements-pro` | `GET /api/kling-elements-pro/:taskId` | Kling Elements Pro |
| `POST /api/kling3/:mode` | `GET /api/kling3/:taskId` | Kling 3, `mode` = `pro` or `std` |
| `POST /api/kling3-omni/:mode` | `GET /api/kling3-omni/:taskId` | Kling 3 Omni |
| `POST /api/kling3-motion/:mode` | `GET /api/kling3-motion/:mode/:taskId` | Kling 3 Motion Control |
| `POST /api/kling-o1/:mode` | `GET /api/kling-o1/:taskId` | Kling O1 |
| `POST /api/minimax` | `GET /api/minimax/:taskId` | MiniMax |
| `POST /api/minimax-live` | `GET /api/minimax-live/:taskId` | MiniMax Live |
| `POST /api/wan-v2-6/:mode/:resolution` | `GET /api/wan-v2-6/:mode/:resolution/:taskId` | WAN 2.6 |
| `POST /api/seedance-1-5-pro/:resolution` | `GET /api/seedance-1-5-pro/:resolution/:taskId` | Seedance 1.5 Pro |
| `POST /api/ltx-2-pro/:mode` | `GET /api/ltx-2-pro/:mode/:taskId` | LTX Video 2 Pro |
| `POST /api/runway-4-5/:mode` | `GET /api/runway-4-5/:mode/:taskId` | Runway 4.5 |
| `POST /api/runway-gen4-turbo` | `GET /api/runway-gen4-turbo/:taskId` | Runway Gen4 Turbo |
| `POST /api/runway-act-two` | `GET /api/runway-act-two/:taskId` | Runway Act Two |
| `POST /api/pixverse-v5` | `GET /api/pixverse-v5/:taskId` | PixVerse V5 |
| `POST /api/pixverse-v5-transition` | `GET /api/pixverse-v5-transition/:taskId` | PixVerse V5 Transition |
| `POST /api/omni-human-1-5` | `GET /api/omni-human-1-5/:taskId` | OmniHuman 1.5 |
| `POST /api/vfx` | `GET /api/vfx/:taskId` | VFX processing |
| `POST /api/video-upscale/creative` | `GET /api/video-upscale/:taskId` | Creative video upscale |
| `POST /api/video-upscaler-precision` | `GET /api/video-upscaler-precision/:taskId` | Precision video upscale |

Special-case direct response route:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/ltx-direct/:mode` | Calls LTX directly and returns base64 MP4 immediately |

### Audio

Routes in [`lib/api/routes/audio.js`](../../lib/api/routes/audio.js).

| Start Job | Poll Status | Purpose |
|---|---|---|
| `POST /api/music-generation` | `GET /api/music-generation/:taskId` | Music generation |
| `POST /api/sound-effects` | `GET /api/sound-effects/:taskId` | Sound effects |
| `POST /api/audio-isolation` | `GET /api/audio-isolation/:taskId` | Audio isolation |
| `POST /api/voiceover` | `GET /api/voiceover/:taskId` | ElevenLabs voiceover |

Additional utility:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/voiceover/voices` | List available ElevenLabs voices |

### AI Workflow Assistant

Routes in [`lib/api/routes/aiWorkflow.js`](../../lib/api/routes/aiWorkflow.js).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/ai-workflow/generate` | Generate a node workflow from natural language |
| `POST` | `/api/ai-workflow/suggest` | Suggest nodes for a partial prompt |
| `GET` | `/api/ai-workflow/patterns` | List supported workflow patterns |
| `GET` | `/api/ai-workflow/nodes` | List node catalog grouped by category |
| `POST` | `/api/ai-chat` | General assistant chat endpoint |

### Recraft

Routes in [`lib/api/routes/recraft.js`](../../lib/api/routes/recraft.js).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/recraft/generate` | Recraft image generation |
| `POST` | `/api/recraft/image-to-image` | Recraft image-to-image |
| `POST` | `/api/recraft/vectorize` | Vectorize raster input |
| `POST` | `/api/recraft/remove-background` | Remove background |
| `POST` | `/api/recraft/upscale` | Recraft upscale, `type` defaults to `crisp` |

These routes require `image_url` where image input is needed.

### Quiver

Routes in [`lib/api/routes/quiver.js`](../../lib/api/routes/quiver.js).

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/quiver/svgs/generations` | Generate SVG via Quiver |
| `POST` | `/api/quiver/svgs/vectorizations` | Vectorize SVG via Quiver |

## Known Documentation Gaps

This first pass is route-complete, but not yet payload-complete.

Still needed:

- Per-endpoint request body schemas derived from provider adapters
- Concrete success payload examples for every provider
- Enum documentation for provider-specific fields like `mode`, `resolution`, and model names
- Interactive docs wiring, for example Swagger UI or Redoc
- Automated spec validation in CI

## OpenAPI Starter

An OpenAPI starter spec lives at [`docs/api/openapi.yaml`](./openapi.yaml).

It currently captures:

- All public backend paths
- Shared response patterns
- Main tags and route grouping
- Core request/response structure where known

## Next Recommended Steps

1. Expand request/response schemas using the provider service files in `lib/api/services`.
2. Add example payloads taken from the frontend node implementations.
3. Validate the OpenAPI spec with a linter.
4. Mount Swagger UI or Redoc in development.
