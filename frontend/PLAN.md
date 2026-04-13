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

## 6. Advanced VFX Engine Integration (GIMP, CorridorKey, LTX, Etro)
- **Objective**: Integrate professional-grade visual effects and AI video/image manipulation natively into the canvas.
- **Strategy**:
  - Deploy **CorridorKey-Engine** as a long-running JSON-RPC daemon to handle heavy, stateful green-screen extraction.
  - Deploy **LTX Desktop** via a local FastAPI proxy to handle generative video backgrounds.
  - Deploy **GIMP** via headless LISP/Scheme scripting to handle complex multi-layer image compositing and GEGL filter application.
  - Deploy **Etro** natively within the browser canvas to provide a real-time, hardware-accelerated WebGL timeline preview.
- **Deliverables**:
  - `CorridorKeyNode`: Standalone node for AI matte extraction.
  - `LtxVideoNode`: Standalone node for AI video generation.
  - `GimpNode`: Standalone node for advanced image filtering/compositing.
  - `LayerEditorNode`: A unified Non-Linear Editor (NLE) node that orchestrates Etro (for real-time preview) alongside CorridorKey, LTX, and GIMP (as high-fidelity render backends).
