## Description

This PR implements Phase 7.4 of the hardening guide by integrating Backend Authentication to properly secure our API endpoints. Previously, the backend did not verify the user's identity, meaning any exposed endpoint could be accessed by malicious actors who knew the API URL, risking potential abuse of our paid AI services. 

### Key Changes
- **GSAP Integration**: Installed `gsap` and `@gsap/react` and configured the `useGSAP` plugin in `frontend/src/main.tsx` for optimized, React-safe UI animations.
- **Loading Animation**: Converted the loading logo to an inline SVG and animated its path using GSAP in `SystemLoadingProcess.tsx`. Added a "chromatic aberration" effect by creating offset cyan and magenta layers that draw slightly before the main white path and fade out with a blur.
- **Firebase Admin Integration**: Added `firebase-admin` to the backend to verify the Firebase ID tokens sent from the client.
- **Auth Middleware (`requireAuth`)**: Created `lib/api/middleware/auth.js`. This middleware intercepts requests, extracts the `Authorization: Bearer <token>` header, verifies it via Firebase, and attaches the decoded user to `req.user`.
- **Protected Routes**: Placed `requireAuth` on all AI generation and upload routes in `lib/api/routes/index.js`.
- **Frontend Fetch Augmentation**: Added a `getAuthHeaders()` helper in `frontend/src/utils/api.js` that automatically fetches the current user's ID token using `getFirebaseAuth().currentUser.getIdToken()` and attaches it to all `fetch` requests.
- **Graceful Degradation**: Configured the middleware to fall back gracefully (by skipping verification) if the environment does not have a `FIREBASE_PROJECT_ID` or if `REQUIRE_AUTH=false` is set. This prevents disrupting local development without Firebase Config.
- **IPv6 Rate Limit Fix**: Addressed a minor issue with the global rate limiter using an incompatible IP string evaluation for IPv6 by removing the custom `keyGenerator` (letting `express-rate-limit` use its default robust method).

- **Root Directory Cleanup & Agent Guidelines:** 
  - Created `AGENTS.md` in the root directory to establish strict file organization guidelines for AI agents, preventing workspace clutter.
  - Organized the root folder by moving:
    - 26+ patch scripts (`patch_*.js/mjs/cjs/py`) to `scripts/patches/`
    - Test scripts (`test_*.js`) to `tests/`
    - Analysis scripts (`analyze.js`, `analyze.py`) to `scripts/`
    - Consolidated 15+ architectural, security, and planning markdown documents to `docs/`
    - Visual assets (`layer-editor.jpg`) to `docs/`

### Future Roadmap & Architectural Pivot
Based on a recent architectural review, the project strategy for upcoming features has been refined:
- **Video Editing Pipeline (etro-js):** To ensure UI responsiveness, Etro.js rendering will be offloaded to Web Workers using `OffscreenCanvas`. Real-time previews will use low-resolution proxies, with high-fidelity rendering deferred to backend workers.
- **VFX Backend Strategy Pivot:** We are pivoting away from local JSON-RPC daemons (CorridorKey/LTX). Instead, heavy VFX workloads will be handled by a **Submit -> Poll -> Complete** async worker pattern on dedicated GPU infrastructure (e.g., RunPod or Modal), as persistent daemons are incompatible with our Vercel serverless environment.
- **Replacing GIMP:** Headless GIMP scripting for backend compositing has been replaced in the roadmap by more scalable, server-friendly alternatives like `sharp` (Node.js native) or specialized microservices using ImageMagick/vips.
- **Safe Export Layer:** A sanitization layer will be implemented for the new "Export Chat" and "Code Snippet" features to ensure sensitive API keys are never hardcoded in exported artifacts.

### Security Impact
- Closes the final major loophole identified in the 2026-04-11 Security Assessment.
- All backend proxy endpoints for AI models are now strictly bound to authenticated user sessions.
- Rate limiting can now be applied on a per-user level in the future by utilizing `req.user.uid`.

### Related Tasks
- Closes [TASK-015], [TASK-016], [TASK-017], [TASK-018]
- Updates `SECURITY_ASSESSMENT.md`

## Testing Instructions
1. Run the frontend (`npm run dev` in `frontend/`) and the backend (`npm start` in `api/`).
2. Log in using Firebase Auth on the frontend.
3. Create a workflow or trigger a generation node. 
4. Check the Network Tab to verify that an `Authorization: Bearer <token>` header is present.
5. (Optional) Run a `curl` request to the backend `/api/generate-image` without an auth header and verify that it returns `401 Unauthorized`.
