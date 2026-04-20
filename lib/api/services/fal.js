import fetch from 'node-fetch';

/**
 * FAL Service - KLING 3 Image to Video generation
 * Uses fal.ai API with async queue polling
 */

const FAL_API_KEY = process.env.FAL_API_KEY;
const FAL_ENDPOINT = 'https://fal.run/fal-ai/kling-video/v3/pro/image-to-video';
const FAL_STATUS_ENDPOINT = 'https://api.fal.ai/v1/queue';

async function pollKlingVideo(requestId, timeout = 900000) {
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
        throw new Error(`KLING video generation failed: ${data.error || 'Unknown error'}`);
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`[FAL] KLING processing... (${elapsed}s elapsed, status: ${data.status})`);

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (err) {
      console.error(`[FAL] Polling error:`, err.message);
      throw err;
    }
  }

  throw new Error(`KLING video generation timed out after ${timeout}ms`);
}

export async function generateKlingVideo(params) {
  if (!FAL_API_KEY) {
    throw new Error('FAL_API_KEY is not set');
  }

  const { prompt, start_image_url, duration = '5', generate_audio = true, negative_prompt } = params;

  if (!start_image_url) {
    throw new Error('start_image_url is required for KLING video generation');
  }

  console.log(`[FAL] Generating KLING video: ${prompt?.substring(0, 50) || 'no prompt'}...`);

  try {
    // Submit job to FAL queue
    const submitResponse = await fetch(FAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_image_url,
        prompt: prompt || 'Cinematic video generation',
        duration: String(duration),
        generate_audio,
        negative_prompt: negative_prompt || 'blur, distort, and low quality',
        cfg_scale: 0.5,
      })
    });

    if (!submitResponse.ok) {
      const error = await submitResponse.json();
      throw new Error(`FAL submission failed: ${error.detail || submitResponse.statusText}`);
    }

    const submission = await submitResponse.json();
    const requestId = submission.request_id;

    console.log(`[FAL] Request submitted: ${requestId}`);

    // Poll for completion
    const result = await pollKlingVideo(requestId);

    const videoUrl = result.video?.url || result.video;

    if (!videoUrl) {
      throw new Error('No video URL returned from FAL');
    }

    return {
      data: [{ url: videoUrl }],
      task_id: requestId,
    };
  } catch (error) {
    console.error('[FAL] Generation failed:', error.message);
    const err = new Error(error.message || 'KLING video generation failed');
    err.status = error.status || 500;
    throw err;
  }
}
