# Phase 8: Multi-Track Timeline Editing

## Overview
**Objective:** Transform the single-layer editing experience into a full multi-track NLE (Non-Linear Editor) within the `LayerEditorNode`, enabling precise temporal control and complex asset composition.
**Timeline:** 2 weeks (10 business days)
**Target Impact:** Provide professional-grade video editing capabilities within the node-based workflow.

## Current State
- `LayerEditorNode` supports basic layer stacking but lacks a horizontal temporal view.
- Single playback head for the entire movie.
- Property adjustments are static across the entire duration (no keyframes).
- Limited visibility into clip durations and offsets.

## Implementation Strategy

### 1. Track Architecture & State Management
- Refactor `LayerRegistry` to support hierarchical track structure with multiple clips per track.
- Implement `TimelineProvider` using React Context/Zustand to manage:
    - `currentTime`: Current playback position.
    - `zoomLevel`: Horizontal scale of the timeline.
    - `tracks`: Array of track objects containing metadata and clips.
- Synchronize track Z-indexing with `etro.layer` stack order.

### 2. Visual Timeline & Scrubber
- Build `VirtualTimeline`: A high-performance, horizontally scrollable canvas for rendering many tracks/clips.
- Implement `Playhead` (Scrubber): A draggable vertical line indicating `currentTime` with frame-accurate snapping.
- Add `TimecodeDisplay` component supporting various formats (SMPTE, Milliseconds, Frames).

### 3. Temporal Clip Manipulation
- Implement `TimelineClip` component with:
    - Drag-and-drop support for moving clips between tracks or across time.
    - Start/End trimming handles for adjusting `startTime` and `duration`.
    - Context menu for splitting, duplicating, and deleting clips.
- Real-time updates to `etro.layer` properties as clips are manipulated.

### 4. Keyframe Animation System
- Build `KeyframeLane` for each layer to visualize property automation over time.
- Implement `KeyframePoint` component: Draggable markers for specific property values at specific timestamps.
- Integrate interpolation logic with `etro-js` to animate `opacity`, `scale`, `position`, and effect parameters.
- Add `EasingEditor` to control animation curves (Linear, Ease-In, Ease-Out, Bezier).

### 5. Audio Track Integration
- Integrate `wavesurfer.js` or `waveform-data.js` for audio track visualization.
- Implement dedicated audio tracks with Volume/Pan keyframes.
- Ensure strict audio-video synchronization during preview and export.

## Detailed Task Breakdown

### Day 1-2: Foundation
- [ ] Refactor `LayerRegistry` for multi-clip support.
- [ ] Scaffold `Timeline` container and `TrackHeader` components.
- [ ] Implement global timeline state.

### Day 3-4: Navigation
- [ ] Build the interactive `Scrubber` and `TimecodeDisplay`.
- [ ] Implement horizontal zoom and scrolling logic.
- [ ] Add frame-snapping utilities.

### Day 5-6: Clip Editing
- [ ] Implement draggable clips on the timeline.
- [ ] Add trimming handles and logic.
- [ ] Build the clip context menu (Split/Merge/Delete).

### Day 7-8: Animation
- [ ] Implement the `KeyframeLane` and `KeyframePoint` UI.
- [ ] Map keyframes to `etro-js` property interpolators.
- [ ] Build a basic easing function selector.

### Day 9-10: Audio & Polishing
- [ ] Integrate audio waveforms.
- [ ] Add multi-selection support for clips.
- [ ] Final performance tuning and regression testing.

## Success Criteria
- ✅ Users can drag multiple assets onto the timeline.
- ✅ Clips can be moved, trimmed, and overlapping tracks are composited correctly.
- ✅ Properties can be animated using keyframes with visible markers on the timeline.
- ✅ Audio tracks show waveforms and sync perfectly with video.
- ✅ The entire timeline remains responsive even with 20+ clips.
