import fetch from 'node-fetch';

/**
 * HeyGen Service - V3 Video-Agent text-to-video generation
 * Uses fal.ai API with async queue polling
 */

const FAL_API_KEY = process.env.FAL_API_KEY;
const HEYGEN_ENDPOINT = 'https://fal.run/fal-ai/heygen/v3/video-agent';
const FAL_STATUS_ENDPOINT = 'https://api.fal.ai/v1/queue';

async function pollHeyGenVideo(requestId, timeout = 1200000) {
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
        throw new Error(`HeyGen video generation failed: ${data.error || 'Unknown error'}`);
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`[HeyGen] Processing... (${elapsed}s elapsed, status: ${data.status})`);

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (err) {
      console.error(`[HeyGen] Polling error:`, err.message);
      throw err;
    }
  }

  throw new Error(`HeyGen video generation timed out after ${timeout}ms`);
}

export async function generateHeyGenVideo(params) {
  if (!FAL_API_KEY) {
    throw new Error('FAL_API_KEY is not set');
  }

  const { prompt, avatar = 'auto', voice = 'auto', orientation } = params;

  if (!prompt) {
    throw new Error('Prompt is required for HeyGen video generation');
  }

  console.log(`[HeyGen] Generating video: ${prompt.substring(0, 50)}...`);

  try {
    // Submit job to FAL queue
    const body = {
      prompt: prompt,
      avatar: avatar,
      voice: voice,
      incognito_mode: false,
    };

    if (orientation && ['landscape', 'portrait'].includes(orientation)) {
      body.orientation = orientation;
    }

    const submitResponse = await fetch(HEYGEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!submitResponse.ok) {
      const error = await submitResponse.json();
      throw new Error(`HeyGen submission failed: ${error.detail || submitResponse.statusText}`);
    }

    const submission = await submitResponse.json();
    const requestId = submission.request_id;

    console.log(`[HeyGen] Request submitted: ${requestId}`);

    // Poll for completion (20 min max timeout for video agent)
    const result = await pollHeyGenVideo(requestId);

    const videoUrl = result.video?.url || result.video;

    if (!videoUrl) {
      throw new Error('No video URL returned from HeyGen');
    }

    return {
      data: [{ url: videoUrl }],
      task_id: requestId,
    };
  } catch (error) {
    console.error('[HeyGen] Generation failed:', error.message);
    const err = new Error(error.message || 'HeyGen video generation failed');
    err.status = error.status || 500;
    throw err;
  }
}
