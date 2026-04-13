# Knowledge Base: etro-js

`etro-js` is a TypeScript-based framework for programmatic video and audio editing in the browser. It allows for complex compositing, effects, and animation using HTML5 Canvas and Web Audio APIs.

## Core Concepts

### 1. `etro.Movie`
The main controller for a video project.
- **Initialization:** Requires an HTML5 `<canvas>` element.
- **Responsibility:** Manages the timeline, layers, and playback.
- **API:** `movie.play()`, `movie.pause()`, `movie.stop()`, `movie.record()`.

### 2. Layers (`etro.layer`)
The visual and auditory building blocks.
- **Built-in Types:**
  - `etro.layer.Video`: For video files.
  - `etro.layer.Audio`: For audio files.
  - `etro.layer.Image`: For images.
  - `etro.layer.Text`: For text overlays.
- **Properties:** `startTime` (offset in seconds), `duration`, `x`, `y`, `width`, `height`, `opacity`.

### 3. Effects (`etro.effect`)
Filters applied to layers or the entire movie.
- **Hardware Acceleration:** Uses GLSL for high-performance rendering on the GPU.
- **Built-in Effects:** Brightness, Contrast, Blur, etc.
- **API:** `layer.addEffect(effect)`.

### 4. Animation and Keyframes
- **`etro.KeyFrame`**: Used to animate properties over time.
- **Syntax:** `new etro.KeyFrame([[time, value], [time, value]])`.
- **Dynamic Functions:** Properties can also be set as functions for procedural animation.

## Integration Patterns

### Real-time Preview
`etro` renders directly to a canvas, making it ideal for a visual node editor where users expect immediate feedback when changing layer order or effects.

### Exporting
The `movie.record()` method returns a `Blob`, which can be uploaded to a server or downloaded directly by the user.

## Reference Usage

```javascript
import etro from 'etro';

const movie = new etro.Movie({ canvas: document.getElementById('preview') });

const baseLayer = new etro.layer.Image({
    startTime: 0,
    duration: 5,
    source: 'background.jpg'
});

const textLayer = new etro.layer.Text({
    startTime: 1,
    duration: 3,
    text: 'Hello World',
    x: 100,
    y: 100
});

movie.addLayer(baseLayer);
movie.addLayer(textLayer);
movie.play();
```
