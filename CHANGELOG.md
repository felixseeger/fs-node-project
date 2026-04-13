# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `AGENTS.md` at the project root enforcing strict file organization and artifact storage policies for AI agents.

### Changed
- Massively reorganized the project root directory:
  - Relocated 26+ patch scripts (`patch_*.js/mjs/cjs/py`) to `scripts/patches/`.
  - Moved test scripts (`test_*.js`) to `tests/`.
  - Migrated analysis tools (`analyze.js`, `analyze.py`) to `scripts/`.
  - Consolidated 15+ documentation files (e.g., `PROJECT-ARCHITECTURE.md`, `SECURITY_ASSESSMENT.md`, `HARDENING_GUIDE.md`) to the `docs/` folder.
  - Moved miscellaneous assets (`layer-editor.jpg`) to `docs/`.

### Security

#### Assessment
- Completed comprehensive security audit of `/api` endpoint
- Identified 7 security gaps requiring attention
- Created detailed hardening guide (`HARDENING_GUIDE.md`)

#### Current Security Posture
- **Rate Limiting**: Partially implemented (global: 500/15min, generation: 20/min)
- **CORS**: Using default permissive configuration
- **Input Validation**: Missing centralized validation
- **Security Headers**: Not configured (Helmet missing)
- **Error Handling**: Basic implementation, may leak info in dev
- **File Uploads**: Basic validation (20MB limit, MIME type check)
- **Request Timeouts**: Not configured

#### Planned Hardening Actions (Priority Order)

**P0 (Critical)**:
- [ ] Install and configure Helmet security headers
- [ ] Implement request timeout middleware
- [ ] Enhance error sanitization for production

**P1 (High)**:
- [ ] Reduce and enhance rate limiting (100/15min global, 10/min generation)
- [ ] Restrict CORS to known origins only
- [ ] Review and reduce JSON body parser limit (50MB → 10MB)

**P2 (Medium)**:
- [ ] Add centralized input validation with express-validator
- [ ] Implement file type verification with magic numbers (file-type library)
- [ ] Add URL validation for external API calls

**P3 (Low)**:
- [ ] Add Redis-backed rate limiting for multi-instance deployments
- [ ] Secure health check endpoints
- [ ] Add security event logging

### Dependencies to Add
```
helmet ^7.1.0
express-validator ^7.0.1
connect-timeout ^1.9.0
file-type ^19.0.0
```

---

## [1.0.0] - Initial Release

### Added
- Express.js API server with ES modules
- Rate limiting middleware (basic implementation)
- CORS support
- File upload handling with Multer
- Image generation routes (Freepik, Google Gemini)
- Video generation routes (Kling, Runway, MiniMax, LTX, PixVerse)
- Audio generation routes (Freepik, ElevenLabs)
- Image editing routes (upscale, relight, style transfer, etc.)
- Workflow thumbnail upload with validation
- Queue-based concurrency control (p-queue)
- Error handling middleware

### Security (Initial)
- Basic rate limiting on all routes
- File type filtering for uploads (MIME type check)
- 20MB file upload limit
- PNG data URL validation for thumbnails
- Basic error handling with stack trace hiding
