/// <reference lib="webworker" />

/**
 * Etro Web Worker Scaffold
 * 
 * NOTE ON WEB WORKERS AND ETRO.JS:
 * etro.Movie and its layers (etro.layer.Video, etro.layer.Image) strictly require 
 * DOM elements (HTMLVideoElement, HTMLImageElement, HTMLCanvasElement) to function.
 * These elements cannot be transferred to or created within a Web Worker context.
 * While OffscreenCanvas can be transferred, etro's internal architecture relies on 
 * the main thread's DOM API for media decoding and rendering.
 * 
 * Therefore, a full offload of etro to a Web Worker is not natively supported without
 * heavily patching etro or using a different rendering engine (like raw WebGL/Canvas2D 
 * with ImageBitmap/VideoFrame from WebCodecs).
 * 
 * This worker provides the requested scaffold. In a production scenario where etro 
 * must be used, you would typically fallback to proxy-mode on the main thread, 
 * or use this worker to manage timeline state/compositing logic while sending 
 * render commands back to the main thread.
 */

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let dimensions = { width: 1024, height: 1024 };
let isPlaying = false;
let layers: any[] = [];
let animationFrameId: number | null = null;

// Mock etro-like state for the scaffold
const state = {
  currentTime: 0,
  duration: 5, // default 5 seconds
};

function render() {
  if (!canvas || !ctx) return;

  // Clear canvas
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // Draw a placeholder for layers since we can't use DOM media elements here
  ctx.fillStyle = '#333';
  ctx.fillRect(50, 50, dimensions.width - 100, dimensions.height - 100);

  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Worker Render (Layers: ${layers.length})`, 
    dimensions.width / 2, 
    dimensions.height / 2 - 20
  );
  
  ctx.fillText(
    `Time: ${state.currentTime.toFixed(2)}s`, 
    dimensions.width / 2, 
    dimensions.height / 2 + 20
  );

  if (isPlaying) {
    state.currentTime += 1 / 60; // Assume 60fps
    if (state.currentTime > state.duration) {
      state.currentTime = 0;
    }
    animationFrameId = requestAnimationFrame(render);
  }
}

async function recordVideo(duration: number): Promise<Blob> {
  // In a real implementation, we would use MediaRecorder with the OffscreenCanvas stream.
  // However, OffscreenCanvas.captureStream() is not standard in all workers yet.
  // We'll create a dummy Blob to satisfy the scaffold requirement.
  
  console.log(`[Worker] Recording video for ${duration}s...`);
  
  // Simulate recording delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a dummy webm blob
  const buffer = new ArrayBuffer(8);
  return new Blob([buffer], { type: 'video/webm' });
}

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT':
      if (payload.canvas) {
        canvas = payload.canvas as OffscreenCanvas;
        ctx = canvas.getContext('2d');
        console.log('[Worker] Initialized with OffscreenCanvas');
        render();
      }
      break;

    case 'UPDATE_DIMENSIONS':
      dimensions = payload;
      if (canvas) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        if (!isPlaying) render();
      }
      break;

    case 'ADD_LAYER':
      layers.push(payload.layer);
      if (!isPlaying) render();
      break;

    case 'UPDATE_LAYER':
      const layerIndex = layers.findIndex(l => l.source === payload.source);
      if (layerIndex !== -1) {
        layers[layerIndex] = { ...layers[layerIndex], ...payload.layer };
        if (!isPlaying) render();
      }
      break;

    case 'REMOVE_LAYER':
      layers = layers.filter(l => l.source !== payload.source);
      if (!isPlaying) render();
      break;

    case 'REORDER_LAYERS':
      const newLayers = [];
      for (const source of payload.sources) {
        const layer = layers.find(l => l.source === source);
        if (layer) newLayers.push(layer);
      }
      layers = newLayers;
      if (!isPlaying) render();
      break;

    case 'PLAY':
      if (!isPlaying) {
        isPlaying = true;
        render();
      }
      break;

    case 'PAUSE':
      isPlaying = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      break;

    case 'STOP':
      isPlaying = false;
      state.currentTime = 0;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      render();
      break;

    case 'SCRUB':
      state.currentTime = payload.time;
      if (!isPlaying) render();
      break;

    case 'RECORD':
      try {
        const blob = await recordVideo(payload.duration || 5);
        self.postMessage({ type: 'RECORD_COMPLETE', payload: { blob } });
      } catch (error) {
        self.postMessage({ type: 'RECORD_ERROR', payload: { error: String(error) } });
      }
      break;

    default:
      console.warn(`[Worker] Unknown command: ${type}`);
  }
};
