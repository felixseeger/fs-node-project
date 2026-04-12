# Hardening Tasks - COMPLETED ✅

## API Security
- [x] TASK-001: Install dependencies (helmet, express-validator, connect-timeout, file-type)
- [x] TASK-002: Add Helmet headers to api/server.js
- [x] TASK-003: Add request timeouts to api/server.js
- [x] TASK-004: Sanitize error responses in lib/api/middleware/errorHandler.js
- [x] TASK-005: Update CORS and request size limits in api/server.js
- [x] TASK-006: Update rate limiting in lib/api/middleware/rateLimiter.js
- [x] TASK-007: Create lib/api/middleware/validation.js and add common validators
- [x] TASK-008: Implement magic number file type verification in upload-image route

## Frontend Type Safety
- [x] TASK-009: Create src/types/app.ts with PageType and EditorMode
- [x] TASK-010: Update App.tsx state types (currentPage, editorMode)
- [x] TASK-011: Replace null with undefined for optional state in App.tsx
- [x] TASK-012: Implement Connection -> Edge adapter in App.tsx
- [x] TASK-013: Add type narrowing for workflow data JSON parsing
- [x] TASK-014: Fix nodeTypes registry typing

## Backend Authentication (Phase 7.4)
- [x] TASK-015: Install firebase-admin for backend authentication.
- [x] TASK-016: Create auth middleware (`lib/api/middleware/auth.js`) to verify Firebase ID tokens.
- [x] TASK-017: Protect all generation and upload API routes by applying the auth middleware.
- [x] TASK-018: Update frontend API client (`frontend/src/utils/api.js`) to fetch and send `Authorization: Bearer <token>`.
