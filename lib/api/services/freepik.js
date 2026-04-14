/**
 * Freepik API Service
 * Handles all communication with Freepik AI APIs (image, video, audio generation)
 */

/**
 * Get internal headers for Freepik API
 */
function getHeaders() {
  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    throw new Error('Freepik API key is not configured');
  }
  return {
    'Content-Type': 'application/json',
    'x-freepik-api-key': apiKey || '',
  };
}

// API Endpoints
const ENDPOINTS = {
  // Image Generation
  MYSTIC: 'https://api.freepik.com/v1/ai/mystic',
  
  // Image Editing
  UPSCALE_CREATIVE: 'https://api.freepik.com/v1/ai/image-upscaler',
  UPSCALE_PRECISION: 'https://api.freepik.com/v1/ai/image-upscaler-precision-v2',
  RELIGHT: 'https://api.freepik.com/v1/ai/image-relight',
  STYLE_TRANSFER: 'https://api.freepik.com/v1/ai/image-style-transfer',
  REMOVE_BACKGROUND: 'https://api.freepik.com/v1/ai/beta/remove-background',
  REIMAGINE_FLUX: 'https://api.freepik.com/v1/ai/beta/text-to-image/reimagine-flux',
  IMAGE_EXPAND_FLUX: 'https://api.freepik.com/v1/ai/image-expand/flux-pro',
  IMAGE_EXPAND_SEEDREAM: 'https://api.freepik.com/v1/ai/image-expand/seedream-v4-5',
  IMAGE_EXPAND_IDEOGRAM: 'https://api.freepik.com/v1/ai/image-expand/ideogram',
  SKIN_ENHANCER: 'https://api.freepik.com/v1/ai/skin-enhancer',
  IDEOGRAM_EDIT: 'https://api.freepik.com/v1/ai/ideogram-image-edit',
  CHANGE_CAMERA: 'https://api.freepik.com/v1/ai/image-change-camera',
  
  // Video Generation
  KLING_ELEMENTS_PRO: 'https://api.freepik.com/v1/ai/image-to-video/kling-elements-pro',
  KLING_ELEMENTS_STATUS: 'https://api.freepik.com/v1/ai/image-to-video/kling-elements',
  KLING3: 'https://api.freepik.com/v1/ai/video/kling-v3',
  MINIMAX: 'https://api.freepik.com/v1/ai/video/minimax',
  WAN26: 'https://api.freepik.com/v1/ai/video/wan-2-6',
  SEEDANCE: 'https://api.freepik.com/v1/ai/video/seedance-1-5-pro',
  LTX_VIDEO: 'https://api.freepik.com/v1/ai/video/ltx-video-2-pro',
  RUNWAY: 'https://api.freepik.com/v1/ai/video/runway',
  PIXVERSE: 'https://api.freepik.com/v1/ai/video/pixverse-v5',
  OMNIHUMAN: 'https://api.freepik.com/v1/ai/video/omnihuman-1-5',
  VFX: 'https://api.freepik.com/v1/ai/video/vfx',
  VIDEO_UPSCALE_CREATIVE: 'https://api.freepik.com/v1/ai/video-upscale/creative',
  VIDEO_UPSCALE_PRECISION: 'https://api.freepik.com/v1/ai/video-upscale/precision',
  
  // Audio Generation
  MUSIC_GENERATION: 'https://api.freepik.com/v1/ai/music/generate',
  SOUND_EFFECTS: 'https://api.freepik.com/v1/ai/sound-effects/generate',
  AUDIO_ISOLATION: 'https://api.freepik.com/v1/ai/audio-isolation',
  
  // Other
  TEXT_TO_ICON: 'https://api.freepik.com/v1/ai/beta/text-to-icon',
  IMAGE_TO_PROMPT: 'https://api.freepik.com/v1/ai/beta/image-to-prompt',
  IMPROVE_PROMPT: 'https://api.freepik.com/v1/ai/beta/prompt-improvement',
  AI_IMAGE_CLASSIFIER: 'https://api.freepik.com/v1/ai/beta/ai-image-classifier',

  // Flux Endpoints
  FLUX_DEV: 'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
  FLUX_PRO: 'https://api.freepik.com/v1/ai/text-to-image/flux-2-pro',
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${ENDPOINTS.MYSTIC}${endpoint}`;
  
  console.log(`[Freepik] ${options.method || 'GET'} to ${url}`);
  if (options.body) {
    if (options.body.length > 500000) { // Over 500KB - don't parse fully for logs
      console.log(`[Freepik] Large Request Body (${(options.body.length / 1024 / 1024).toFixed(2)} MB), skipping full log.`);
    } else {
      try {
        // Only log first 50 chars of large fields like base64
        const bodyObj = JSON.parse(options.body);
        const logBody = { ...bodyObj };
        if (logBody.image) logBody.image = logBody.image.substring(0, 50) + '...';
        if (logBody.structure_reference) logBody.structure_reference = logBody.structure_reference.substring(0, 50) + '...';
        if (logBody.style_reference) logBody.style_reference = logBody.style_reference.substring(0, 50) + '...';
        console.log('[Freepik] Request Body:', JSON.stringify(logBody));
      } catch (e) {
        console.log('[Freepik] Request Body (non-JSON):', options.body.substring(0, 500) + '...');
      }
    }
  }

  try {
    
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
  options.signal = controller.signal;

    const response = await fetch(url, {
      headers: getHeaders(),
      ...options,
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`API returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
    }
    
    clearTimeout(timeoutId);
    if (!response.ok) {
      console.error('[Freepik] API Error Response:', JSON.stringify(data, null, 2));
      const error = new Error(data.message || data.error || `API request failed: ${response.status}`);
      error.status = response.status;
      error.data = data;
      // Preserve the full error chain for debugging
      error.originalResponse = data;
      throw error;
    }
    
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('API request timed out');
    }
    throw err;
  }
}

