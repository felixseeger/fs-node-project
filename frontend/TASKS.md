# Implementation Plan: Cloud-Native VFX & Video Nodes (CorridorKey, LTX, Etro)

This document outlines the end-to-end implementation plan for integrating **CorridorKey-Engine** (Green Screen Keying), **LTX Video** (Video Generation), and **Etro** (Video/Image Compositing) into the Node-Project.

This plan has been completely revised for **Vercel Serverless Compatibility**. Local macOS `.app` bundles and heavy TCP daemons are being replaced with cloud-native Async Worker patterns (RunPod/Fal.ai), while WebGL compositing (Etro) and lightning-fast image processing (Sharp) handle the real-time node interactions.

---

## Phase 1: Serverless Backend Infrastructure & Webhooks

Vercel functions cannot hold open connections for minutes. We must implement a robust **Submit -> Poll -> Complete** asynchronous architecture.

### 1.1 Job State Database (Firebase Firestore)
*   **Tasks:**
    *   [ ] Create a `vfx_jobs` Firestore collection schema to track async generation tasks.
    *   [ ] Implement a `jobTrackerService.js` with methods: `createJob()`, `updateJobStatus()`, `getJob()`.
    *   [ ] Jobs should track `id`, `provider` (runpod/fal), `status` (pending, processing, completed, failed), `progress`, and `resultUrl`.

### 1.2 CorridorKey Cloud Integration (RunPod/Modal)
*   **Execution Model:** Vercel -> RunPod Serverless Endpoint.
*   **Tasks:**
    *   [ ] (Cloud Setup): Package the CorridorKey-Engine into a Docker container and deploy to a RunPod/Modal Serverless endpoint.
    *   [ ] Create `api/services/corridorKeyService.js` in Vercel.
    *   [ ] Implement `submitExtraction(videoUrl, settings)`: Sends a `POST` request to the RunPod endpoint with the Vercel Webhook URL and returns the job ID.
    *   [ ] **Endpoint:** `POST /api/vfx/corridorkey/extract`

### 1.3 LTX Video Generation (Fal.ai / Replicate)
*   **Execution Model:** Vercel -> Fal.ai/Replicate Serverless API.
*   **Tasks:**
    *   [ ] Create `api/services/ltxService.js` in Vercel.
    *   [ ] Implement `generateVideo(prompt, dimensions, frames)`: Calls the Fal.ai LTX Video API, passing the Vercel Webhook URL.
    *   [ ] **Endpoint:** `POST /api/vfx/ltx/generate`

### 1.4 The Vercel Webhook Receiver & Polling
*   **Tasks:**
    *   [ ] Create a secure Webhook Receiver endpoint: `POST /api/webhooks/vfx-complete`.
    *   [ ] When RunPod or Fal.ai finish, they hit this endpoint. It updates the Firestore `vfx_jobs` document to `completed` and attaches the final video URL.
    *   [ ] Create a polling endpoint for the React frontend: `GET /api/vfx/job/:id/status`.

### 1.5 Server-Side Image Processing (`sharp`)
*   **Execution Model:** Synchronous Vercel Edge/Serverless function.
*   **Tasks:**
    *   [ ] Create `api/services/imageProcessingService.js`.
    *   [ ] Replace GIMP entirely. Use the `sharp` library to composite multiple static image URLs (X/Y offsets, opacities, blend modes) and apply standard filters (blur, grayscale).
    *   [ ] **Endpoint:** `POST /api/vfx/image/composite` (Returns image buffer or uploads to Firebase and returns URL).

---

## Phase 2: Separated Standalone Nodes (React Flow)

These nodes allow users to manually string together the AI VFX steps on the canvas.

### 2.1 CorridorKey Extraction Node (`frontend/src/nodes/CorridorKeyNode.tsx`)
*   **Inputs:** `video_in`
*   **Controls:** Optimization Profile (`optimized`, `performance`), Despill (0-10).
*   **Execution:** 
    *   Hits `/api/vfx/corridorkey/extract` and receives a `jobId`.
    *   Starts a `setInterval` polling `/api/vfx/job/:id/status` every 3 seconds.
    *   Updates internal `executionProgress` UI state based on the polling response.
    *   Outputs a transparent `.webm` or `.mp4` when status is `completed`.

### 2.2 LTX Video Node (`frontend/src/nodes/LtxVideoNode.tsx`)
*   **Inputs:** `image_in` (optional, for Image-to-Video).
*   **Controls:** Prompt TextArea, Width, Height, Frames.
*   **Execution:** 
    *   Hits `/api/vfx/ltx/generate` and receives a `jobId`.
    *   Polls status endpoint. Manages the 2-5 minute loading expectation in the node's visual state.

---

## Phase 3: The Unified "Layer Editor" Node (Powered by Etro)

The `LayerEditorNode.jsx` becomes a full NLE (Non-Linear Editor) running inside the React Flow canvas. Etro handles the compositing via WebGL, while CorridorKey and LTX act as "AI Plugins".

### 3.1 Etro Web Worker & Canvas Integration
*   [ ] **Crucial**: Create `frontend/src/workers/etro.worker.ts` to offload `etro.Movie` rendering from the main browser thread.
*   [ ] Pass an `OffscreenCanvas` from the `LayerEditorNode` UI to the worker.
*   [ ] Build internal layer state management (`data.layers`): track start times, durations, x/y offsets, and Z-index ordering.
*   [ ] Map React UI changes (dragging a layer, adjusting opacity) to `postMessage` calls that update the Etro worker state for real-time 60fps previews.

### 3.2 "Smart AI Backgrounds" (LTX Integration inside Etro)
*   **Workflow:** User selects "Add Layer -> AI Generated Video Background".
*   The node shows a loading state on the new layer in the UI list and hits `/api/vfx/ltx/generate`.
*   It begins polling the job status.
*   Once the URL is returned via the webhook/polling flow, it sends a message to the Etro Worker to instantiate a new `etro.layer.Video` at Z-index 0.

### 3.3 "Smart AI Keying" (CorridorKey Integration inside Etro)
*   **Workflow:** User adds a raw green-screen video layer. They click "Add Effect -> AI Green Screen Key".
*   The node hits `/api/vfx/corridorkey/extract` and displays a progress bar over the layer item in the UI list.
*   Once the transparent video URL is returned, it tells the Etro Worker to swap the source of the `etro.layer.Video` to the new transparent video.

### 3.4 Final Export
*   When the user is happy with the real-time Etro preview, they click "Render High Quality".
*   The Etro Web Worker runs `movie.record({ frameRate: 60 })` using the browser's `MediaRecorder` API to generate the final Blob.
*   The Blob is uploaded to Firebase Storage, and the resulting public URL is passed to the node's `video_out` handle.