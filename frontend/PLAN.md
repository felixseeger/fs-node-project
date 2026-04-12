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
- **Objective**: Improve the AI-driven workflow generation.
- **Tasks**:
  - Update the prompt sent to the AI in `ChatUI.tsx` (or its parent) to include the available node capabilities.
  - Improve the "Import Workflow to Canvas" logic to better handle partial workflows or merge with existing nodes.

## 5. Validation & Testing
- **Objective**: Ensure stability and performance.
- **Tasks**:
  - Add unit tests for the new Capability system.
  - Run `vitest` suite to ensure no regressions.
  - Perform visual regression testing using the existing `visual-compare.mjs`.