/**
 * Image Generation APIs
 */
export async function generateImage(params) {
  const { prompt, image_urls, aspect_ratio, resolution, num_images, model } = params;
  const hasStructureReference = Array.isArray(image_urls) && image_urls.length > 0;
  
  const resolutionMap = { '1K': '1k', '2K': '2k', '4K': '4k' };
  const aspectMap = {
    '1:1': 'square_1_1',
    '16:9': 'widescreen_16_9',
    '9:16': 'social_story_9_16',
    '4:3': 'standard_4_3',
    '3:4': 'portrait_3_4',
    '3:2': 'classic_3_2',
    '2:3': 'classic_2_3',
    '4:5': 'social_post_4_5',
    '5:4': 'social_5_4',
  };
  
  const body = {
    prompt: prompt || 'a beautiful image',
    aspect_ratio: aspectMap[aspect_ratio] || aspect_ratio || 'square_1_1',
  };
  if (params.negative_prompt) {
    body.negative_prompt = params.negative_prompt;
  }
  
  // Choose endpoint and complete body
  let endpoint = ENDPOINTS.MYSTIC;

  if (model === 'flux' || model === 'flux-dev') {
    endpoint = ENDPOINTS.FLUX_DEV;
  } else if (model === 'flux-pro') {
    endpoint = ENDPOINTS.FLUX_PRO;
  } else {
    // Mystic models
    body.resolution = resolutionMap[resolution] || '2k';
    body.num_images = num_images || 1;

    if (model === 'kora' || model === 'realism') {
      body.model = 'realism';
    } else if (model === 'freepik-mystic' || model === 'automatic' || !model) {
      // Freepik rejects structure_reference for fluid, so image-guided
      // generations must use the realism variant on the Mystic endpoint.
      body.model = hasStructureReference ? 'realism' : 'fluid';
    } else {
      const validMysticModels = ['fluid', 'realism', 'zen', 'flexible', 'super_real', 'editorial_portraits'];
      if (validMysticModels.includes(model)) {
        body.model = model;
      } else {
        console.warn(`[Freepik] Unknown Mystic model requested: ${model}. Falling back to fluid.`);
        body.model = 'fluid';
      }
    }
  }
  
  
  if (hasStructureReference) {
    const imgUrl = image_urls[0];
    if (imgUrl && typeof imgUrl === 'string') {
      try {
        if (imgUrl.startsWith('data:')) {
          console.log('[Freepik] Processing data URL for structure reference');
          // Extract base64 part
          const base64Data = imgUrl.split(',')[1];
          if (base64Data) {
            body.structure_reference = base64Data;
            body.structure_strength = 60;
          }
        } else if (imgUrl.startsWith('http')) {
          console.log('[Freepik] Fetching HTTP ref image:', imgUrl.substring(0, 100));

          const parsedUrl = new URL(imgUrl);
          const hostname = parsedUrl.hostname;
          if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname.startsWith('169.254.') || hostname.startsWith('172.16.')) {
            throw new Error('Invalid or restricted URL provided');
          }
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s fetch timeout
          const imgRes = await fetch(imgUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!imgRes.ok) throw new Error(`Source image fetch failed: ${imgRes.status}`);
          const arrayBuffer = await imgRes.arrayBuffer();
          body.structure_reference = Buffer.from(arrayBuffer).toString('base64');
          body.structure_strength = 60;
        }
      } catch (err) {
        console.error('[Freepik] Error processing structure reference:', err.message);
        // We can choose to continue without the reference or throw.
        // Given this is an "Edit" node, a missing reference is a failure.
        throw new Error(`Failed to process structure reference: ${err.message}`);
      }
    }
  }

  console.log('[Freepik] Final Mystic API Body:', JSON.stringify({ ...body, structure_reference: body.structure_reference ? '(base64...)' : undefined }, null, 2));
  
  const result = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return result;
}

