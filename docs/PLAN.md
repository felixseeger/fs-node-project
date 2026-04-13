# Hardening Implementation Plan - COMPLETED ✅

## Objective
Implement security and type-safety improvements as specified in the API Hardening Guide and Frontend Hardening Guide.

## Phase 1: API Security Hardening (P0-P1) - ✅ DONE
- [x] Install security dependencies
- [x] Configure Helmet security headers
- [x] Implement request timeouts
- [x] Sanitize error responses
- [x] Tighten CORS and request size limits
- [x] Enhance rate limiting

## Phase 2: API Input Validation (P2) - ✅ DONE
- [x] Create validation middleware
- [x] Implement magic number file type verification
- [x] Add request body/param validators

## Phase 3: Frontend TypeScript Hardening (Priority 2) - ✅ DONE
- [x] Define PageType and EditorMode literal unions
- [x] Standardize undefined vs null in App.tsx state
- [x] Implement Connection -> Edge adapter with handle validation
- [x] Fix Missing Properties (TS2339) in workflow data handling
- [x] Fix Component Registry generic typing

## Phase 4: Verification & Documentation - ✅ DONE
- [x] Run API security tests
- [x] Run frontend type-check
- [x] Update HARDENING_GUIDE.md and NEXT_PHASE_PLAN.md

## Phase 5: Video Editing Pipeline Integration (etro-js) - 🚀 PLANNED
- [ ] Offload `etro.Movie` rendering to Web Workers with `OffscreenCanvas`.
- [ ] Implement Dynamic Layer Management with low-res proxy support.
- [ ] Synchronize React State with `etro` timeline via non-blocking Refs.
- [ ] Integrate Hardware-Accelerated GLSL effects.
- [ ] Implement Server-Side rendering fallback for high-res exports.

## Phase 6: Node Capabilities & Safe Exports - 🚀 PLANNED
- [ ] Define and implement `capabilities` field for all node types.
- [ ] Build a robust Sanitization utility for workflow/code exports.
- [ ] Implement dynamic, topology-aware code generation in `ApiExportModal`.
- [ ] Add Chat Export functionality (Markdown/JSON).

## Phase 7: Advanced VFX Engine Integration - 🚀 PLANNED
- [ ] Provision dedicated GPU infrastructure (RunPod/Modal) for heavy VFX workloads.
- [ ] Implement Async Job Pattern (Submit -> Poll -> Complete) for VFX nodes.
- [ ] Integrate `sharp` for scalable backend image processing.
- [ ] Deliver `CorridorKeyNode` and `LtxVideoNode` using the new async pattern.

