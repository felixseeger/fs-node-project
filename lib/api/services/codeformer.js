import Replicate from 'replicate';

/**
 * CodeFormer Service - Face Restoration via Replicate
 * Model: sczhou/codeformer
 * Robust face restoration for old photos or AI-generated faces
 */

export async function restoreFace(params) {
  const apiToken = process.env.REPLICATE_API_KEY;
  if (!apiToken) {
    throw new Error('REPLICATE_API_KEY is not set');
  }

  const {
    image,
    codeformer_fidelity = 0.5,
    background_enhance = true,
    upscale = 2,
  } = params;

  if (!image) {
    throw new Error('Image is required for face restoration');
  }

  console.log(`[CodeFormer] Restoring face with fidelity ${codeformer_fidelity}, upscale ${upscale}x`);

  try {
    const client = new Replicate({ auth: apiToken });

    // Get the latest version of the model
    const versions = await client.paginate('sczhou/codeformer', {
      limit: 1,
      status: 'all',
    });

    let versionId;
    for await (const version of versions) {
      versionId = version.id;
      break;
    }

    if (!versionId) {
      throw new Error('Could not find CodeFormer model version');
    }

    console.log(`[CodeFormer] Using version: ${versionId}`);

    // Start the prediction
    const prediction = await client.predictions.create({
      version: versionId,
      input: {
        image,
        codeformer_fidelity: Math.max(0, Math.min(1, codeformer_fidelity)),
        background_enhance: background_enhance ? true : false,
        upscale,
      },
    });

    // Poll for completion
    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'CodeFormer restoration failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from CodeFormer');
    }

    return {
      data: {
        url: completed.output,
        status: 'COMPLETED'
      },
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[CodeFormer] Restoration failed:', error.message, error.stack);
    const err = new Error(error.message || 'CodeFormer restoration failed');
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

  throw new Error(`CodeFormer prediction ${predictionId} timed out after ${timeout}ms`);
}
