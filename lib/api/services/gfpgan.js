import Replicate from 'replicate';

/**
 * GFPGAN Service - Face Restoration & Upscaling via Replicate
 * Model: tencentarc/gfpgan (free tier)
 */

const MODEL_VERSION = '0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c';

export async function restoreFace(params) {
  const apiToken = process.env.REPLICATE_API_KEY;
  if (!apiToken) {
    throw new Error('REPLICATE_API_KEY is not set');
  }

  const { image, upscale = 2 } = params;

  if (!image) {
    throw new Error('Image is required for face restoration');
  }

  console.log(`[GFPGAN] Restoring face with upscale ${upscale}x`);

  try {
    const client = new Replicate({ auth: apiToken });

    // Start the prediction
    const prediction = await client.predictions.create({
      version: MODEL_VERSION,
      input: {
        img: image,
        upscale,
        aligned: false,
        only_center_face: false,
        ext: 'auto',
      },
    });

    // Poll for completion
    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'GFPGAN restoration failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from GFPGAN');
    }

    return {
      data: {
        url: completed.output,
        status: 'COMPLETED'
      },
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[GFPGAN] Restoration failed:', error.message, error.stack);
    const err = new Error(error.message || 'GFPGAN restoration failed');
    err.status = error.status || 500;
    throw err;
  }
}

async function waitForPrediction(client, predictionId, timeout = 300000) {
  const startTime = Date.now();
  const pollInterval = 1000; // 1 second

  while (Date.now() - startTime < timeout) {
    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded' || prediction.status === 'failed') {
      return prediction;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`GFPGAN prediction ${predictionId} timed out after ${timeout}ms`);
}
