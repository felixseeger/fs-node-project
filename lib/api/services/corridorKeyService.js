import axios from 'axios';

/**
 * CorridorKey AI Service (via RunPod/Modal Serverless)
 * Calls a custom serverless endpoint to extract mattes/keys from video.
 */
export async function extractMatte(videoUrl, webhookUrl, options = {}) {
  const runpodEndpoint = process.env.RUNPOD_CORRIDORKEY_ENDPOINT;
  const runpodApiKey = process.env.RUNPOD_API_KEY;

  if (!runpodEndpoint || !runpodApiKey) {
    throw new Error('RUNPOD_CORRIDORKEY_ENDPOINT or RUNPOD_API_KEY environment variable is missing.');
  }

  // Assuming a standard RunPod serverless payload format
  const payload = {
    input: {
      video_url: videoUrl,
      sensitivity: options.sensitivity || 50,
      refinement: options.refinement || false
    },
    webhook: webhookUrl
  };

  const response = await axios.post(runpodEndpoint, payload, {
    headers: {
      'Authorization': `Bearer ${runpodApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}
