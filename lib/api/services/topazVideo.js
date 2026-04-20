import Replicate from 'replicate';

/**
 * Topaz Video Upscale Service - via Replicate API
 * Professional-grade video upscaling
 * Model: topazlabs/video-upscale
 */

const RESOLUTIONS = ['720p', '1080p', '4k'];
const FPS_RANGE = { min: 15, max: 60 };

export async function upscaleVideo(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const { video, target_resolution = '1080p', target_fps = 30 } = params;

  if (!video) {
    throw new Error('Video URL is required');
  }

  if (!RESOLUTIONS.includes(target_resolution)) {
    throw new Error(`Invalid target_resolution. Must be one of: ${RESOLUTIONS.join(', ')}`);
  }

  const fps = parseInt(target_fps, 10);
  if (isNaN(fps) || fps < FPS_RANGE.min || fps > FPS_RANGE.max) {
    throw new Error(`Invalid target_fps. Must be between ${FPS_RANGE.min} and ${FPS_RANGE.max}`);
  }

  console.log(`[Topaz Video] Upscaling video to ${target_resolution} @ ${target_fps}fps`);

  try {
    const client = new Replicate({ auth: apiToken });

    const input = {
      video,
      target_resolution,
      target_fps: fps,
    };

    const prediction = await client.predictions.create({
      version: 'topazlabs/video-upscale',
      input,
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Topaz video upscale failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from Topaz video upscale');
    }

    return {
      data: { url: completed.output, status: 'COMPLETED' },
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Topaz Video] Upscale failed:', error.message, error.stack);
    const err = new Error(error.message || 'Topaz video upscale failed');
    err.status = error.status || 500;
    throw err;
  }
}

async function waitForPrediction(client, predictionId, timeout = 600000) {
  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < timeout) {
    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded' || prediction.status === 'failed') {
      return prediction;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Topaz video prediction ${predictionId} timed out after ${timeout}ms`);
}
