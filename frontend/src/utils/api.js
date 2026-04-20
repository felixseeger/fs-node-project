import { getFirebaseAuth } from '../config/firebase';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function safeJson(res) {
  const text = await res.text();
  
  // Handle empty responses
  if (!text || text.trim() === '') {
    if (!res.ok) {
      return { 
        error: { 
          message: `HTTP ${res.status}: Empty response from server`,
          status: res.status 
        } 
      };
    }
    return {};
  }

  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      if (res.status === 403 && data.code === 'STORAGE_LIMIT_EXCEEDED') {
        const err = new Error(data.error || 'Storage limit reached');
        err.status = 403;
        err.limit = data.limit;
        err.current = data.current;
        
        // Dispatch a global event so the UI can show the storage limit modal
        window.dispatchEvent(new CustomEvent('storage_limit_reached', { 
          detail: { limit: data.limit, current: data.current } 
        }));
        
        throw err;
      }
      if (res.status === 429 && data.code === 'DAILY_LIMIT_EXCEEDED') {
        const err = new Error(data.error || 'Daily generation limit reached');
        err.status = 429;
        
        // Use the same modal or a separate alert
        window.dispatchEvent(new CustomEvent('daily_limit_reached', { 
          detail: { message: data.error } 
        }));
        
        throw err;
      }
      
      // Return structured error
      return { 
        error: {
          message: data.error?.message || data.error || data.message || `HTTP ${res.status}`,
          status: res.status,
          code: data.code || data.status
        }
      };
    }
    return data;
  } catch (e) {
    if (e.status === 403 || e.status === 429) throw e; // Re-throw our custom errors
    
    console.error("Invalid JSON response:", text.substring(0, 200));
    
    if (!res.ok) {
      return { 
        error: { 
          message: `HTTP ${res.status}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
          status: res.status,
          raw: text.substring(0, 500)
        } 
      };
    }
    
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}



async function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  try {
    const auth = getFirebaseAuth();
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // Firebase might not be configured, proceed without token
    console.warn("Could not get Firebase Auth token for API request");
  }
  return headers;
}

/**
 * Generic POST helper
 */
export async function postToApi(endpoint, params) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(params),
  });
  if (res.status === 402) {
    // Rely on safeJson to throw the detailed 402 error
    return safeJson(res);
  }
  return safeJson(res);
}

export async function uploadWorkflowThumbnail(imageDataUrl, workflowId) {
  const res = await fetch(`${API_BASE}/api/workflow-thumbnail`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ imageDataUrl, workflowId }),
  });

  const data = await safeJson(res);
  if (!res.ok || data?.success === false || !data?.url) {
    const message = data?.error || data?.message || `Failed to upload workflow thumbnail (HTTP ${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function uploadTemplateThumbnail(imageDataUrl, templateId) {
  const res = await fetch(`${API_BASE}/api/template-thumbnail`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ imageDataUrl, templateId }),
  });

  const data = await safeJson(res);
  if (!res.ok || data?.success === false || !data?.url) {
    const message = data?.error || data?.message || `Failed to upload template thumbnail (HTTP ${res.status})`;
    throw new Error(message);
  }

  return data;
}

/**
 * Generic status polling helper
 */
export async function pollGenericStatus(endpoint, taskId, {
  maxAttempts = 120,
  intervalMs = 3000,
  onProgress = null,
  statusKey = 'status',
  successValue = 'COMPLETED',
  failureValue = 'FAILED',
  errorLabel = 'Operation',
  endpointSuffix = ''
} = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}${endpoint}/${taskId}${endpointSuffix}`, { headers: await getAuthHeaders() });
    const data = await safeJson(res);

    if (onProgress) {
      onProgress(i + 1, maxAttempts, data);
    }

    const currentStatus = data.data?.[statusKey] || data.data?.status;

    if (currentStatus === successValue) return data;
    if (currentStatus === failureValue) {
      const errorMsg = data.error?.message || data.data?.error || 'Unknown error';
      const fullError = data.error?.details ? `${errorMsg} (${data.error.details})` : errorMsg;
      throw new Error(`${errorLabel} failed: ${fullError}`);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`${errorLabel} polling timeout`);
}


export async function generateImage(params) {
  return postToApi('/api/generate-image', params);
}

export async function generateKora(params) {
  return postToApi('/api/generate-kora', params);
}

export async function pollStatus(taskId, model, maxAttempts = 90, intervalMs = 2000, onProgress) {
  const endpointSuffix = model ? `?model=${model}` : '';
  return pollGenericStatus('/api/status', taskId, { maxAttempts, intervalMs, onProgress, errorLabel: 'Generation', endpointSuffix });
}

export async function segmentImage(params) {
  return postToApi('/api/segment-image', params);
}

export async function analyzeImage(params) {
  return postToApi('/api/analyze-image', params);
}

export async function upscaleCreative(params) {
  return postToApi('/api/upscale-creative', params);
}

export async function pollUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/upscale-creative', taskId, { maxAttempts, intervalMs, errorLabel: 'Upscale' });
}

export async function upscalePrecision(params) {
  return postToApi('/api/upscale-precision', params);
}

export async function pollPrecisionStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/upscale-precision', taskId, { maxAttempts, intervalMs, errorLabel: 'Precision upscale' });
}

export async function relightImage(params) {
  return postToApi('/api/relight', params);
}

export async function pollRelightStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/relight', taskId, { maxAttempts, intervalMs, errorLabel: 'Relight' });
}

export async function styleTransfer(params) {
  return postToApi('/api/style-transfer', params);
}

export async function pollStyleTransferStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/style-transfer', taskId, { maxAttempts, intervalMs, statusKey: 'task_status', errorLabel: 'Style transfer' });
}


export async function removeBackground(params) {
  return postToApi('/api/remove-background', params);
}

export async function reimagineFlux(params) {
  return postToApi('/api/reimagine-flux', params);
}

export async function imageExpandFluxPro(params) {
  return postToApi('/api/image-expand', params);
}

export async function pollImageExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/image-expand', taskId, { maxAttempts, intervalMs, errorLabel: 'Image expand' });
}

export async function seedreamExpand(params) {
  return postToApi('/api/seedream-expand', params);
}

export async function pollSeedreamExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/seedream-expand', taskId, { maxAttempts, intervalMs, errorLabel: 'Seedream expand' });
}

export async function ideogramExpand(params) {
  return postToApi('/api/ideogram-expand', params);
}

export async function pollIdeogramExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/ideogram-expand', taskId, { maxAttempts, intervalMs, errorLabel: 'Ideogram expand' });
}

export async function skinEnhancer(mode, params) {
  return postToApi(`/api/skin-enhancer/${mode}`, params);
}

export async function pollSkinEnhancerStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/skin-enhancer', taskId, { maxAttempts, intervalMs, errorLabel: 'Skin enhancer' });
}


export async function ideogramInpaint(params) {
  return postToApi('/api/ideogram-inpaint', params);
}

export async function pollIdeogramInpaintStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/ideogram-inpaint', taskId, { maxAttempts, intervalMs, errorLabel: 'Ideogram inpaint' });
}

export async function changeCamera(params) {
  return postToApi('/api/change-camera', params);
}

export async function pollChangeCameraStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/change-camera', taskId, { maxAttempts, intervalMs, errorLabel: 'Change camera' });
}

export async function kling3Generate(mode, params) {
  return postToApi(`/api/kling3/${mode}`, params);
}

export async function pollKling3Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/kling3', taskId, { maxAttempts, intervalMs, errorLabel: 'Kling 3 generation' });
}

export async function kling3OmniGenerate(mode, params) {
  return postToApi(`/api/kling3-omni/${mode}`, params);
}

export async function pollKling3OmniStatus(taskId, isReference, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/kling3-omni', taskId, {
    maxAttempts,
    intervalMs,
    errorLabel: 'Kling 3 Omni generation',
    endpointSuffix: `?reference=${isReference}` // Not yet supported in pollGenericStatus, but easily added
  });
}

export async function kling3MotionGenerate(mode, params) {
  return postToApi(`/api/kling3-motion/${mode}`, params);
}

export async function pollKling3MotionStatus(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus(`/api/kling3-motion/${mode}`, taskId, { maxAttempts, intervalMs, errorLabel: 'Kling 3 Motion Control generation' });
}

export async function vfxGenerate(params) {
  return postToApi('/api/vfx', params);
}

export async function pollVfxStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/vfx', taskId, { maxAttempts, intervalMs, errorLabel: 'VFX processing' });
}

export async function klingElementsProGenerate(params) {
  return postToApi('/api/kling-elements-pro', params);
}

export async function pollKlingElementsProStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/kling-elements-pro', taskId, { maxAttempts, intervalMs, errorLabel: 'Kling Elements Pro generation' });
}

export async function klingO1Generate(mode, params) {
  return postToApi(`/api/kling-o1/${mode}`, params);
}

export async function pollKlingO1Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/kling-o1', taskId, { maxAttempts, intervalMs, errorLabel: 'Kling O1 generation' });
}


export async function minimaxLiveGenerate(params) {
  return postToApi('/api/minimax-live', params);
}

export async function pollMiniMaxLiveStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/minimax-live', taskId, { maxAttempts, intervalMs, errorLabel: 'MiniMax Live generation' });
}


export async function wan26Generate(mode, resolution, params) {
  return postToApi(`/api/wan-v2-6/${mode}/${resolution}`, params);
}

export async function pollWan26Status(mode, resolution, taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus(`/api/wan-v2-6/${mode}/${resolution}`, taskId, { maxAttempts, intervalMs, errorLabel: 'WAN 2.6 generation' });
}


export async function seedanceGenerate(resolution, params) {
  return postToApi(`/api/seedance-1-5-pro/${resolution}`, params);
}

export async function pollSeedanceStatus(resolution, taskId, maxAttempts = 120, intervalMs = 3000, onProgress) {
  return pollGenericStatus(`/api/seedance-1-5-pro/${resolution}`, taskId, { maxAttempts, intervalMs, onProgress, errorLabel: 'Seedance generation' });
}


export async function ltxVideo2ProGenerate(mode, params) {
  return postToApi(`/api/ltx-2-pro/${mode}`, params);
}

export async function pollLtxVideo2ProStatus(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus(`/api/ltx-2-pro/${mode}`, taskId, { maxAttempts, intervalMs, errorLabel: 'LTX Video 2.0 Pro generation' });
}

export async function ltxVideoDirectGenerate(mode, params) {
  const res = await fetch(`${API_BASE}/api/ltx-direct/${mode}`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await safeJson(res);
    throw new Error(errorData.error?.message || `HTTP ${res.status}`);
  }

  // Check if response is binary video or JSON
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('video/') || contentType.includes('octet-stream')) {
    // Binary video response - convert to blob URL
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return {
      video_url: url,
      data: { generated: [url] }
    };
  } else {
    // JSON response (for async task handling if needed in future)
    return await safeJson(res);
  }
}

export async function pollLtxDirectStatus(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus(`/api/ltx-direct/${mode}`, taskId, {
    maxAttempts,
    intervalMs,
    errorLabel: 'LTX Video generation'
  });
}


export async function runwayGen45Generate(mode, params) {
  return postToApi(`/api/runway-4-5/${mode}`, params);
}

export async function pollRunwayGen45Status(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus(`/api/runway-4-5/${mode}`, taskId, { maxAttempts, intervalMs, errorLabel: 'Runway Gen 4.5 generation' });
}


export async function runwayGen4TurboGenerate(params) {
  return postToApi('/api/runway-gen4-turbo', params);
}

export async function pollRunwayGen4TurboStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/runway-gen4-turbo', taskId, { maxAttempts, intervalMs, errorLabel: 'Runway Gen4 Turbo generation' });
}


export async function runwayActTwoGenerate(params) {
  return postToApi('/api/runway-act-two', params);
}

export async function pollRunwayActTwoStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/runway-act-two', taskId, { maxAttempts, intervalMs, errorLabel: 'Runway Act Two generation' });
}


export async function pixVerseV5Generate(params) {
  return postToApi('/api/pixverse-v5', params);
}

export async function pollPixVerseV5Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/pixverse-v5', taskId, { maxAttempts, intervalMs, errorLabel: 'PixVerse V5 generation' });
}


export async function pixVerseV5TransitionGenerate(params) {
  return postToApi('/api/pixverse-v5-transition', params);
}

export async function pollPixVerseV5TransitionStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/pixverse-v5-transition', taskId, { maxAttempts, intervalMs, errorLabel: 'PixVerse V5 Transition generation' });
}


// --- PixVerse Direct API (Native) ---
export async function pixVerseVideoGenerate(mode, params) {
  const endpoint = mode === 'image' ? '/api/pixverse/image-to-video' : '/api/pixverse/text-to-video';
  return postToApi(endpoint, params);
}

export async function pollPixVerseVideoStatus(videoId, maxAttempts = 120, intervalMs = 3000, onProgress) {
  return pollGenericStatus('/api/pixverse/status', videoId, {
    maxAttempts,
    intervalMs,
    onProgress,
    errorLabel: 'PixVerse video generation'
  });
}

export async function pixVerseSoundEffect(params) {
  return postToApi('/api/pixverse/sound-effect', params);
}


export async function omniHumanGenerate(params) {
  return postToApi('/api/omni-human-1-5', params);
}

export async function pollOmniHumanStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/omni-human-1-5', taskId, { maxAttempts, intervalMs, errorLabel: 'OmniHuman generation' });
}

export async function videoImproveGenerate(params) {
  return postToApi('/api/video-improve', params);
}

export async function pollVideoImproveStatus(taskId, maxAttempts = 120, intervalMs = 5000) {
  return pollGenericStatus('/api/video-improve', taskId, { maxAttempts, intervalMs, errorLabel: 'Video Improvement' });
}


export async function videoUpscaleGenerate(mode, params) {
  return postToApi(`/api/video-upscale/${mode}`, params);
}

export async function pollVideoUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/video-upscale', taskId, { maxAttempts, intervalMs, errorLabel: 'Video upscaling' });
}


export async function precisionVideoUpscaleGenerate(params) {
  return postToApi('/api/video-upscaler-precision', params);
}

export async function pollPrecisionVideoUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/video-upscaler-precision', taskId, { maxAttempts, intervalMs, errorLabel: 'Precision video upscaling' });
}

export async function textToIconGenerate(params) {
  return postToApi('/api/text-to-icon', params);
}

export async function pollTextToIconStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/text-to-icon', taskId, { maxAttempts, intervalMs, errorLabel: 'Icon generation' });
}

export async function imageToPromptGenerate(params) {
  return postToApi('/api/image-to-prompt', params);
}

export async function pollImageToPromptStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/image-to-prompt', taskId, { maxAttempts, intervalMs, errorLabel: 'Image to prompt generation' });
}


export async function imageClassifierGenerate(params) {
  return postToApi('/api/classifier/image', params);
}

export async function improvePromptGenerate(params) {
  return postToApi('/api/improve-prompt', params);
}

export async function pollImprovePromptStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/improve-prompt', taskId, { maxAttempts, intervalMs, errorLabel: 'Improve prompt' });
}


export async function musicGenerate(params) {
  return postToApi('/api/music-generation', params);
}

export async function pollMusicStatus(taskId, maxAttempts = 120, intervalMs = 3000, onProgress) {
  return pollGenericStatus('/api/music-generation', taskId, {
    maxAttempts,
    intervalMs,
    errorLabel: 'Music generation',
    ...(onProgress
      ? {
          onProgress: (attempt, total, data) =>
            onProgress(
              attempt / total,
              data.data?.message || 'Waiting for music generation...'
            ),
        }
      : {}),
  });
}

export async function soundEffectsGenerate(params) {
  return postToApi('/api/sound-effects', params);
}

export async function pollSoundEffectsStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/sound-effects', taskId, { maxAttempts, intervalMs, errorLabel: 'Sound effects' });
}


export async function audioIsolationGenerate(params) {
  return postToApi('/api/audio-isolation', params);
}


export async function pollAudioIsolationStatus(taskId, onProgress, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/audio-isolation', taskId, {
    maxAttempts,
    intervalMs,
    onProgress: (attempt, total, data) => {
      // Audio isolation uses a specific progress structure
      if (onProgress && data.data?.progress) {
        onProgress(data.data.progress, data.data.message || 'Processing audio...');
      }
    },
    errorLabel: 'Audio isolation'
  });
}

export async function voiceoverGenerate(params) {
  return postToApi('/api/voiceover', params);
}

export async function pollVoiceoverStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  return pollGenericStatus('/api/voiceover', taskId, { maxAttempts, intervalMs, errorLabel: 'Voiceover' });
}

export { API_BASE };
export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const res = await fetch(`${API_BASE}/api/upload-image`, { method: 'POST', headers: await getAuthHeaders(), body: formData });
  
  const data = await safeJson(res);
  
  if (!res.ok || data?.error || data?.status === 'error') {
    const errorMsg = data?.error?.message || data?.error || data?.message || `Upload failed (HTTP ${res.status})`;
    const error = new Error(errorMsg);
    // @ts-ignore
    error.status = res.status;
    // @ts-ignore
    error.data = data;
    throw error;
  }
  
  return data;
}


export async function groupEditGenerate(params) {
  const res = await fetch(`${API_BASE}/api/group-edit`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.error || 'Failed to process group edit');
  }
  return safeJson(res);
}

export async function pollGroupEditStatus(taskId, maxAttempts = 240, intervalMs = 5000) {
  return pollGenericStatus('/api/group-edit', taskId, { maxAttempts, intervalMs, errorLabel: 'Group edit' });
}

export async function facialEditGenerate(params) {
  const res = await fetch(`${API_BASE}/api/facial-edit`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.error || 'Failed to process facial edit');
  }
  return safeJson(res);
}


// =============================================================================
// AI Workflow Generation API
// =============================================================================

/**
 * Generate a workflow from natural language prompt
 * @param {string} prompt - Natural language description of the workflow
 * @param {string} mode - Layout mode: 'standard' or 'compact'
 * @param {Object} context - Optional context
 * @param {Array} images - Optional reference images
 * @returns {Promise<{success: boolean, workflow: object}>}
 */
export async function generateAIWorkflow(prompt, mode = 'standard', context = null, images = []) {
  const res = await fetch(`${API_BASE}/api/ai-workflow/generate`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prompt, mode, context, images }),
  });
  return safeJson(res);
}


/**
 * Send a chat message to the AI
 * @param {string} message - User message
 * @param {Array} history - Message history
 * @param {string} system - Optional system prompt
 * @param {Array} images - Optional reference images
 * @returns {Promise<{success: boolean, response: string, commands?: Array}>}
 */
export async function sendChat(message, history = [], system = null, images = []) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ message, history, system, images }),
  });
  return safeJson(res);
}

/**
 * Get node suggestions based on partial prompt
 * @param {string} prompt - Partial natural language prompt
 * @param {Array} currentNodes - Currently placed nodes (optional)
 * @returns {Promise<{success: boolean, suggestions: array, intent: object}>}
 */
export async function suggestNodes(prompt, currentNodes = []) {
  const res = await fetch(`${API_BASE}/api/ai-workflow/suggest`, {
    method: 'POST',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prompt, currentNodes }),
  });
  return safeJson(res);
}

/**
 * Get available workflow patterns
 * @returns {Promise<{success: boolean, patterns: array}>}
 */
export async function getWorkflowPatterns() {
  const res = await fetch(`${API_BASE}/api/ai-workflow/patterns`, { headers: await getAuthHeaders() });
  return safeJson(res);
}

/**
 * Get all available node types organized by category
 * @returns {Promise<{success: boolean, categories: object}>}
 */
export async function getAINodeTypes() {
  const res = await fetch(`${API_BASE}/api/ai-workflow/nodes`, { headers: await getAuthHeaders() });
  return safeJson(res);
}

/**
 * General AI chat conversation
 * @param {Array} messages - Chat history messages
 * @returns {Promise<{success: boolean, content: string}>}
 */
export async function chatWithAI(messages) {
  return postToApi('/api/ai-chat', { messages });
}

export async function generateRecraftImage(params) {
  return postToApi('/api/recraft/generate', params);
}

export async function recraftImageToImage(params) {
  return postToApi('/api/recraft/image-to-image', params);
}

export async function recraftVectorize(params) {
  return postToApi('/api/recraft/vectorize', params);
}

export async function recraftRemoveBackground(params) {
  return postToApi('/api/recraft/remove-background', params);
}

export async function recraftUpscale(params) {
  return postToApi('/api/recraft/upscale', params);
}


// ============================================================================
// QuiverAI Operations
// ============================================================================

export async function quiverTextToSvg(params) {
  return postToApi('/api/quiver/svgs/generations', params);
}

export async function quiverImageToSvg(params) {
  return postToApi('/api/quiver/svgs/vectorizations', params);
}

// ============================================================================
// Tripo3D Operations
// ============================================================================

export async function tripoCreateTask(params) {
  return postToApi('/api/tripo/task', params);
}

export async function tripoGetTask(taskId) {
  if (!taskId) throw new Error('taskId is required');
  const res = await fetch(`${API_BASE}/api/tripo/task/${encodeURIComponent(taskId)}`, { headers: await getAuthHeaders() });
  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.error || `Failed to fetch Tripo task: ${res.status}`);
  }
  return data;
}

export async function fetchGeneratedProjectName() {
  try {
    const res = await fetch(`${API_BASE}/api/generate-name`, { headers: await getAuthHeaders() });
    const data = await safeJson(res);
    return data.name || "Untitled-Board-001";
  } catch (error) {
    console.error("Failed to fetch board name, falling back to default:", error);
    return "Untitled-Board-001";
  }
}

/**
 * Workflow analysis API
 */
export async function analyzeWorkflow(workflow) {
  return postToApi('/api/analyze-workflow', workflow);
}

/**
 * Workflow creation API
 */
export async function createWorkflow(name, nodes, edges) {
  return postToApi('/api/create-workflow', { name, nodes, edges });
}

/**
 * Voice input API
 */
export async function processVoiceInput(audioData, language = 'en-US') {
  const formData = new FormData();
  formData.append('audio', audioData, 'voice-input.webm');
  formData.append('language', language);

  const res = await fetch(`${API_BASE}/api/process-voice`, { method: 'POST', headers: await getAuthHeaders(), body: formData });

  return safeJson(res);
}

/**
 * Chat API
 */
export async function sendChatMessage(message, context = '') {
  return postToApi('/api/chat', { message, context });
}

/**
 * Node execution API
 */
export async function executeNode(nodeId, inputs) {
  return postToApi(`/api/execute-node/${nodeId}`, inputs);
}

/**
 * Workflow execution API
 */
export async function executeWorkflow(workflowId) {
  return postToApi(`/api/execute-workflow/${workflowId}`, {});
}

/**
 * Status polling for workflow execution
 */
export async function pollWorkflowStatus(taskId, onProgress) {
  return pollGenericStatus('/api/status', taskId, {
    maxAttempts: 180,
    intervalMs: 2000,
    onProgress,
    errorLabel: 'Workflow execution',
  });
}

/**
 * API Error handling
 */
export function isApiError(response) {
  return response && typeof response === 'object' && response.error;
}

export function getApiErrorMessage(response) {
  if (isApiError(response)) {
    return response.error.message || 'Unknown API error';
  }
  return 'Unknown error';
}

export async function vfxLtxGenerate(params) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${API_BASE}/api/vfx/ltx/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  });
  return safeJson(res);
}

export async function vfxCorridorKeyExtract(params) {
  const headers = await getAuthHeaders({ 'Content-Type': 'application/json' });
  const res = await fetch(`${API_BASE}/api/vfx/corridorkey/extract`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  });
  return safeJson(res);
}

export async function pollVfxJobStatus(jobId, maxAttempts = 120, intervalMs = 3000, onProgress) {
  for (let i = 0; i < maxAttempts; i++) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/vfx/job/${jobId}/status`, { headers });
    const data = await safeJson(res);

    if (data.error) {
      throw new Error(data.error.message || data.error);
    }

    if (data.progress && onProgress) {
      onProgress(data.progress);
    }

    if (data.status === 'completed' || data.status === 'failed') {
      return data;
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('VFX Job polling timed out');
}

/**
 * Moderates content for toxicity using the backend.
 * @param {string} text - The text to moderate.
 * @returns {Promise<{safe: boolean, reason: string}>}
 */
export async function moderateContent(text) {
  return postToApi('/api/moderate', { text });
}