/**
 * Kora Reality generation (wrapper around Mystic with realism model)
 */
export async function generateKora(params) {
  return generateImage({ ...params, model: 'realism' });
}

export async function getTaskStatus(taskId, modelOrEndpoint) {
  if (!taskId) throw new Error('Missing taskId for status check');
  
  let endpoint = ENDPOINTS.MYSTIC;
  
  // If modelOrEndpoint is a URL, use it directly as the base
  if (modelOrEndpoint && modelOrEndpoint.startsWith('http')) {
    endpoint = modelOrEndpoint;
  } else if (modelOrEndpoint === 'flux' || modelOrEndpoint === 'flux-dev') {
    endpoint = ENDPOINTS.FLUX_DEV;
  } else if (modelOrEndpoint === 'flux-pro') {
    endpoint = ENDPOINTS.FLUX_PRO;
  }
  
  return apiRequest(`${endpoint}/${taskId}`, {
    method: 'GET',
  });
}


/**
 * Image Editing APIs
 */
export async function upscaleCreative(params) {
  const { image, scale_factor, optimized_for, prompt, creativity, hdr, resemblance, fractality, engine, filter_nsfw } = params;
  
  const body = { image };
  if (scale_factor) body.scale_factor = scale_factor;
  if (optimized_for) body.optimized_for = optimized_for;
  if (prompt) body.prompt = prompt;
  if (creativity !== undefined) body.creativity = creativity;
  if (hdr !== undefined) body.hdr = hdr;
  if (resemblance !== undefined) body.resemblance = resemblance;
  if (fractality !== undefined) body.fractality = fractality;
  if (engine) body.engine = engine;
  if (filter_nsfw !== undefined) body.filter_nsfw = filter_nsfw;
  
  return apiRequest(ENDPOINTS.UPSCALE_CREATIVE, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getUpscaleCreativeStatus(taskId) {
  return apiRequest(`${ENDPOINTS.UPSCALE_CREATIVE}/${taskId}`, { method: 'GET' });
}

export async function upscalePrecision(params) {
  const { image, scale_factor, sharpen, smart_grain, ultra_detail, flavor } = params;
  
  const body = { image };
  if (scale_factor !== undefined) body.scale_factor = scale_factor;
  if (sharpen !== undefined) body.sharpen = sharpen;
  if (smart_grain !== undefined) body.smart_grain = smart_grain;
  if (ultra_detail !== undefined) body.ultra_detail = ultra_detail;
  if (flavor) body.flavor = flavor;
  
  return apiRequest(ENDPOINTS.UPSCALE_PRECISION, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getUpscalePrecisionStatus(taskId) {
  return apiRequest(`${ENDPOINTS.UPSCALE_PRECISION}/${taskId}`, { method: 'GET' });
}

export async function relightImage(params) {
  const { image, prompt, transfer_light_from_reference_image, transfer_light_from_lightmap, light_transfer_strength, interpolate_from_original, change_background, style, preserve_details, advanced_settings } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (transfer_light_from_reference_image) body.transfer_light_from_reference_image = transfer_light_from_reference_image;
  if (transfer_light_from_lightmap) body.transfer_light_from_lightmap = transfer_light_from_lightmap;
  if (light_transfer_strength !== undefined) body.light_transfer_strength = light_transfer_strength;
  if (interpolate_from_original !== undefined) body.interpolate_from_original = interpolate_from_original;
  if (change_background !== undefined) body.change_background = change_background;
  if (style) body.style = style;
  if (preserve_details !== undefined) body.preserve_details = preserve_details;
  if (advanced_settings) body.advanced_settings = advanced_settings;
  
  return apiRequest(ENDPOINTS.RELIGHT, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getRelightStatus(taskId) {
  return apiRequest(`${ENDPOINTS.RELIGHT}/${taskId}`, { method: 'GET' });
}

export async function styleTransfer(params) {
  const { image, reference_image, prompt, style_strength, structure_strength, is_portrait, portrait_style, portrait_beautifier, flavor, engine, fixed_generation } = params;
  
  const body = { image, reference_image };
  if (prompt) body.prompt = prompt;
  if (style_strength !== undefined) body.style_strength = style_strength;
  if (structure_strength !== undefined) body.structure_strength = structure_strength;
  if (is_portrait !== undefined) body.is_portrait = is_portrait;
  if (portrait_style) body.portrait_style = portrait_style;
  if (portrait_beautifier) body.portrait_beautifier = portrait_beautifier;
  if (flavor) body.flavor = flavor;
  if (engine) body.engine = engine;
  if (fixed_generation !== undefined) body.fixed_generation = fixed_generation;
  
  return apiRequest(ENDPOINTS.STYLE_TRANSFER, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getStyleTransferStatus(taskId) {
  return apiRequest(`${ENDPOINTS.STYLE_TRANSFER}/${taskId}`, { method: 'GET' });
}

export async function removeBackground(image) {
  const formData = new FormData();

  if (image.startsWith('http')) {
    const res = await fetch(image);
    const blob = await res.blob();
    formData.append('image_file', blob, 'image.jpg');
  } else if (image.startsWith('data:image')) {
    const base64Data = image.split(',')[1];
    const mimeMatch = image.match(/data:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const extension = mimeType.split('/')[1] || 'jpg';
    
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: mimeType });
    formData.append('image_file', blob, `image.${extension}`);
  } else {
    throw new Error('Unsupported image format. Use URL or Data URI.');
  }
  
  const response = await fetch(ENDPOINTS.REMOVE_BACKGROUND, {
    method: 'POST',
    headers: {
      'x-freepik-api-key': process.env.FREEPIK_API_KEY,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

export async function reimagineFlux(params) {
  const { image, prompt, imagination, aspect_ratio } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (imagination) body.imagination = imagination;
  if (aspect_ratio) body.aspect_ratio = aspect_ratio;
  
  return apiRequest(ENDPOINTS.REIMAGINE_FLUX, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function expandImage(provider, params) {
  const { image, left, right, top, bottom, prompt, seed } = params;
  
  const endpointMap = {
    flux: ENDPOINTS.IMAGE_EXPAND_FLUX,
    seedream: ENDPOINTS.IMAGE_EXPAND_SEEDREAM,
    ideogram: ENDPOINTS.IMAGE_EXPAND_IDEOGRAM,
  };
  
  const endpoint = endpointMap[provider];
  if (!endpoint) throw new Error(`Unknown provider: ${provider}`);
  
  const body = { image };
  if (left !== undefined) body.left = left;
  if (right !== undefined) body.right = right;
  if (top !== undefined) body.top = top;
  if (bottom !== undefined) body.bottom = bottom;
  if (prompt) body.prompt = prompt;
  if (seed !== undefined) body.seed = seed;
  
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getExpandStatus(provider, taskId) {
  const endpointMap = {
    flux: ENDPOINTS.IMAGE_EXPAND_FLUX,
    seedream: ENDPOINTS.IMAGE_EXPAND_SEEDREAM,
    ideogram: ENDPOINTS.IMAGE_EXPAND_IDEOGRAM,
  };
  return apiRequest(`${endpointMap[provider]}/${taskId}`, { method: 'GET' });
}

export async function skinEnhancer(mode, params) {
  const { image, sharpen, smart_grain, skin_detail, optimized_for } = params;
  
  const validModes = ['creative', 'faithful', 'flexible'];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid mode. Use: ${validModes.join(', ')}`);
  }
  
  const body = { image };
  if (sharpen !== undefined) body.sharpen = sharpen;
  if (smart_grain !== undefined) body.smart_grain = smart_grain;
  if (mode === 'faithful' && skin_detail !== undefined) body.skin_detail = skin_detail;
  if (mode === 'flexible' && optimized_for) body.optimized_for = optimized_for;
  
  return apiRequest(`${ENDPOINTS.SKIN_ENHANCER}/${mode}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getSkinEnhancerStatus(taskId) {
  return apiRequest(`${ENDPOINTS.SKIN_ENHANCER}/${taskId}`, { method: 'GET' });
}

export async function ideogramInpaint(params) {
  const { image, mask, prompt, seed, rendering_speed, magic_prompt, color_palette, style_codes, style_type, style_reference_images, character_reference_images } = params;
  
  const body = { image, mask, prompt };
  if (seed !== undefined) body.seed = seed;
  if (rendering_speed) body.rendering_speed = rendering_speed;
  if (magic_prompt) body.magic_prompt = magic_prompt;
  if (color_palette) body.color_palette = color_palette;
  if (style_codes?.length) body.style_codes = style_codes;
  if (style_type) body.style_type = style_type;
  if (style_reference_images?.length) body.style_reference_images = style_reference_images;
  if (character_reference_images?.length) body.character_reference_images = character_reference_images;
  
  return apiRequest(ENDPOINTS.IDEOGRAM_EDIT, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getIdeogramInpaintStatus(taskId) {
  return apiRequest(`${ENDPOINTS.IDEOGRAM_EDIT}/${taskId}`, { method: 'GET' });
}

export async function changeCamera(params) {
  const { image, horizontal_angle, vertical_angle, zoom, output_format, seed, webhook_url } = params;
  
  const body = { image };
  if (horizontal_angle !== undefined) body.horizontal_angle = horizontal_angle;
  if (vertical_angle !== undefined) body.vertical_angle = vertical_angle;
  if (zoom !== undefined) body.zoom = zoom;
  if (output_format) body.output_format = output_format;
  if (seed !== undefined) body.seed = seed;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.CHANGE_CAMERA, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getChangeCameraStatus(taskId) {
  return apiRequest(`${ENDPOINTS.CHANGE_CAMERA}/${taskId}`, { method: 'GET' });
}

/**
 * Video Generation APIs
 */
export async function klingElementsPro(params) {
  const { images, prompt, negative_prompt, duration, aspect_ratio, webhook_url } = params;
  
  const body = { images };
  if (prompt) body.prompt = prompt;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (duration !== undefined) body.duration = duration.toString();
  if (aspect_ratio) body.aspect_ratio = aspect_ratio;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.KLING_ELEMENTS_PRO, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getKlingElementsProStatus(taskId) {
  return apiRequest(`${ENDPOINTS.KLING_ELEMENTS_STATUS}/${taskId}`, { method: 'GET' });
}

export async function kling3Video(mode, params) {
  const { image, prompt, negative_prompt, duration, aspect_ratio, cfg_scale, generate_audio, webhook_url } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (duration !== undefined) body.duration = duration;
  if (aspect_ratio) body.aspect_ratio = aspect_ratio;
  if (cfg_scale !== undefined) body.cfg_scale = cfg_scale;
  if (generate_audio !== undefined) body.generate_audio = generate_audio;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(`${ENDPOINTS.KLING3}/${mode}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getKling3Status(taskId) {
  return apiRequest(`${ENDPOINTS.KLING3}/${taskId}`, { method: 'GET' });
}

export async function minimaxVideo(params) {
  const { image, prompt, camera_movement, prompt_optimizer, webhook_url } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (camera_movement) body.camera_movement = camera_movement;
  if (prompt_optimizer !== undefined) body.prompt_optimizer = prompt_optimizer;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.MINIMAX, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getMinimaxStatus(taskId) {
  return apiRequest(`${ENDPOINTS.MINIMAX}/${taskId}`, { method: 'GET' });
}

export async function wan26Video(params) {
  const { image, prompt, negative_prompt, resolution, duration, ratio, shot_type, prompt_expansion, seed, webhook_url } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (resolution) body.resolution = resolution;
  if (duration) body.duration = duration;
  if (ratio) body.ratio = ratio;
  if (shot_type) body.shot_type = shot_type;
  if (prompt_expansion !== undefined) body.prompt_expansion = prompt_expansion;
  if (seed !== undefined) body.seed = seed;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.WAN26, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getWan26Status(taskId) {
  return apiRequest(`${ENDPOINTS.WAN26}/${taskId}`, { method: 'GET' });
}

export async function seedanceVideo(params) {
  const { image, prompt, resolution, duration, aspect_ratio, generate_audio, camera_fixed, seed, webhook_url } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (resolution) body.resolution = resolution;
  if (duration !== undefined) body.duration = duration;
  if (aspect_ratio) body.aspect_ratio = aspect_ratio;
  if (generate_audio !== undefined) body.generate_audio = generate_audio;
  if (camera_fixed !== undefined) body.camera_fixed = camera_fixed;
  if (seed !== undefined) body.seed = seed;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.SEEDANCE, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getSeedanceStatus(taskId) {
  return apiRequest(`${ENDPOINTS.SEEDANCE}/${taskId}`, { method: 'GET' });
}

export async function ltxVideo(params) {
  const { image, prompt, resolution, duration, fps, generate_audio, seed, webhook_url } = params;
  
  const body = { image };
  if (prompt) body.prompt = prompt;
  if (resolution) body.resolution = resolution;
  if (duration !== undefined) body.duration = duration;
  if (fps !== undefined) body.fps = fps;
  if (generate_audio !== undefined) body.generate_audio = generate_audio;
  if (seed !== undefined) body.seed = seed;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.LTX_VIDEO, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getLtxStatus(taskId) {
  return apiRequest(`${ENDPOINTS.LTX_VIDEO}/${taskId}`, { method: 'GET' });
}

export async function runwayVideo(endpoint, params) {
  const { image, character_image, reference_image, prompt, ratio, duration, seed, body_control, expression_intensity, webhook_url } = params;
  
  const body = {};
  if (image) body.image = image;
  if (character_image) body.character_image = character_image;
  if (reference_image) body.reference_image = reference_image;
  if (prompt) body.prompt = prompt;
  if (ratio) body.ratio = ratio;
  if (duration !== undefined) body.duration = duration;
  if (seed !== undefined) body.seed = seed;
  if (body_control !== undefined) body.body_control = body_control;
  if (expression_intensity !== undefined) body.expression_intensity = expression_intensity;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(`${ENDPOINTS.RUNWAY}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getRunwayStatus(taskId) {
  return apiRequest(`${ENDPOINTS.RUNWAY}/${taskId}`, { method: 'GET' });
}

export async function pixverseVideo(endpoint, params) {
  const { start_image, end_image, prompt, resolution, ratio, duration, motion_intensity, seed, webhook_url } = params;
  
  const body = {};
  if (start_image) body.start_image = start_image;
  if (end_image) body.end_image = end_image;
  if (prompt) body.prompt = prompt;
  if (resolution) body.resolution = resolution;
  if (ratio) body.ratio = ratio;
  if (duration !== undefined) body.duration = duration;
  if (motion_intensity !== undefined) body.motion_intensity = motion_intensity;
  if (seed !== undefined) body.seed = seed;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(`${ENDPOINTS.PIXVERSE}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getPixverseStatus(taskId) {
  return apiRequest(`${ENDPOINTS.PIXVERSE}/${taskId}`, { method: 'GET' });
}

export async function omnihumanVideo(params) {
  const { image, audio_url, prompt, resolution, turbo_mode, webhook_url } = params;
  
  const body = { image, audio_url };
  if (prompt) body.prompt = prompt;
  if (resolution) body.resolution = resolution;
  if (turbo_mode !== undefined) body.turbo_mode = turbo_mode;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.OMNIHUMAN, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getOmnihumanStatus(taskId) {
  return apiRequest(`${ENDPOINTS.OMNIHUMAN}/${taskId}`, { method: 'GET' });
}

export async function vfxVideo(params) {
  const { video_url, filter_type, fps, bloom_contrast, motion_kernel_size, motion_decay_factor, webhook_url } = params;
  
  const body = { video_url };
  if (filter_type !== undefined) body.filter_type = filter_type;
  if (fps !== undefined) body.fps = fps;
  if (bloom_contrast !== undefined) body.bloom_contrast = bloom_contrast;
  if (motion_kernel_size !== undefined) body.motion_kernel_size = motion_kernel_size;
  if (motion_decay_factor !== undefined) body.motion_decay_factor = motion_decay_factor;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.VFX, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getVfxStatus(taskId) {
  return apiRequest(`${ENDPOINTS.VFX}/${taskId}`, { method: 'GET' });
}

export async function videoUpscale(type, params) {
  const { video_url, mode, resolution, flavor, creativity, sharpen, smart_grain, fps_boost, strength, webhook_url } = params;
  
  const endpoint = type === 'creative' ? ENDPOINTS.VIDEO_UPSCALE_CREATIVE : ENDPOINTS.VIDEO_UPSCALE_PRECISION;
  
  const body = { video_url };
  if (mode) body.mode = mode;
  if (resolution) body.resolution = resolution;
  if (flavor) body.flavor = flavor;
  if (creativity !== undefined) body.creativity = creativity;
  if (sharpen !== undefined) body.sharpen = sharpen;
  if (smart_grain !== undefined) body.smart_grain = smart_grain;
  if (fps_boost !== undefined) body.fps_boost = fps_boost;
  if (strength !== undefined) body.strength = strength;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getVideoUpscaleStatus(type, taskId) {
  const endpoint = type === 'creative' ? ENDPOINTS.VIDEO_UPSCALE_CREATIVE : ENDPOINTS.VIDEO_UPSCALE_PRECISION;
  return apiRequest(`${endpoint}/${taskId}`, { method: 'GET' });
}

/**
 * Audio Generation APIs
 */
export async function generateMusic(params) {
  const { prompt, duration, webhook_url } = params;
  
  const body = { prompt };
  if (duration !== undefined) body.duration = duration;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.MUSIC_GENERATION, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getMusicStatus(taskId) {
  return apiRequest(`${ENDPOINTS.MUSIC_GENERATION}/${taskId}`, { method: 'GET' });
}

export async function generateSoundEffects(params) {
  const { prompt, duration, loop, prompt_influence, webhook_url } = params;
  
  const body = { prompt };
  if (duration !== undefined) body.duration = duration;
  if (loop !== undefined) body.loop = loop;
  if (prompt_influence !== undefined) body.prompt_influence = prompt_influence;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.SOUND_EFFECTS, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getSoundEffectsStatus(taskId) {
  return apiRequest(`${ENDPOINTS.SOUND_EFFECTS}/${taskId}`, { method: 'GET' });
}

export async function audioIsolation(params) {
  const { audio_url, video_url, x1, y1, x2, y2, reranking_candidates, predict_spans, sample_fps, webhook_url } = params;
  
  const body = {};
  if (audio_url) body.audio_url = audio_url;
  if (video_url) body.video_url = video_url;
  if (x1 !== undefined) body.x1 = x1;
  if (y1 !== undefined) body.y1 = y1;
  if (x2 !== undefined) body.x2 = x2;
  if (y2 !== undefined) body.y2 = y2;
  if (reranking_candidates !== undefined) body.reranking_candidates = reranking_candidates;
  if (predict_spans !== undefined) body.predict_spans = predict_spans;
  if (sample_fps !== undefined) body.sample_fps = sample_fps;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.AUDIO_ISOLATION, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getAudioIsolationStatus(taskId) {
  return apiRequest(`${ENDPOINTS.AUDIO_ISOLATION}/${taskId}`, { method: 'GET' });
}

/**
 * Utility APIs
 */
export async function textToIcon(params) {
  const { prompt, style, format, num_inference_steps, guidance_scale, webhook_url } = params;
  
  const body = { prompt };
  if (style) body.style = style;
  if (format) body.format = format;
  if (num_inference_steps !== undefined) body.num_inference_steps = num_inference_steps;
  if (guidance_scale !== undefined) body.guidance_scale = guidance_scale;
  if (webhook_url) body.webhook_url = webhook_url;
  
  return apiRequest(ENDPOINTS.TEXT_TO_ICON, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function imageToPrompt(image) {
  return apiRequest(ENDPOINTS.IMAGE_TO_PROMPT, {
    method: 'POST',
    body: JSON.stringify({ image }),
  });
}

export async function improvePrompt(prompt, type, language) {
  return apiRequest(ENDPOINTS.IMPROVE_PROMPT, {
    method: 'POST',
    body: JSON.stringify({ prompt, type, language }),
  });
}

export async function classifyImage(image) {
  return apiRequest(ENDPOINTS.AI_IMAGE_CLASSIFIER, {
    method: 'POST',
    body: JSON.stringify({ image }),
  });
}

// Export endpoints for status checks
export { ENDPOINTS };
