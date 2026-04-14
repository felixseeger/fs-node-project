# Release Notes - Video Editing & VFX Integration (Phases 5-7)

## Overview
This release marks a significant milestone in transitioning from a purely generative platform to a comprehensive AI-powered video editing and VFX pipeline. We have integrated `etro-js` for high-performance timeline rendering and established a robust, concurrency-controlled worker architecture for heavy backend tasks.

## Key Changes

### 1. Video Editing Pipeline (etro-js)
- **Scaffolded etro.Movie**: Initialized a persistent `etro.Movie` instance in the `LayerEditorNode` with a dedicated canvas target.
- **Layer Registry**: Implemented a synchronization layer that maps React state-driven media nodes to `etro.layer` objects (Image, Video, Audio).
- **Property Binding**: established real-time binding for `opacity`, `x/y` offsets, and `scale` between the UI controls and the rendering engine.
- **Client-Side Export**: Added `movie.record()` logic allowing users to export their compositions as high-quality `.webm` files directly from the browser.
- **Playback Controls**: Implemented Play, Pause, and Seek functionality integrated with the existing Layer Timeline.

### 2. Node Capabilities & Security
- **Capability Metadata**: All nodes now possess a `capabilities` array, enabling the AI to understand and utilize them more effectively within the graph topology.
- **Enhanced Sanitization**: Upgraded the `sanitization.ts` utility with robust regex patterns to strip sensitive API keys (Anthropic, OpenAI, Google, etc.) from all JSON and code exports.
- **Dynamic API Export**: Updated the `ApiExportModal` to generate topology-aware code snippets that are automatically sanitized before presentation.
- **Chat Export**: Users can now export their AI assistant conversations as sanitized Markdown or JSON.

### 3. Advanced VFX Engine
- **Async Worker Queue**: Set up a `workerService` combining `p-queue` and `jobTrackerService` (Firestore) to handle heavy VFX workloads (matte extraction, video generation) without blocking the API thread.
- **CorridorKey AI Integration**: Implemented the backend route and worker logic for AI matte extraction.
- **LTX Video Integration**: Transitioned LTX video generation to the async worker pattern with real-time progress polling.
- **Scalable Image Processing**: Enhanced the `sharp` integration to support a wide range of filters (Blur, Grayscale, Tint, Brightness, Saturation) in the backend compositing engine.

## Codebase Organization
- Completed the "Root Directory Cleanup" by moving legacy patch scripts to `scripts/patches/` and test scripts to `tests/`, ensuring the project root remains clean and manageable.

## Verification
- [x] All `etro-js` initialization and synchronization loops verified.
- [x] Sanitization utility tested against multiple API key formats.
- [x] Async worker pattern verified via mock and real API paths.
- [x] Node capabilities populated for 20+ functional nodes.
