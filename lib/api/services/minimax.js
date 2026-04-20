import Replicate from 'replicate';

/**
 * Minimax Video-01 Service - Video generation via Replicate
 * Model: minimax/video-01 (Hailuo - free tier)
 * Generate 6s videos at 720p with cinematic camera movement
 */

export async function generateVideo(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const {
    prompt,
    prompt_optimizer = true,
    first_frame_image,
    subject_reference,
  } = params;

  if (!prompt) {
    throw new Error('Prompt is required for Minimax video generation');
  }

  console.log(`[Minimax] Generating video: ${prompt.substring(0, 50)}...`);

  try {
    const client = new Replicate({ auth: apiToken });

    const input = {
      prompt,
      prompt_optimizer: prompt_optimizer !== false,
    };

    if (first_frame_image) {
      input.first_frame_image = first_frame_image;
    }

    if (subject_reference) {
      input.subject_reference = subject_reference;
    }

    const prediction = await client.predictions.create({
      version: 'minimax/video-01',
      input,
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Minimax video generation failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from Minimax video generation');
    }

    return {
      data: {
        url: completed.output,
        status: 'COMPLETED'
      },
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Minimax] Generation failed:', error.message, error.stack);
    const err = new Error(error.message || 'Minimax video generation failed');
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

  throw new Error(`Minimax prediction ${predictionId} timed out after ${timeout}ms`);
}
