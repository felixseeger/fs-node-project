/**
 * Centralized Processor Registry
 * 
 * Maps job types to their corresponding processor functions.
 * Both the API producer and the background worker import this registry.
 */

import { generateLtxVideo, pollLtxStatus } from './ltxService.js';
import { extractMatte } from './corridorKeyService.js';
// Add more processors as they are implemented

const processorRegistry = new Map();

// --- REGISTER PROCESSORS ---

/**
 * LTX Video Processor
 * Handles polling and result mapping for Fal.ai video generation.
 */
processorRegistry.set('ltx-video', async (payload, onProgress) => {
  const { prompt, options } = payload;
  const requestId = await generateLtxVideo(prompt, null, options);
  
  // Simple polling implementation
  let status = 'IN_PROGRESS';
  let result = null;
  
  while (status !== 'COMPLETED' && status !== 'FAILED') {
    // Check if we should pause or abort (mock check for now)
    // In a real implementation, we would check Redis or Firestore
    
    await new Promise(r => setTimeout(r, 2000));
    const response = await pollLtxStatus(requestId.request_id || requestId);
    status = response.status;
    
    if (status === 'COMPLETED') {
      result = response.result;
    } else if (status === 'FAILED') {
      throw new Error('Fal.ai job failed');
    }
    
    // Send progress update
    onProgress(status === 'COMPLETED' ? 100 : 50);
  }
  
  return result?.video?.url || result;
});

/**
 * Corridor Key VFX Processor
 * Handles heavy image-based keying logic.
 */
processorRegistry.set('corridorkey', async (payload, onProgress) => {
  const { videoUrl, options } = payload;
  return await extractMatte(videoUrl, null, options);
});

export default processorRegistry;
