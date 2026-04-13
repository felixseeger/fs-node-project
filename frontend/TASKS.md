# VFX Integration Task List

This task list tracks the integration of CorridorKey, LTX Desktop, Etro, and GIMP into the Node-Project platform.

## Phase 1: Backend Infrastructure & Services

### 1.1 CorridorKey JSON-RPC Daemon Integration
- [ ] Create `api/services/corridorKeyClient.js`: Implement the TCP socket connection with Content-Length framing.
- [ ] Create `api/services/corridorKeyService.js`: Handle the `project.scan` and `job.submit` workflow.
- [ ] Implement Job Queuing (BullMQ) with `concurrency: 1` to manage VRAM requests and prevent `-32000 Engine busy` errors.
- [ ] Implement Server-Sent Events (SSE) to broadcast `event.job.progress` to the React frontend.
- [ ] Expose `POST /api/corridorkey/extract` endpoint.

### 1.2 LTX Desktop API Integration
- [ ] Create `api/services/ltxService.js`: Proxy for `localhost:8000` (FastAPI).
- [ ] Implement a startup script that spawns `/Applications/LTX Desktop.app/Contents/MacOS/LTX Desktop` and polls the `/health` check.
- [ ] Implement **VRAM Mutual Exclusion**: Ensure CorridorKey is paused/unloaded when LTX generates a video to prevent OOM kills.
- [ ] Expose `POST /api/ltx/generate` endpoint.

### 1.3 GIMP Headless Compositing Integration
- [ ] Create `api/services/gimpService.js`: Wrapper for `child_process.execFile` calling the GIMP executable.
- [ ] Implement `buildSchemeScript(layers)` to generate LISP/Scheme batch scripts for dynamic layer insertion, scaling, positioning, and GEGL filtering.
- [ ] Handle temporary file management (downloading layer assets to `/tmp`, executing GIMP, and cleanup).
- [ ] Expose `POST /api/gimp/process` endpoint.

### 1.4 High-Fidelity Video Render Engine (Etro-Node / FFmpeg)
- [ ] Create `api/services/renderService.js`: Handles compiling the final timeline.
- [ ] Accept Etro JSON state from the frontend and execute a perfect frame-accurate render via FFmpeg `filter_complex` or headless `etro-node`.
- [ ] Expose `POST /api/render/timeline` endpoint.

## Phase 2: Separated Standalone Nodes

### 2.1 CorridorKey Extraction Node (`frontend/src/nodes/CorridorKeyNode.tsx`)
- [ ] Scaffold node structure with inputs (`video_in`) and outputs (`fg_out`, `matte_out`, `comp_out`).
- [ ] Add UI controls for Optimization Profile (`optimized`, `performance`) and Despill Strength.
- [ ] Connect the node's `executionProgress` to the backend SSE stream to visualize real-time extraction frames.

### 2.2 LTX Video Generation Node (`frontend/src/nodes/LtxVideoNode.tsx`)
- [ ] Scaffold node structure with a text prompt input and `video_out` handle.
- [ ] Add UI controls for Dimensions (Width/Height) and Frame Count.
- [ ] Integrate with `/api/ltx/generate` and manage the loading state (which may take several minutes).

### 2.3 GIMP Filter & Composite Node (`frontend/src/nodes/GimpNode.tsx`)
- [ ] Scaffold node structure with `base_image` and `overlay_image` inputs, and `image_out` output.
- [ ] Add UI controls for GEGL filters (e.g., Gaussian Blur, Unsharp Mask, Drop Shadow) and Blend Modes.
- [ ] Manage the 5-10s cold start expectation in the node's visual state.

## Phase 3: The Unified Layer Node (`frontend/src/nodes/LayerEditorNode.tsx`)

### 3.1 Etro Canvas & Playback Integration
- [ ] Embed an `etro.Movie` instance connected to an HTML `<canvas>` inside the node interface.
- [ ] Build internal layer state management (`data.layers`): track start times, durations, x/y offsets, and Z-index ordering.
- [ ] Map React UI changes (dragging a layer, adjusting opacity) instantly to `etro.layer.addEffect(new etro.effect.Transform({...}))` for real-time 60fps previews.
- [ ] Implement a visual timeline scrubber with Play/Pause controls.

### 3.2 "Smart AI Keying" (CorridorKey inside the Layer Stack)
- [ ] Add UI action: "Add Effect -> AI Green Screen Key".
- [ ] Orchestration: When clicked, pause Etro, send the raw layer's video URL to the CorridorKey service, and show progress.
- [ ] Callback: Swap the `etro.layer.Video` source to the newly extracted foreground video returned by the backend.

### 3.3 "Smart AI Backgrounds" (LTX Video inside the Layer Stack)
- [ ] Add UI action: "Add Generative Background".
- [ ] Provide prompt input directly within the layer's properties pane.
- [ ] Orchestration: Send to LTX Service. Upon completion, instantiate a new `etro.layer.Video` at Z-index 0 underneath the composited elements.

### 3.4 Final GIMP / FFmpeg High-Fidelity Export
- [ ] Add a prominent "Finalize Render" button to the node.
- [ ] Serialize the precise Etro timeline layout (all timings, offsets, and filters) and send it to the backend's `renderService`.
- [ ] Depending on the content type (Static Image vs Video Timeline), dispatch to GIMP (for high-end image filters) or FFmpeg/Etro-node (for video) to produce the final output asset for the `output` handle.
