import Replicate from 'replicate';

/**
 * Replicate Service - Image Generation with async prediction polling
 */

const MODEL_MAP = {
  'flux': 'black-forest-labs/flux-1.1-pro',
  'flux-1-1-pro': 'black-forest-labs/flux-1.1-pro',
  'flux-dev': 'black-forest-labs/flux-dev',
  'flux-2-pro': 'black-forest-labs/flux-2-pro',
  'flux-context-pro': 'black-forest-labs/flux-pro',
  'Flux': 'black-forest-labs/flux-1.1-pro',
  'Flux Dev': 'black-forest-labs/flux-dev',
  'Flux Pro': 'black-forest-labs/flux-1.1-pro',
  'Nano Banana 2': 'google/nano-banana-2',
  'Nano Banana 2 Pro': 'google/nano-banana-2',
  'google-imagegen-4': 'google/imagen-4',
  'ideogram-v3-turbo': 'ideogram-ai/ideogram-v3-turbo',
  'kling3': 'fal:kling-video-v3-pro',
};

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
  const apiToken = process.env.REPLICATE_API_KEY;
  if (!apiToken) {
    throw new Error('REPLICATE_API_KEY is not set');
  }

  const { prompt, model, aspect_ratio = '1:1', n = 1, image, safety_filter_level, output_format, image_size } = params;

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  const replicateModel = MODEL_MAP[model] || 'black-forest-labs/flux-1.1-pro';
  const aspectRatio = ASPECT_RATIO_MAP[aspect_ratio] || '1:1';

  console.log(`[Replicate] Generating image with ${replicateModel}: ${prompt.substring(0, 50)}...`);

  try {
    const client = new Replicate({ auth: apiToken });

    // Build model-specific input parameters
    const input = {
      prompt: prompt,
    };

    // Google Imagen-4 specific parameters
    if (replicateModel === 'google/imagen-4') {
      input.aspect_ratio = aspectRatio;
      if (safety_filter_level) input.safety_filter_level = safety_filter_level;
      if (output_format) input.output_format = output_format;
      if (image_size) input.image_size = image_size;
    } else {
      // Flux and other models
      input.aspect_ratio = aspectRatio;
      input.num_outputs = Math.min(n, 4); // Replicate usually maxes at 4
      // Add image reference if provided (for FLUX.2 models)
      if (image) {
        input.image_ref = [image];
      }
    }

    const prediction = await client.predictions.create({
      model: replicateModel,
      input,
    });

    // Poll for completion
    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Replicate prediction failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No images returned from Replicate');
    }

    // Normalize output format to match Freepik style
    // Google Imagen-4 returns a single URL string
    // Flux and others return array of URLs
    const outputUrls = Array.isArray(completed.output)
      ? completed.output
      : [completed.output];

    return {
      data: outputUrls.map(url => ({
        url: url
      })),
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Replicate] Generation failed:', error.message, error.stack);
    const err = new Error(error.message || 'Replicate generation failed');
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

  throw new Error(`Replicate prediction ${predictionId} timed out after ${timeout}ms`);
}
