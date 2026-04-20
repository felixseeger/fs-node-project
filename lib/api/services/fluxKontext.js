import Replicate from 'replicate';

/**
 * Flux Kontext Pro Service - via Replicate API
 * Text-based image generation and editing
 * Model: black-forest-labs/flux-kontext-pro
 */

const ASPECT_RATIOS = [
  '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16',
  'match_input_image'
];

const OUTPUT_FORMATS = ['jpg', 'png', 'webp'];

export async function generateImage(params) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const {
    prompt,
    input_image,
    aspect_ratio = input_image ? 'match_input_image' : '1:1',
    output_format = 'jpg',
    seed,
    safety_tolerance = 2,
    prompt_upsampling = false
  } = params;

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  if (!ASPECT_RATIOS.includes(aspect_ratio)) {
    throw new Error(`Invalid aspect_ratio. Must be one of: ${ASPECT_RATIOS.join(', ')}`);
  }

  if (!OUTPUT_FORMATS.includes(output_format)) {
    throw new Error(`Invalid output_format. Must be one of: ${OUTPUT_FORMATS.join(', ')}`);
  }

  // Safety tolerance max 2 when input image is used
  if (input_image && safety_tolerance > 2) {
    throw new Error('Safety tolerance max is 2 when input image is used');
  }

  if (safety_tolerance < 0 || safety_tolerance > 6) {
    throw new Error('Safety tolerance must be between 0 and 6');
  }

  const mode = input_image ? 'editing' : 'generation';
  console.log(`[Flux Kontext] ${mode} mode: ${prompt.substring(0, 50)}...`);

  try {
    const client = new Replicate({ auth: apiToken });

    const input = {
      prompt,
      aspect_ratio,
      output_format,
      safety_tolerance,
      prompt_upsampling,
    };

    if (input_image) {
      input.input_image = input_image;
    }

    if (seed !== undefined && seed !== null) {
      input.seed = seed;
    }

    const prediction = await client.predictions.create({
      version: 'black-forest-labs/flux-kontext-pro',
      input,
    });

    const completed = await waitForPrediction(client, prediction.id);

    if (completed.status === 'failed') {
      const error = new Error(completed.error?.message || 'Flux Kontext generation failed');
      error.status = 500;
      throw error;
    }

    if (!completed.output) {
      throw new Error('No output from Flux Kontext');
    }

    return {
      data: [{ url: completed.output }],
      task_id: completed.id,
    };
  } catch (error) {
    console.error('[Flux Kontext] Generation failed:', error.message, error.stack);
    const err = new Error(error.message || 'Flux Kontext generation failed');
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

  throw new Error(`Flux Kontext prediction ${predictionId} timed out after ${timeout}ms`);
}
