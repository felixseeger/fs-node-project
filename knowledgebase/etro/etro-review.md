# Etro Video Editing Framework Review for Node-Project Integration

**Target**: `https://github.com/etro-js/etro` (Cloned locally for analysis)
**Goal**: Evaluate the Etro programmatic video editing framework to determine how it can be used for the video and image compositing capabilities within the Node-Project "Layer Editor Node".

## 1. Overview of the Etro Architecture

Etro is a TypeScript framework that enables **programmatic video and audio editing** directly in the browser (via WebGL and Web Audio APIs) and in Node.js (via `etro-node`).

### Key Architectural Traits
- **Timeline-Based**: Uses `startTime`, `duration`, and keyframes, making it suitable for both static images and time-based media (video/audio).
- **Layer Types**: Natively supports `Video`, `Audio`, `Image`, and `Text` layers.
- **Hardware Accelerated**: Uses WebGL shaders for visual effects (filters).
- **Extensible Effects**: Ships with built-in effects (Brightness, Contrast, Gaussian Blur, Chroma Key, Transform, Pixelate) and allows custom GLSL shaders.
- **Dynamic Properties**: Parameters can be animated using `etro.KeyFrame` or custom JavaScript functions (`() => Math.random()`).
- **Rendering**: Can render to an HTML `<canvas>` for real-time preview and export to a `Blob` via `MediaRecorder`.

## 2. Relevance to the Layer Node

Previously, GIMP headless scripting was evaluated for compositing images. While powerful, GIMP has severe limitations for the Node-Project:
1. **No Video Support**: GIMP cannot composite video timelines.
2. **Startup Latency**: The 5-10 second cold start makes real-time previewing impossible.

**Etro solves both problems.** It provides a unified compositing engine that handles videos, images, and audio *in the browser*, allowing the user to preview the timeline immediately before requesting a final render.

### Example Etro Composition
```javascript
import etro from 'etro';

// Create a canvas for previewing/rendering
const canvas = document.getElementById('preview-canvas');
const movie = new etro.Movie({ canvas });

// 1. Background Layer (Image)
const bgLayer = new etro.layer.Image({
  startTime: 0,
  duration: 10,
  source: document.getElementById('bg-image')
});

// 2. Foreground Layer (Extracted Video from CorridorKey)
const fgLayer = new etro.layer.Video({
  startTime: 0,
  duration: 10,
  source: document.getElementById('fg-video') // Has transparent alpha
});

// Apply a built-in transform effect (Scale and Position)
fgLayer.addEffect(new etro.effect.Transform({
  x: 150, 
  y: 50,
  scaleX: 0.8,
  scaleY: 0.8
}));

movie.addLayer(bgLayer);
movie.addLayer(fgLayer);

// Play the timeline
movie.play();

// Export the timeline
const blob = await movie.record({ frameRate: 30 });
```

## 3. Recommended Implementation Strategy for Node-Project

By integrating **Etro** alongside **CorridorKey** and **LTX Desktop**, the Layer Node becomes a fully-fledged Non-Linear Editor (NLE) running directly in the React canvas.

### A. Real-Time Frontend Preview (`frontend/src/nodes/LayerEditorNode.tsx`)
Instead of waiting for a backend GIMP script, the Layer Node instantiates an `etro.Movie` instance attached to a mini `<canvas>` inside the node.
- **State mapping**: Map the node's `data.layers` (containing X, Y, opacity, scale, and filter configurations) directly to `etro.layer.*` objects and `etro.effect.*` instances.
- **Scrubbing & Playback**: Users can scrub through the video composition in real-time. Any changes to slider values (like blur or position) immediately update the Etro effect parameters without hitting the backend.

### B. AI Pipeline Integration (CorridorKey & LTX)
Etro handles the *compositing*, but the heavy AI lifting is still outsourced to the backend daemons.
1. **CorridorKey (Smart Masking)**: If a user applies the "AI Green Screen" effect to a video layer in the UI, the frontend pauses Etro playback and sends the raw video to the Node.js backend (`/api/corridorkey/extract`). Once the transparent `.webm` or `.mp4` is returned, the frontend replaces the `etro.layer.Video` source with the extracted URL.
2. **LTX Video (AI Generation)**: The user clicks "Generate Background". The frontend hits `/api/ltx/generate`. The resulting video URL is loaded into a new `etro.layer.Video` placed at the bottom of the layer stack.

### C. Backend Rendering (`api/services/etroService.js` or FFmpeg)
When the user clicks **"Export / Finalize Workflow"**, the frontend sends the JSON representation of the layer stack to the backend.
- **Option 1: FFmpeg (Recommended for Video)**: The Node.js backend parses the JSON layer stack (URLs, start times, durations, x/y offsets) and compiles it into an `ffmpeg -filter_complex` command. This ensures highly reliable, high-quality, hardware-encoded `.mp4` generation that isn't dependent on browser tab throttling.
- **Option 2: etro-node**: Use the Etro Node.js wrapper to perform headless WebGL rendering on the server.

## 4. Strengths & Limitations

**Pros:**
- **Unified Engine**: Composites both Images and Videos under the exact same API.
- **Real-Time Visual Feedback**: WebGL allows instant previewing in the React Flow canvas, completely eliminating GIMP's 5-10s round-trip penalty during the editing phase.
- **Keyframing**: Etro natively supports keyframed animations (e.g., a subject moving across the screen over 5 seconds).

**Cons:**
- **Browser Output Quality**: `MediaRecorder` in browsers typically outputs `.webm` (VP8/VP9) which is heavily compressed and lacks frame-accuracy. To guarantee professional output, the final render must happen on the backend via FFmpeg or `etro-node`.
- **Cross-Origin Assets**: Etro uses `<video>` and `<img>` tags on an HTML5 Canvas. Rendering will throw `SecurityError: The operation is insecure` if the assets (from Firebase or external APIs) do not have correct CORS headers set (`crossOrigin="anonymous"`).

## Summary

Etro replaces GIMP as the primary compositing engine for the Node-Project's Layer Node. Because Etro runs in the browser, the Layer Node can provide a real-time, 60fps video and image compositing timeline. CorridorKey and LTX Desktop are relegated to specialized "AI Processors" that feed processed media URLs into Etro's layer stack. This architecture drastically improves UX by splitting the instant visual editing from the heavy async AI tasks.