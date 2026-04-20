import Replicate from 'replicate';

/**
 * Luma Reframe Service - Video generation via Replicate
 * Model: luma/reframe-video (free tier)
 * Transforms video with motion, style, and cinematic effects
 */

export async function reframeVideo(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const {
    video_url,
    prompt = '',
    motion_amount = 'medium',
    style = 'cinematic',
    strength = 0.7,
  } = params;

  if (!video_url) {
    throw new Error('Video URL is required for Reframe');
  }

  console.log(`[Luma] Reframing video: ${motion_amount} motion, ${style} style`);

  try {
    const client = new Replicate({ auth: apiToken });

    const prediction = await client.predictions.create({
      version: 'luma/reframe-video',
      input: {
        video_url,
        prompt: prompt || '',
        motion_amount: motion_amount || 'medium',
        style: style || 'cinematic',
        strength: Math.max(0, Math.min(1, strength || 0.7)),
      },
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Luma Reframe failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from Luma Reframe');
    }

    return {
      data: {
        url: completed.output,
        status: 'COMPLETED'
      },
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Luma] Reframe failed:', error.message, error.stack);
    const err = new Error(error.message || 'Luma Reframe failed');
    err.status = error.status || 500;
    throw err;
  }
}

async function waitForPrediction(client, predictionId, timeout = 600000) {
  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < timeout) {
    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded' || prediction.status === 'failed') {
      return prediction;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Luma Reframe prediction ${predictionId} timed out after ${timeout}ms`);
}
