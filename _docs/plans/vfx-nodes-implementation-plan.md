# Implementation Plan: VFX & Video Nodes (CorridorKey, LTX, Etro)

This document outlines the end-to-end implementation plan for integrating **CorridorKey-Engine** (Green Screen Keying), **LTX Desktop** (Video Generation), and **Etro** (Video/Image Compositing) into the Node-Project.

With the introduction of Etro for timeline-based video/image compositing, GIMP is no longer strictly necessary for the Layer Node. Etro provides real-time WebGL previews in the browser and supports video layers, which GIMP cannot do.

---

## Phase 1: Backend Infrastructure & Services

### 1.1 CorridorKey Service (`api/services/corridorKeyService.js`)
*   **Execution Model:** JSON-RPC 2.0 over TCP Socket (`localhost:9400`).
*   **Tasks:**
    *   [ ] Create a TCP client (`net.Socket`) handling Content-Length framed JSON-RPC.
    *   [ ] Implement a Job Queue (e.g., `bullmq`) with `concurrency: 1` to prevent `-32000 Engine busy` errors.
    *   [ ] Manage job lifecycle: Download video -> `project.scan` -> `job.submit` (generate) -> `job.submit` (inference) -> Upload extracted alpha video -> Clean up.
    *   [ ] Broadcast `event.job.progress` to the frontend via SSE.
    *   [ ] **Endpoint:** `POST /api/corridorkey/extract`

### 1.2 LTX Desktop Service (`api/services/ltxService.js`)
*   **Execution Model:** HTTP Proxy to local FastAPI server (`http://127.0.0.1:8000`).
*   **Tasks:**
    *   [ ] Implement a startup script that spawns `/Applications/LTX Desktop.app/Contents/MacOS/LTX Desktop` and polls `/health`.
    *   [ ] Create an API proxy that forwards `prompt`, `width`, `height`, `num_frames` to `POST /generation/video`.
    *   [ ] **Crucial**: Implement a VRAM Mutual Exclusion lock. Ensure CorridorKey's model is unloaded or the queue is paused before LTX Video runs to prevent OOM crashes.
    *   [ ] **Endpoint:** `POST /api/ltx/generate`

### 1.3 High-Fidelity Render Engine (`api/services/renderService.js`)
*   **Execution Model:** FFmpeg or `etro-node` via subprocess.
*   **Tasks:**
    *   [ ] Receive an Etro JSON timeline from the frontend.
    *   [ ] Download all media assets locally.
    *   [ ] Execute the final composite rendering (`ffmpeg -filter_complex` or headless `etro`).
    *   [ ] **Endpoint:** `POST /api/render/timeline`

---

## Phase 2: Separated Standalone Nodes

These nodes allow users to manually string together the AI VFX steps on the canvas.

### 2.1 CorridorKey Extraction Node (`frontend/src/nodes/CorridorKeyNode.tsx`)
*   **Inputs:** `video_in`
*   **Controls:** Optimization Profile (`optimized`, `performance`), Despill (0-10).
*   **Execution:** Hits `/api/corridorkey/extract` and listens to the SSE endpoint for a real-time progress bar. Outputs a transparent `.webm` or `.mp4`.

### 2.2 LTX Video Node (`frontend/src/nodes/LtxVideoNode.tsx`)
*   **Inputs:** `image_in` (optional, for Image-to-Video if supported).
*   **Controls:** Prompt TextArea, Width, Height, Frames.
*   **Execution:** Hits `/api/ltx/generate`. Outputs a `.mp4`.

---

## Phase 3: The Unified "Layer Editor" Node (Powered by Etro)

The `LayerEditorNode.jsx` becomes a full NLE (Non-Linear Editor) running inside the React Flow canvas. Etro handles the compositing, while CorridorKey and LTX act as "AI Plugins".

### 3.1 Etro Canvas & State Management
*   [ ] Initialize an `etro.Movie` instance attached to a `<canvas>` preview inside the node.
*   [ ] Maintain a `data.layers` state containing: `id`, `type` (video/image/text), `url`, `startTime`, `duration`, `x`, `y`, `scale`.
*   [ ] Map changes in the React UI (sliders, dragging elements) directly to `etro.layer.*.addEffect(new etro.effect.Transform({...}))` for real-time updates at 60fps.
*   [ ] Implement a Play/Pause and Seek scrubber for the Etro timeline.

### 3.2 "Smart AI Backgrounds" (LTX Integration)
*   **Workflow:** User selects "Add Layer -> AI Generated Video Background".
*   The node pauses Etro, shows a loading state on the new layer, and calls `/api/ltx/generate`.
*   Once the URL is returned, it instantiates an `etro.layer.Video` at Z-index 0.

### 3.3 "Smart AI Keying" (CorridorKey Integration)
*   **Workflow:** User adds a raw green-screen video layer. They click "Add Effect -> AI Green Screen Key".
*   The node extracts the video URL, sends it to `/api/corridorkey/extract`, and displays a progress bar over the layer in the UI.
*   Once the transparent video URL is returned, it swaps the source of the `etro.layer.Video` to the new transparent video.

### 3.4 Final Export
*   When the user is happy with the real-time Etro preview, they click "Render High Quality".
*   The frontend serializes the `data.layers` (including all offsets and timings) and sends it to `POST /api/render/timeline`.
*   The backend renders the final MP4 using FFmpeg (ensuring perfect frame accuracy and high bitrate compression) and returns the final asset to the node's `video_out` handle.