# CorridorKey-Engine Review for Node-Project Integration

**Target**: `/Users/felixseeger/Documents/_tools/CorridorKey-Engine`
**Goal**: Evaluate the CorridorKey-Engine documentation to understand how to integrate this professional VFX green-screen/keying AI into the Node-Project visual editor as a custom Node.

## 1. Overview of the CorridorKey-Engine Architecture

CorridorKey-Engine is an AI-powered green screen keying tool designed for professional VFX pipelines. Unlike traditional CLI tools that spin up for a single task and exit, CorridorKey-Engine operates as a **long-running JSON-RPC 2.0 daemon**.

### Key Architectural Traits
- **Communication Protocol**: It speaks JSON-RPC 2.0 over standard I/O (stdio) or a TCP socket (e.g., `--listen :9400`).
- **Stateful Cache, Stateless Jobs**: The engine keeps heavy AI models resident in GPU VRAM between jobs to avoid a 5-10 minute warmup penalty. The jobs themselves remain completely stateless.
- **Event-Driven**: Progress is pushed asynchronously via event notifications (`event.job.progress`, `event.job.completed`) rather than requiring the client to poll for updates.
- **Hardware Intensive**: Depending on the profile, it requires significant VRAM (2-12+ GB).
- **Two-Stage Process**: 
  1. `generate`: Creates coarse alpha mattes (hints) using models like BiRefNet, GVM, or VideoMaMa.
  2. `inference`: Runs the CorridorKey model using the original footage and the generated alpha hints to extract the high-quality foreground, linear alpha, and composited output.

## 2. Recommended Integration Strategy for Node-Project

Integrating this engine into the Node-Project visual editor requires coordination between the React frontend and the Express backend.

### A. Backend Service (`api/services/corridorKeyService.js`)

Because CorridorKey is a heavy, stateful process, the Node.js backend should treat it as a long-running microservice.

1. **Engine Startup**: The backend (or a deployment script) should launch the engine in TCP daemon mode alongside the Node.js server:
   ```bash
   uv run corridorkey-engine --listen :9400
   ```
2. **JSON-RPC Client**: Implement a simple TCP socket client in Node.js that connects to `localhost:9400`. It needs to handle Content-Length framing (LSP-style):
   ```
   Content-Length: <byte-length>\r\n\r\n{"jsonrpc":"2.0",...}
   ```
3. **Data Preparation**: When a job is triggered from the frontend, the backend must download or extract the input video/image sequence into a specific directory structure expected by the engine:
   ```
   /tmp/ck_jobs/<job_id>/clips/shot01/Input/
   ```
4. **Job Execution Flow**:
   - Send `project.scan` to verify the inputs.
   - Send `job.submit` with `type: "generate"` (using BiRefNet) to create alpha hints.
   - Wait for `event.job.completed`.
   - Send `job.submit` with `type: "inference"` passing settings like `despill_strength` and `optimization: { profile: "optimized" }`.
   - Listen to `event.job.progress` and proxy these events back to the React frontend (via WebSockets or Server-Sent Events).
5. **Output Handling**: Once the final `event.job.completed` is received, the backend collects the generated frames from the `FG/`, `Matte/`, or `Comp/` directories, compiles them back into a video (using FFmpeg) or a sequence, and uploads them to Firebase Storage.

### B. Frontend Integration (`frontend/src/nodes/CorridorKeyNode.tsx`)

The visual node will represent the green-screen extraction process on the canvas.

1. **Inputs**:
   - **Video/Image Sequence** (Target footage).
   - (Optional) Background image/video for the `Comp/` output preview.
2. **Parameters (UI Controls)**:
   - **Optimization Profile**: Dropdown (`optimized` [2-3GB VRAM], `performance` [8-12GB VRAM]).
   - **Despill Strength**: Slider (`0.0` to `10.0`, default `0.5`).
   - **Despeckle**: Toggle (removes tracking markers).
   - **Refiner Scale**: Slider (default `1.0`).
3. **Execution State**: 
   - Because inference takes a long time, the node must gracefully handle the `executionProgress` state. As the backend proxies the `event.job.progress` events (which include `done`, `total`, `fps`), the node updates a progress bar.
4. **Outputs**:
   - **Foreground (FG)**: The extracted subject with straight RGB.
   - **Matte**: The linear alpha channel (useful for chaining into other VFX nodes).
   - **Composite**: The subject placed over a transparent or checkerboard background.

## 3. Handling Limitations and Edge Cases

- **Single Active Job**: The engine explicitly rejects concurrent jobs (`-32000 Engine busy`). The Node.js backend *must* implement a queuing system (like BullMQ or a simple in-memory array) to queue incoming CorridorKey requests from different users/workflows.
- **VRAM Exhaustion**: The Node.js backend should monitor `event.model.loading` and ideally call `model.unload` if other heavy AI models (like Flux or Stable Video Diffusion) need to run on the same GPU simultaneously.
- **Error Handling**: The engine emits `event.job.failed` or includes errors in `failed_frames` inside `event.job.completed`. The backend must catch these and mark the Node-Project workflow execution as failed, surfacing the specific error to the `CorridorKeyNode` UI.

## Summary

CorridorKey-Engine's JSON-RPC 2.0 TCP daemon makes it highly compatible with a Node.js backend. By building a dedicated `corridorKeyService.js` that acts as a client to this daemon, managing a job queue, and streaming progress events to the frontend, the Node-Project can offer professional-grade, hardware-accelerated VFX green screen keying as a standard canvas node.