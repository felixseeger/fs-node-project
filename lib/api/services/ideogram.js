import Replicate from 'replicate';

/**
 * Ideogram V3 Turbo Service - via Replicate API
 * Image generation with character and style reference support
 * Model: ideogram-ai/ideogram-v3-turbo (free tier on Replicate)
 */

const ASPECT_RATIO_MAP = {
  '1:1': '1:1',
  '16:9': '16:9',
  '9:16': '9:16',
  '4:3': '4:3',
  '3:4': '3:4',
  '3:2': '3:2',
  '2:3': '2:3',
};

export async function generateImage(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const { prompt, aspect_ratio = '1:1', n = 1, image, referenceType } = params;

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  const aspectRatio = ASPECT_RATIO_MAP[aspect_ratio] || '1:1';

  console.log(`[Ideogram] Generating image: ${prompt.substring(0, 50)}...`);

  try {
    const client = new Replicate({ auth: apiToken });

    const input = {
      prompt,
      aspect_ratio: aspectRatio,
      magic_prompt_option: 'on',
    };

    // Add reference image if provided
    if (image) {
      if (referenceType === 'character') {
        input.character_reference_image = image;
      } else if (referenceType === 'style') {
        input.style_reference_image = image;
      }
    }

    const prediction = await client.predictions.create({
      version: 'ideogram-ai/ideogram-v3-turbo',
      input,
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Ideogram generation failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output || completed.output.length === 0) {
      throw new Error('No images returned from Ideogram');
    }

    return {
      data: completed.output.map(url => ({ url })),
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Ideogram] Generation failed:', error.message, error.stack);
    const err = new Error(error.message || 'Ideogram generation failed');
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

  throw new Error(`Ideogram prediction ${predictionId} timed out after ${timeout}ms`);
}
