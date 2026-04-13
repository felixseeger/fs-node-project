# Implementation Plan - FS Node Project Enhancements

## 1. Node Capabilities System
- **Objective**: Define a structured way for nodes to declare what they can do.
- **Tasks**:
  - Update `BaseNode.types.ts` to include a `capabilities` field (string array).
  - Update `nodeTokens.ts` or a new `nodeCapabilities.ts` to define standard capability strings (e.g., `image:generate`, `video:upscale`, `audio:isolate`).
  - Update existing nodes in `src/nodes/` to include their relevant capabilities.
  - Expose these capabilities to the `ProviderManager`.

## 2. Image Node Enhancements
- **Objective**: Improve image processing nodes and ensure they follow the project's "Liquid Glass" design.
- **Tasks**:
  - Review `ImageUniversalGeneratorNode.tsx` for React 19 compatibility.
  - Implement a `StyleTransferNode` (if not fully functional) or improve its UI.
  - Ensure all image nodes use shared components from `NodeControls` and `NodeSection`.

## 3. Chat UI Export & Improvements
- **Objective**: Allow users to export their chat history and improve the workflow export.
- **Tasks**:
  - Add an "Export Chat" button to `ChatUI.tsx`.
  - Implement logic to download chat messages as a JSON/Markdown file.
  - Update `ApiExportModal.tsx` to generate dynamic code snippets based on the actual nodes and edges in the current workflow, instead of using a placeholder `WORKFLOW_ID`.

## 4. Enhanced Workflow Creation
- [x] Update the prompt sent to the AI in `ChatUI.tsx` (or its parent) to include the available node capabilities.
- [x] Improve the "Import Workflow to Canvas" logic to better handle partial workflows or merge with existing nodes.

## 5. Validation & Testing
- [x] Add unit tests for the new Capability system.
- [x] Run `vitest` suite to ensure no regressions.
- [x] Perform visual regression testing using the existing `visual-compare.mjs`.

## 6. Advanced VFX Engine Integration (Async Pattern)
- **Objective**: Integrate professional-grade visual effects natively into the canvas via a decoupled async worker pattern.
- **Strategy**:
  - **Async Orchestration**: Implement a **Submit -> Poll -> Complete** lifecycle for heavy VFX tasks.
  - **Dedicated Infra**: Deploy **CorridorKey-Engine** and **LTX Desktop** on dedicated GPU instances (e.g., RunPod or Modal) that communicate with our Vercel API via a message queue.
  - **Server-Side Image Processing**: Use `sharp` or a specialized microservice for high-performance GEGL-like filter application, replacing the previous GIMP scripting plan.
  - **Etro Orchestration**: Offload Etro.js rendering to Web Workers with `OffscreenCanvas` to maintain UI responsiveness. Use low-resolution proxies for real-time editing.
- **Deliverables**:
  - `CorridorKeyNode`: Standalone node for AI matte extraction via async worker.
  - `LtxVideoNode`: Standalone node for AI video generation via async worker.
  - `LayerEditorNode`: A unified Non-Linear Editor (NLE) node that orchestrates Etro (for real-time preview) alongside high-fidelity render backends.

