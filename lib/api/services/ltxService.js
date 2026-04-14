import axios from 'axios';

/**
 * LTX Video Service (via Fal.ai)
 * Calls the Fal.ai Serverless endpoint to generate videos asynchronously.
 */

export async function generateLtxVideo(prompt, webhookUrl, options = {}) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    console.warn('FAL_KEY environment variable is missing. Returning a mock video response for testing.');
    return {
      status: 'OK',
      request_id: 'mock-ltx-job-12345',
      response_url: 'http://localhost:3001/api/webhooks/mock-response' // Usually it's polled or webhook
    };
  }

  // Standard Fal.ai async queue endpoint for ltx-video
  // Documentation: https://fal.ai/models/fal-ai/ltx-video/api
  const url = 'https://queue.fal.run/fal-ai/ltx-video';

  const payload = {
    prompt: prompt,
    width: options.width || 768,
    height: options.height || 512,
    num_frames: options.frames || 121,
    webhook_url: webhookUrl,
  };

  if (options.image_url) {
    payload.image_url = options.image_url;
  }

  // Submit job to Fal.ai queue
  const response = await axios.post(url, payload, {
    headers: {
      'Authorization': `Key ${falKey}`,
      'Content-Type': 'application/json',
      'X-Fal-Webhook': webhookUrl
    }
  });

  // Since we don't have the official fal SDK here, we use the queue endpoint.
  // We need to return the request_id so we can associate it if needed, or
  // our webhook will just use the jobId we passed via query string.

  return response.data;
}

/**
 * Polls the status of a Fal.ai queue job.
 * 
 * @param {string} requestId - The request ID returned from generateLtxVideo
 * @returns {Promise<object>} - The current job status and result if available
 */
export async function pollLtxStatus(requestId) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    // Return mock successful result for testing when key is missing
    return {
      status: 'COMPLETED',
      result: {
        video: {
          url: 'https://storage.googleapis.com/fal-samples/ltx-video/sample.mp4'
        }
      }
    };
  }

  const url = `https://queue.fal.run/fal-ai/ltx-video/requests/${requestId}`;

  const response = await axios.get(url, {
    headers: {
      'Authorization': `Key ${falKey}`
    }
  });

  return response.data;
}
