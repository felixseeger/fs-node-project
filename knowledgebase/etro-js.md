# etro-js API Reference & Implementation Guide

This document provides a technical overview of `etro-js` for the video editing pipeline, specifically focusing on its integration with Web Workers and `OffscreenCanvas` for non-blocking UI performance.

## Core Architecture

`etro-js` is a visual manipulation library that uses the HTML5 Canvas API to composite layers into a movie.

### 1. `etro.Movie`
The root container for all video elements.
- **Constructor**: `new etro.Movie({ canvas, background })`
- **Key Methods**:
    - `addLayer(layer)`: Adds a new layer to the timeline.
    - `play()` / `pause()` / `stop()`: Standard playback controls.
    - `seek(time)`: Navigates to a specific timestamp in seconds.
    - `record(options)`: Renders the movie into a `Blob`.

### 2. Layers (`etro.layer`)
Layers are the building blocks of a movie.
- **Common Properties**:
    - `startTime`: When the layer starts relative to the movie start.
    - `duration`: How long the layer lasts.
    - `x`, `y`: Position on the canvas.
    - `width`, `height`: Dimensions.
    - `opacity`: Alpha transparency (0-1).
- **Layer Types**:
    - `etro.layer.Image`: Renders static images.
    - `etro.layer.Video`: Renders video files.
    - `etro.layer.Text`: Renders text with customizable fonts and colors.
    - `etro.layer.Canvas`: Renders another canvas or `OffscreenCanvas`.

## Web Worker Implementation (Offscreen Rendering)

To prevent the main UI thread from hanging during complex video composition or recording, we offload the `etro.Movie` instance to a Web Worker.

### Main Thread Setup
1. Create a `<canvas>` element.
2. Transfer control to an `OffscreenCanvas`.
3. Dispatch the canvas and assets to the worker.

```javascript
const canvas = document.getElementById('preview-canvas');
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('video-worker.js');

worker.postMessage({ 
  type: 'INIT', 
  canvas: offscreen 
}, [offscreen]);
```

### Worker Thread Logic (`video-worker.js`)
Inside the worker, we initialize `etro` using the transferred canvas.

```javascript
import etro from 'etro';

let movie;

self.onmessage = async (e) => {
  const { type, canvas, data } = e.data;
  
  if (type === 'INIT') {
    movie = new etro.Movie({ canvas });
  }
  
  if (type === 'ADD_IMAGE') {
    // Note: Workers must use ImageBitmap or fetch Blobs
    const response = await fetch(data.url);
    const blob = await response.blob();
    const source = await createImageBitmap(blob);
    
    const layer = new etro.layer.Image({
      startTime: data.startTime,
      duration: data.duration,
      source: source,
      x: data.x,
      y: data.y
    });
    movie.addLayer(layer);
  }
};
```

## Video Recording & Export

The `record()` method facilitates high-fidelity exports.

```javascript
const blob = await movie.record({
  frameRate: 30, // FPS
  type: 'video/webm', // Output format
  onStart: () => console.log('Recording started'),
  onProgress: (p) => self.postMessage({ type: 'PROGRESS', progress: p })
});

// Send blob back to main thread for download
self.postMessage({ type: 'EXPORT_COMPLETE', blob });
```

## Key Constraints in Workers
- **No DOM Access**: Cannot use `document.createElement('img')` or `HTMLVideoElement`. Use `ImageBitmap` for textures.
- **Font Loading**: Fonts must be pre-loaded or used via standard system fonts as `FontFaceSet` access is limited.
- **Audio Context**: `etro-js` handles audio through `AudioContext`. In workers, ensure the environment supports `OfflineAudioContext` for rendering.

## Performance Optimization
- **Low-res Proxies**: During active editing on the canvas, use low-resolution `ImageBitmap` sources for the `OffscreenCanvas`.
- **Hardware Acceleration**: `etro-js` utilizes the browser's hardware-accelerated canvas context.
- **Batch Updates**: Update layer properties (x, y, scale) within a `requestAnimationFrame` loop inside the worker for smooth previews.
