# Design Document: Layer Node UI Overhaul

## 1. Problem Statement
The current `LayerEditorNode` implementation uses inline styles and raw HTML elements (like standard range inputs and buttons), which deviates from the project's dedicated design system, `blue-ether`. This inconsistency creates a disjointed user experience and makes the interface difficult to maintain or scale. Crucially, the complex features required for a professional-grade non-linear editor (NLE)—including a frame-accurate `Timeline`, a draggable `LayerStack`, and precise `RangeSlider` controls—are currently missing.

## 2. Requirements
### Functional Requirements
- **Primitives**: Develop high-fidelity `RangeSlider`, `ColorPicker`, `ProgressBar`, and `IconButton` variants within `blue-ether`.
- **Layer Stack**: Implement a draggable, sortable vertical list to manage Z-index and layer properties (opacity, visibility, lock).
- **Timeline**: Create a frame-accurate temporal track with a high-performance Scrubber (playhead).
- **Playback Integration**: Unified control bar to manage real-time preview playback via the `etro` engine.
- **Export Panel**: A dedicated interface for selecting export formats (MP4/GIF), resolution, and framerate.

### Non-Functional Requirements
- **System Compliance**: Strictly follow `blue-ether` design tokens and accessibility standards.
- **Performance**: Real-time scrubbing and slider updates must maintain 60fps to prevent canvas "jank."
- **Detached UI**: The Timeline and Sidebar must activate automatically when the node is selected and hide when deselected.

### Constraints
- Must integrate with the existing `etro.worker.ts` and `useNodeConnections` logic.
- Must support React 19's concurrent features.

## 3. Approach: Modular Design System
Build all UI elements as highly modular, themeable primitives in `blue-ether`. Use a shared state layer (React Context) to synchronize the playhead position and layer data between the Node on the canvas, the Timeline at the bottom, and the Properties sidebar.

## 4. Architecture
### Core State Management
- **`LayerEditorProvider`**: Central state for `currentTime`, `totalDuration`, `playbackStatus`, and normalized `layers`.
- **Bridge**: `LayerEditorNode` pushes engine updates to the context and listens for UI-driven changes.

### Component Hierarchy
- **`blue-ether` Library**: Generic, "dumb" components:
    - `<Timeline />`
    - `<LayerStack />`
    - `<RangeSlider />`
- **`LayerEditorNode`**: Engine component handling canvas interaction, data handles, and the OffscreenCanvas render loop.
- **`NLELayout`**: Global UI wrapper rendering the `Timeline` and `LayerStack` panels when a Layer Node is active.

## 5. Agent Team
- **`coder`**: Develop generic visual primitives and composite components in `blue-ether`.
- **`refactor`**: Overhaul `LayerEditorNode.jsx` and implement Context-based synchronization.
- **`tester`**: Create unit tests for UI components and verify worker communication stability.
- **`technical_writer`**: Document new components in Storybook and update project README.

## 6. Risk Assessment & Mitigation
- **Performance (High)**: Intensive state updates during scrubbing could lag the UI. 
  - *Mitigation*: Use `requestAnimationFrame` for scrubber updates and debounced messages for the `etro` worker.
- **State Complexity (Medium)**: Syncing external panels with a canvas node.
  - *Mitigation*: Implement a robust `LayerEditorContext` with clear action boundaries.

## 7. Success Criteria
- [ ] All `blue-ether` primitives (`RangeSlider`, `ProgressBar`, `ColorPicker`) are implemented and documented in Storybook.
- [ ] A functional `Timeline` component exists that allows frame-accurate scrubbing of the `LayerEditorNode` preview.
- [ ] `LayerEditorNode.jsx` is free of raw HTML/inline styles and uses `blue-ether` components exclusively.
- [ ] The Layer Stack supports drag-and-drop reordering of layers.
- [ ] Playback controls (Play, Pause, Stop) are synchronized across all UI panels.
