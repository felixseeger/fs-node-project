# LTX Desktop Review for Node-Project Integration

**Target**: `/Users/felixseeger/Documents/_tools/Ltx-desktop-cli/agent-harness/cli_anything/ltx_desktop`
**Goal**: Evaluate the LTX Desktop CLI to understand its architecture and extract patterns for integrating local AI video generation into the Node-Project visual editor, specifically as a dedicated node or within the Unified Layer Node.

## 1. Overview of the LTX Desktop Architecture

The LTX Desktop application is a macOS native `.app` bundle (`/Applications/LTX Desktop.app`) that internally spins up a **FastAPI server** (`http://127.0.0.1:8000`) to process AI video generation tasks.

The CLI wrapper project (`cli-anything-ltx-desktop`) simply automates interacting with this FastAPI server. It does not interface with the models directly but instead acts as an HTTP client to the desktop app's internal server.

### Key Architectural Traits
- **Execution Model**: Local HTTP REST API (`localhost:8000`).
- **Application Lifecycle**: The desktop application must be launched via a subprocess to start the server. The CLI polls the `/health` endpoint until it receives a `200 OK`.
- **Stateless Job Submission**: Generating a video involves a standard `POST` request with JSON configuration parameters.
- **Hardware Profile**: Since it runs a local video diffusion model (likely LTX Video), it is highly VRAM intensive.

## 2. Capabilities Relevant to the Layer Node

The LTX Desktop API provides Text-to-Video capabilities that can act as dynamic generative layers inside the compositor.

### Endpoints Discovered in the CLI Source (`ltx_desktop_backend.py`)
1. **Health Check**: `GET /health` (Used for startup polling)
2. **Model Listing**: `GET /models`
3. **Video Generation**: `POST /generation/video`

**Extracted Generation Payload**:
```json
{
  "prompt": "A cinematic drone shot of a forest",
  "width": 768,
  "height": 512,
  "num_frames": 121,
  "steps": 20,
  "guidance": 3.0
}
```

## 3. Recommended Implementation Strategy for Node-Project

Integrating LTX Desktop into the Node-Project visual editor is straightforward because we can bypass the Python CLI entirely and let the Node.js backend communicate directly with the local FastAPI server.

### A. Backend Service (`api/services/ltxService.js`)

The Node.js backend will act as an orchestrator and proxy to the LTX Desktop application.

1. **Engine Startup & Polling**:
   ```javascript
   import { spawn } from 'child_process';
   import fetch from 'node-fetch';
   
   async function startLtxServer() {
     // Spawn the macOS App bundle in the background
     const ltxProcess = spawn('/Applications/LTX Desktop.app/Contents/MacOS/LTX Desktop', [], { detached: true });
     
     // Poll the health endpoint for up to 30 seconds
     for (let i = 0; i < 30; i++) {
       try {
         const res = await fetch('http://127.0.0.1:8000/health');
         if (res.ok) return true;
       } catch (e) { /* server not ready yet */ }
       await new Promise(r => setTimeout(r, 1000));
     }
     throw new Error('LTX Desktop server failed to start.');
   }
   ```
2. **Job Proxying**: 
   The Express backend exposes `POST /api/ltx/generate` which forwards the `prompt`, `width`, `height`, and `frames` to the local FastAPI server and waits for the video URL/buffer to be returned, subsequently uploading it to Firebase Storage.

### B. Frontend Integration (`frontend/src/nodes/LtxVideoNode.tsx`)

1. **Parameters (UI Controls)**:
   - **Prompt**: Text area for the video description.
   - **Resolution**: Dropdowns or inputs for `width` (default 768) and `height` (default 512).
   - **Frames**: Slider or input for `num_frames` (default 121).
   - **Steps & Guidance**: Advanced sliders for inference steps (20) and CFG scale (3.0).
2. **Outputs**:
   - `video_out`: A playable video sequence that can be piped into the `LayerEditorNode`.

### C. Layer Node Integration ("Smart AI Backgrounds")

Within the Unified Layer Node, LTX Desktop can function as a dynamic layer generator:
- **Use Case**: A user drops a subject (extracted via CorridorKey) onto the canvas, but wants a new AI-generated background.
- **Workflow**: The user selects "Add Layer -> Generate Video Background (LTX)". They type a prompt. The Layer Node queries the LTX Desktop API, waits for the video, and inserts it at the bottom of the layer stack (Z-index 0) before GIMP composites the final scene.

## 4. Strengths & Limitations

**Pros:**
- **Zero-cost local generation**: Like CorridorKey, this runs entirely on local Apple Silicon / GPU hardware. No API credits required.
- **RESTful Interface**: Extremely easy to integrate into an Express/React stack compared to raw Python subprocesses or complex JSON-RPC daemons.

**Cons:**
- **VRAM Contention**: LTX Video models consume massive VRAM. Running LTX Desktop *simultaneously* with CorridorKey or local Flux models will almost certainly crash the host machine or trigger OOM (Out of Memory) kills. The Node.js backend must enforce strict mutual exclusion (e.g., stopping the CorridorKey daemon before generating an LTX video).
- **macOS Dependency**: The explicit `/Applications/...` path means this service is tied to a macOS host environment, making cloud deployment difficult without packaging the underlying Python FastAPI server independently of the `.app` bundle.

## Summary

The `Ltx-desktop-cli` code reveals that the LTX Desktop app provides a clean, local HTTP API (`localhost:8000`) for video generation. Integrating this into the Node-Project involves writing a simple Node.js HTTP proxy (`ltxService.js`) that boots the `.app` and forwards generation parameters. This allows the visual editor to treat local LTX video generation just like any cloud API, seamlessly providing generative video layers for the GIMP compositing pipeline.