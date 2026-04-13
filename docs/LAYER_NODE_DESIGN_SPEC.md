# Layer Node & Non-Linear Editor (NLE) Design System Specification

This document maps out the required UI components for the `blue-ether` design system to support the new `LayerEditorNode`, which integrates `etro-js`, GIMP, CorridorKey, and LTX for advanced AI video/image manipulation.

## Phase 1: Primitives & Core Controls
These are foundational components needed before building complex assemblies.

1.  **`RangeSlider`**
    *   **Purpose**: Precise control over effect parameters (opacity, blur radius, chroma threshold).
    *   **Features**: Draggable handle, filled track, optional numerical input field for exact values, min/max bounds.

2.  **`IconButton` (Extensions to existing `Button` / `Icon`)**
    *   **Purpose**: Compact controls for layers and timeline.
    *   **Variants needed**:
        *   `VisibilityToggle` (Eye open/closed)
        *   `LockToggle` (Padlock locked/unlocked)
        *   `KeyframeToggle` (Diamond shape, active/inactive states)
        *   Playback controls (Play, Pause, Step Forward, Step Backward, Loop)

3.  **`ProgressBar` / `ProgressRing`**
    *   **Purpose**: Visual feedback for heavy, asynchronous rendering tasks (e.g., AI video generation via LTX, complex compositing via GIMP).
    *   **Features**: Indeterminate (spinning/pulsing) and determinate (0-100%) states, optional percentage label.

4.  **`ColorPicker`**
    *   **Purpose**: Selecting chroma-key colors (for CorridorKey green-screen extraction) or solid background colors.
    *   **Features**: Hex input, RGB sliders, visual color swatch.

## Phase 2: Composite Components
These components assemble primitives into complex, domain-specific UI patterns.

1.  **`LayerStack` & `LayerItem`**
    *   **Purpose**: Managing the hierarchy of image, video, and effect layers (Z-indexing/compositing).
    *   **Features**:
        *   Sortable, drag-and-drop vertical list container.
        *   Row component (`LayerItem`) with thumbnail preview, editable layer name, `VisibilityToggle`, and `LockToggle`.
    *   **Integration**: Syncs directly with `etro.layer` objects.

2.  **`BlendModeSelect`**
    *   **Purpose**: Controlling layer blending.
    *   **Features**: A specialized dropdown pre-configured with standard compositing modes (Normal, Multiply, Screen, Overlay, Add, etc.).

3.  **`PlaybackControls`**
    *   **Purpose**: Managing real-time preview playback via `etro-js`.
    *   **Features**: A composite control bar featuring the playback `IconButton` variants.

4.  **`Timeline` & `Scrubber`**
    *   **Purpose**: Temporal visualization and navigation.
    *   **Features**:
        *   Horizontally scrollable container for rendering temporal tracks.
        *   `Scrubber` (SeekBar): Precision range input for frame-accurate scrubbing.
        *   Timecode display (e.g., `00:01:23:14`).

5.  **`ExportPanel`**
    *   **Purpose**: Initiating renders to generate downloadable video Blobs.
    *   **Features**: Structured layout for selecting export format (MP4, GIF), resolution, and framerate. Includes the `ProgressBar`.
