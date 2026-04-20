import fetch from 'node-fetch';

/**
 * Ernie Image Service - LoRA Turbo text-to-image generation
 * Uses fal.ai API with async queue polling
 */

const FAL_API_KEY = process.env.FAL_API_KEY;
const ERNIE_ENDPOINT = 'https://fal.run/fal-ai/ernie-image/lora/turbo';
const FAL_STATUS_ENDPOINT = 'https://api.fal.ai/v1/queue';

const IMAGE_SIZE_MAP = {
  '1:1': 'square_hd',
  '16:9': 'landscape_4k',
  '9:16': 'portrait_4k',
  '4:3': 'landscape_hd',
  '3:4': 'portrait_hd',
};

async function pollErnieImage(requestId, timeout = 300000) {
  const startTime = Date.now();
  const pollInterval = 3000; // 3 seconds

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${FAL_STATUS_ENDPOINT}/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
        }
      });

      const data = await response.json();

      if (data.status === 'completed') {
        return data.result;
      }

      if (data.status === 'failed') {
        throw new Error(`Ernie image generation failed: ${data.error || 'Unknown error'}`);
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`[Ernie] Processing... (${elapsed}s elapsed, status: ${data.status})`);

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (err) {
      console.error(`[Ernie] Polling error:`, err.message);
      throw err;
    }
  }

  throw new Error(`Ernie image generation timed out after ${timeout}ms`);
}

export async function generateImage(params) {
  if (!FAL_API_KEY) {
    throw new Error('FAL_API_KEY is not set');
  }

  const { prompt, aspect_ratio = '1:1', n = 1, negative_prompt = '', guidance_scale = 1 } = params;

  if (!prompt) {
    throw new Error('Prompt is required for Ernie image generation');
  }

  const imageSize = IMAGE_SIZE_MAP[aspect_ratio] || 'square_hd';

  console.log(`[Ernie] Generating image: ${prompt.substring(0, 50)}...`);

  try {
    // Submit job to FAL queue
    const submitResponse = await fetch(ERNIE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: negative_prompt,
        image_size: imageSize,
        num_inference_steps: 8,
        guidance_scale: guidance_scale,
        num_images: Math.min(n, 4),
        enable_prompt_expansion: true,
        enable_safety_checker: true,
        output_format: 'jpeg',
        loras: []
      })
    });

    if (!submitResponse.ok) {
      const error = await submitResponse.json();
      throw new Error(`Ernie submission failed: ${error.detail || submitResponse.statusText}`);
    }

    const submission = await submitResponse.json();
    const requestId = submission.request_id;

    console.log(`[Ernie] Request submitted: ${requestId}`);

    // Poll for completion
    const result = await pollErnieImage(requestId);

    // Normalize output: Ernie returns { images: [...], prompt, seed }
    const imageUrls = result.images?.map(img => img.url) || [];

    if (imageUrls.length === 0) {
      throw new Error('No images returned from Ernie');
    }

    return {
      data: imageUrls.map(url => ({ url })),
      task_id: requestId,
    };
  } catch (error) {
    console.error('[Ernie] Generation failed:', error.message);
    const err = new Error(error.message || 'Ernie image generation failed');
    err.status = error.status || 500;
    throw err;
  }
}
