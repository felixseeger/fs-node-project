### 3. Approach
**Selected Approach**: Unified Remotion NLE Node
We will construct a comprehensive `LayerEditorNode` (or update the existing `LayerNode.tsx`) that embeds the Remotion `<Player>`, a layer stack management UI, and the specific controls for launching AI processing tasks. The node maintains a complex state array of `RemotionLayer`s. Each layer object will be augmented to track its own `status` (`idle`, `loading`, `completed`, `failed`), `progress`, and `jobId`.

When a user initiates an AI task on a layer (e.g., applying CorridorKey to a video layer or adding a new LTX background), the node invokes a specialized polling hook or logic per layer to hit the `submitUrl` and subsequently poll the `pollUrl`. The `<Player>` will dynamically re-render the `VideoComposition` as layer statuses change from `loading` to `completed`.

**Alternatives Considered**:
*   *Etro Web Worker*: The original spec called for an `etro-js` WebGL worker. This was discarded because Remotion provides a much cleaner React-based declarative timeline, easier server-side rendering integration, and we already laid the groundwork in Phase 2/3.
*   *Strict Graph-Based Workflow*: We considered forcing users to only use the standalone LTX and CorridorKey nodes connected to a generic "Mixer" node. However, the user requested an integrated NLE experience where AI tools act like "effects" or "smart layers" inside a single powerful node.

### 4. Architecture
**Data Flow:**
1.  **Layer Addition**: User adds a layer via the node UI (e.g., clicks "Add LTX Background").
2.  **State Init**: The node appends a new `RemotionLayer` to its state array with `status: 'loading'`.
3.  **API Dispatch**: The node dispatches an async request to `/api/vfx/ltx/generate`.
4.  **Polling**: The node polls `/api/vfx/job/:id/status` and updates the layer's `progress` state, displaying a progress bar in the layer stack UI.
5.  **Completion**: Upon receiving the `resultUrl`, the layer state is updated to `status: 'completed'` and the `src` is set.
6.  **Preview**: The Remotion `<Player>` component automatically re-renders the `VideoComposition`, incorporating the new layer based on its `zIndex`, `from`, and `durationInFrames`.
7.  **Export**: The user clicks "Render Video", and the node's entire `layers` state array is sent to the `/api/render-video` endpoint we built in Phase 4.

**Key Components:**
*   `frontend/src/nodes/LayerEditorNode.tsx`: The unified NLE node containing the Player, Layer Stack, and specific AI controls.
*   `frontend/src/components/LayerItem.tsx`: A UI row representing a single layer, featuring a thumbnail, visibility toggle, and progress bar for AI tasks.
*   `frontend/src/components/LayerTimeline.tsx`: (Existing) The scrubber and timeline visualization.
*   `frontend/src/remotion/VideoComposition.tsx`: (Existing) The core React component mapping layers to Remotion primitives.
### 5. Agent Team
- **coder**: To implement the complex `LayerEditorNode.tsx` React Flow node, building out the internal state management (adding/removing layers, updating specific layer parameters like `zIndex` or `from`), and constructing the `LayerItem` UI components that handle individual polling for AI tasks (CorridorKey, LTX).
- **tester**: To implement unit tests for the layer state management (ensuring adding/updating/sorting layers by z-index works correctly) and validating that the `LayerEditorNode` correctly updates the `VideoComposition` preview.

### 6. Risk Assessment & Mitigation
**Risk 1: State management complexity**
*   *Mitigation*: The node's internal state will track an array of `RemotionLayer` objects. We must carefully design the updater functions to be immutable and performant, ensuring we don't trigger unnecessary re-renders of the entire `VideoComposition` timeline if only a single layer's progress bar is updating.

**Risk 2: UI clutter inside a React Flow Node**
*   *Mitigation*: The `LayerEditorNode` will be significantly larger than standard nodes. We will utilize the existing `SettingsPanel` or a dedicated inspector pattern to hide complex configuration (e.g., LTX prompt parameters, CorridorKey despill sliders) until a specific `LayerItem` is clicked or expanded.

**Risk 3: Unhandled or abandoned polling jobs**
*   *Mitigation*: If a user deletes a layer while its status is `loading`, the component must safely clear the associated polling interval and discard the response to prevent memory leaks and state updates on unmounted components.

### 7. Success Criteria
*   The `LayerEditorNode` successfully mounts in the React Flow canvas, displaying the Remotion Player.
*   Users can add standard video/image layers by connecting input handles or via a UI button.
*   Users can click "Add AI Background" (LTX) or "Apply Green Screen Key" (CorridorKey) on a layer, which changes that layer's state to `loading` and begins polling the backend.
*   The `LayerItem` UI displays a progress bar (0-100%) during processing.
*   Upon successful completion, the new media replaces or updates the layer's source, and the Remotion `<Player>` updates to reflect the composited timeline.
*   Users can drag or adjust the ordering of layers (Z-index), affecting the final composite.
*   A "Render Export" button is available, successfully triggering the `/api/render-video` endpoint to generate an MP4 file.
