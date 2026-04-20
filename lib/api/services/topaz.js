import Replicate from 'replicate';

/**
 * Topaz Image Upscale Service - via Replicate API
 * Professional-grade image upscaling with face enhancement
 * Model: topazlabs/image-upscale
 */

const ENHANCE_MODELS = [
  'Standard V2',
  'Low Resolution V2',
  'CGI',
  'High Fidelity V2',
  'Text Refine',
];

const UPSCALE_FACTORS = ['2x', '3x', '4x', '6x'];

export async function upscaleImage(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const { image, enhance_model = 'Standard V2', upscale_factor = '2x', output_format = 'jpg', subject_detection, face_enhancement = false, face_enhancement_creativity = 0, face_enhancement_strength = 0.8 } = params;

  if (!image) {
    throw new Error('Image URL is required');
  }

  if (!ENHANCE_MODELS.includes(enhance_model)) {
    throw new Error(`Invalid enhance_model. Must be one of: ${ENHANCE_MODELS.join(', ')}`);
  }

  if (!UPSCALE_FACTORS.includes(upscale_factor)) {
    throw new Error(`Invalid upscale_factor. Must be one of: ${UPSCALE_FACTORS.join(', ')}`);
  }

  console.log(`[Topaz] Upscaling image with ${enhance_model}, ${upscale_factor}`);

  try {
    const client = new Replicate({ auth: apiToken });

    const input = {
      image,
      enhance_model,
      upscale_factor,
      output_format,
      face_enhancement,
    };

    if (subject_detection) {
      input.subject_detection = subject_detection;
    }

    if (face_enhancement) {
      input.face_enhancement_creativity = face_enhancement_creativity;
      input.face_enhancement_strength = face_enhancement_strength;
    }

    const prediction = await client.predictions.create({
      version: 'topazlabs/image-upscale',
      input,
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Topaz upscale failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from Topaz upscale');
    }

    return {
      data: [{ url: completed.output }],
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Topaz] Upscale failed:', error.message, error.stack);
    const err = new Error(error.message || 'Topaz upscale failed');
    err.status = error.status || 500;
    throw err;
  }
}

async function waitForPrediction(client, predictionId, timeout = 300000) {
  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < timeout) {
    const prediction = await client.predictions.get(predictionId);

    if (prediction.status === 'succeeded' || prediction.status === 'failed') {
      return prediction;
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Topaz prediction ${predictionId} timed out after ${timeout}ms`);
}
