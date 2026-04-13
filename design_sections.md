### 1. Problem Statement
The Vercel Serverless environment restricts long-running HTTP connections (typically timing out after 10-60 seconds). However, AI video generation (LTX) and complex VFX compositing (CorridorKey) on external GPU clusters like RunPod or Fal.ai can take 2 to 5 minutes per frame/clip. The Node-Project needs a robust, non-blocking way to dispatch these heavy tasks from the React Flow canvas, monitor their progress in real-time, and securely retrieve the final `.webm` or `.mp4` outputs without blocking the main UI thread or timing out the serverless backend.

### 2. Requirements
**Functional Requirements:**
*   Users must be able to trigger a CorridorKey extraction or an LTX video generation from their respective React Flow nodes.
*   The frontend must poll the backend for job status (`pending`, `processing`, `completed`, `failed`) and display visual progress (0-100%).
*   Upon completion, the node must display the resulting video inline using a native HTML5 `<video>` element with `autoPlay`, `loop`, and `muted` attributes.
*   The node must explicitly construct and send its unique configuration payload (e.g., Prompt, Dimensions, Despill, Optimization Profile) to the backend.

**Non-Functional Requirements:**
*   The UI must provide inline error views with actionable messages if a job fails (e.g., "RunPod GPU timeout").
*   The polling mechanism must be reusable across any future long-running async node.
*   The backend endpoints must immediately return a `jobId` after dispatching the task to the external provider.
### 3. Approach
**Selected Approach**: Node-Level Polling Hook (`useAsyncPolling`)
We will create a specialized, reusable React hook called `useAsyncPolling` within the frontend. This hook will manage the lifecycle of a long-running job. It takes an initial `submitUrl`, a `pollUrl` template (e.g., `/api/vfx/job/:id/status`), and the specific payload to send.

*   When invoked by the node's "Generate" button, it sends the payload, stores the returned `jobId`, and starts a `setInterval` loop.
*   The hook yields `status` (idle, loading, completed, failed), `progress` (0-100), `resultUrl`, and `error` to the component.
*   The `CorridorKeyNode` and `LtxVideoNode` components will consume this hook, wrapping their inputs and rendering the final `<video>` tag or an inline error state directly within the node's `OutputPreview` container.

**Alternatives Considered**:
*   *Global Job Queue Context*: We considered lifting the job polling to a global React Context or Redux slice. While this would allow polling to survive component unmounts, it adds significant complexity to the node state management. Given that users typically remain on the canvas while generating, the node-level hook provides a simpler, decoupled architecture.

### 4. Architecture
**Data Flow:**
1.  User clicks "Generate" on `LtxVideoNode`.
2.  Node constructs a JSON payload (Prompt, Width, Height, Frames) and calls `execute(payload)` from `useAsyncPolling`.
3.  The frontend issues a `POST /api/vfx/ltx/generate` request.
4.  The Vercel backend dispatches the job to Fal.ai, receives a Fal Request ID, saves it in a Firebase `vfx_jobs` collection with status `processing`, and returns the `jobId` to the frontend.
5.  `useAsyncPolling` starts hitting `GET /api/vfx/job/{jobId}/status` every 3 seconds.
6.  The Vercel backend checks the Firestore document. (Meanwhile, Fal.ai/RunPod will eventually hit a webhook endpoint `POST /api/webhooks/vfx-complete` to update that document).
7.  Once the document reads `status: 'completed'` with a `resultUrl`, the polling stops.
8.  The hook returns the `resultUrl`, and the node renders `<video src={resultUrl} autoPlay loop muted />`.

**Key Components:**
*   `frontend/src/hooks/useAsyncPolling.ts`: The reusable polling hook.
*   `frontend/src/nodes/CorridorKeyNode.tsx`: The green-screen extraction UI node.
*   `frontend/src/nodes/LtxVideoNode.tsx`: The video generation UI node.
*   `frontend/src/components/VideoPreview.tsx`: A robust wrapper for the `<video>` element handling loading and error states.
### 5. Agent Team
- **coder**: To implement the `useAsyncPolling` React hook, the new `VideoPreview` component, and build the `CorridorKeyNode` and `LtxVideoNode` components in React Flow.
- **tester**: To implement robust unit and component tests ensuring the polling hook correctly transitions states (idle -> loading -> completed/failed) and that the video nodes gracefully render errors.

### 6. Risk Assessment & Mitigation
**Risk 1: Browser resource exhaustion from rapid polling**
*   *Mitigation*: The `useAsyncPolling` hook will implement a minimum 3-second delay between requests and clear the interval cleanly on component unmount to prevent memory leaks.

**Risk 2: Edge inputs disconnecting during processing**
*   *Mitigation*: The hook will snapshot the incoming payload at the moment `execute()` is called, ensuring that changes to the node's inputs while polling do not corrupt the ongoing job request.

**Risk 3: Unhandled failed job statuses**
*   *Mitigation*: The hook explicitly parses the status returned from the backend. If `failed`, the `error` string is extracted and the `status` state is flipped to trigger the inline error UI in the `VideoPreview` component.

### 7. Success Criteria
*   Both the `CorridorKeyNode` and `LtxVideoNode` render correctly on the React Flow canvas with their specific controls (Sliders, TextAreas).
*   Connecting to the nodes and pressing "Generate" initiates a backend request and returns a `jobId`.
*   The nodes display a visual loading state (e.g., a spinner with a progress percentage) while polling the `/api/vfx/job/:id/status` endpoint.
*   Upon successful completion, the nodes transition to displaying a `<video autoPlay loop muted>` tag containing the result URL.
*   If the job fails, the nodes display an inline error message within the `OutputPreview` container.
*   The `useAsyncPolling` hook can be easily imported and reused by future long-running async nodes.
