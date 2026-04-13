# Implementation Plan: GIMP & CorridorKey-Engine Integration

This document outlines the end-to-end implementation plan for integrating **GIMP 3.x** (via headless scripting) and **CorridorKey-Engine** (via JSON-RPC daemon) into the Node-Project. 

The integration is split into two paradigms as requested:
1. **Separated Nodes**: Atomic, single-purpose nodes on the canvas.
2. **Unified Layer Node**: A mini-compositing timeline where CorridorKey provides the masking and GIMP handles the multi-layer blending and filtering.

---

## Phase 1: Backend Infrastructure & Services

Before touching the visual canvas, the Express backend needs robust services to handle these two very different execution models (Subprocess vs. TCP Daemon).

### 1.1 GIMP Service (`api/services/gimpService.js`)
*   **Execution Model:** Subprocess `execFile`.
*   **Tasks:**
    *   [ ] Implement a `buildSchemeScript(layers)` function that generates a single LISP `let*` block containing all layer loads, offsets, opacities, GEGL filters, and a final flatten/save command.
    *   [ ] Implement `executeGimpScript(scriptString)` that spawns `/Applications/GIMP.app/Contents/MacOS/gimp` in batch mode.
    *   [ ] Add temporary file management: download URLs to local `/tmp`, run GIMP, upload the result to Firebase Storage, and cleanup `/tmp`.
    *   [ ] **Endpoint:** `POST /api/gimp/process`

### 1.2 CorridorKey Service (`api/services/corridorKeyService.js`)
*   **Execution Model:** JSON-RPC 2.0 over TCP Socket (`localhost:9400`).
*   **Tasks:**
    *   [ ] Create a TCP client (`net.Socket`) that implements Content-Length framed JSON-RPC reading/writing.
    *   [ ] Implement a **Job Queue** (using `bullmq` or a local async queue) to ensure only *one* CorridorKey job runs at a time (preventing the `-32000 Engine busy` error).
    *   [ ] Implement job submission flow: `project.scan` -> `job.submit` (generate) -> `job.submit` (inference).
    *   [ ] Implement an Event Emitter that listens to `event.job.progress` and broadcasts updates.
    *   [ ] **Endpoints:** `POST /api/corridorkey/extract` (starts job), `GET /api/corridorkey/progress/:jobId` (SSE for progress streaming).

---

## Phase 2: Separated Nodes (Atomic Workflow)

These nodes act as standalone tools in the canvas, allowing users to string them together manually (e.g., Image -> CorridorKeyNode -> GimpNode -> Output).

### 2.1 CorridorKey Extraction Node (`frontend/src/nodes/CorridorKeyNode.tsx`)
*   **Purpose:** Takes a video/image sequence and extracts the subject from a green screen.
*   **UI/Data:**
    *   *Inputs:* `video_in` (Handle).
    *   *Controls:* Optimization Profile dropdown (`optimized`, `performance`), Despill slider (0-10), Despeckle toggle.
    *   *Outputs:* `fg_out` (Foreground), `matte_out` (Alpha), `comp_out` (Preview).
*   **Execution:** 
    *   Calls `/api/corridorkey/extract`.
    *   Connects to the SSE progress endpoint.
    *   Updates a distinct visual Progress Bar on the node using `data.executionProgress` based on the daemon's `event.job.progress` frames/sec.

### 2.2 GIMP Filter & Composite Node (`frontend/src/nodes/GimpNode.tsx`)
*   **Purpose:** Takes a base image and an overlay, applying a specific GEGL filter or blend.
*   **UI/Data:**
    *   *Inputs:* `base_image`, `overlay_image`.
    *   *Controls:* X/Y Offset, Opacity, Blend Mode (Multiply, Screen, etc.), GEGL Filter dropdown (Blur, Sharpen, Pixelize).
    *   *Outputs:* `image_out`.
*   **Execution:**
    *   Calls `/api/gimp/process`.
    *   Shows a "Waking up GIMP (5-10s)..." loading state to set user expectations regarding the boot overhead.

---

## Phase 3: The Unified "Layer Editor" Node

The `LayerEditorNode.jsx` becomes a powerful mini-app (like an embedded Photoshop/After Effects composition) that abstracts away the individual nodes.

### 3.1 Layer State Management
*   The node's internal `data.layers` array will hold a stack of objects:
    ```json
    [
      { "id": "bg1", "type": "image", "url": "...", "locked": true },
      { "id": "subject", "type": "video", "url": "...", "x": 100, "y": 50, "effects": ["corridorkey-extract"] },
      { "id": "fx", "type": "filter", "gegl_op": "gegl:gaussian-blur", "params": "std-dev-x 5" }
    ]
    ```

### 3.2 CorridorKey as a "Smart Mask" Effect
*   Inside the Layer Editor UI, a user can click a video layer and select **"Add Effect -> AI Green Screen Key (CorridorKey)"**.
*   **Orchestration:** When the user hits "Render Composition":
    1. The backend first scans the layer stack.
    2. If it finds a `corridorkey-extract` effect on a layer, it halts the GIMP composition.
    3. It queues and runs that specific video layer through the `CorridorKey Service`.
    4. It replaces the original green-screen video layer with the resulting `FG` (Foreground with transparent Alpha) sequence.

### 3.3 GIMP as the Compositing Engine
*   Once all AI extractions (like CorridorKey) are complete and cached, the backend takes the final layer stack.
*   It generates a massive GIMP Scheme script that sequentially:
    1. Creates the base canvas.
    2. Loops through the layers, applying opacities and X/Y offsets.
    3. Applies any `gegl:*` filters attached to the layers.
    4. Flattens and exports the final frame(s).
*   **UI Experience:** The user sees a multi-stage loading bar on the Layer Node: `Extracting Green Screen (45%) -> Compositing Layers (Pending)`.

---

## Phase 4: Error Handling & System Limits

1. **Timeout Management:** GIMP subprocesses must have a hard timeout (e.g., 60 seconds) to prevent zombie processes. CorridorKey TCP sockets must handle connection drops and attempt to query `job.status` upon reconnection.
2. **VRAM Protection:** Since CorridorKey takes 2-12GB of VRAM, the backend must prevent other heavy AI operations (e.g., Local Flux generation) from running concurrently with a CorridorKey inference job.
3. **Graceful Fallbacks:** If the CorridorKey daemon is not running on port 9400, the backend should immediately return a clean error to the frontend ("VFX Engine Offline") rather than hanging the node execution.

## Next Steps to Execute:
1. Initialize the `corridorKeyService.js` TCP client in the backend.
2. Scaffold the `CorridorKeyNode.tsx` on the frontend to test the basic JSON-RPC workflow.
3. Create the `gimpService.js` script generator.
4. Integrate both into the `LayerEditorNode.jsx` UI.