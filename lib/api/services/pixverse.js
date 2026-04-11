/**
 * PixVerse API Service
 * Direct API integration for PixVerse AI video generation
 * Base URL: https://app-api.pixverse.ai
 * Docs: @knowledgebase/pixverse-ai/
 */

import { randomUUID } from 'crypto';
import FormData from 'form-data';
import fs from 'fs';

function getHeaders(isMultipart = false) {
  const apiKey = process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    console.error('[PixVerse] Warning: PIXVERSE_API_KEY is not set');
  }
  const headers = {
    'API-KEY': apiKey || '',
    'Ai-trace-id': randomUUID(),
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

const BASE_URL = 'https://app-api.pixverse.ai/openapi/v2';

async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const isMultipart = options.body instanceof FormData;
  const headers = getHeaders(isMultipart);

  console.log(`[PixVerse] ${method} ${endpoint}`);

  try {
    const response = await fetch(url, {
      method,
      headers: isMultipart ? headers : { ...headers },
      body: options.body,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('[PixVerse] Invalid JSON response:', text.substring(0, 200));
      return { error: { message: `HTTP ${response.status}: Invalid JSON` } };
    }

    if (!response.ok) {
      console.error('[PixVerse] API error:', data.ErrMsg || data.err_msg || `HTTP ${response.status}`);
      return { error: { message: data.ErrMsg || data.err_msg || `HTTP ${response.status}` } };
    }

    console.log('[PixVerse] Response:', JSON.stringify(data).substring(0, 200));
    return data;
  } catch (err) {
    console.error('[PixVerse] Request failed:', err.message);
    return { error: { message: err.message } };
  }
}

/**
 * Upload image to PixVerse
 * Accepts either HTTP URL or base64 data URL
 * Returns { Resp: { img_id, img_url } }
 */
export async function uploadImage(imageInput) {
  if (!imageInput) return { error: { message: 'Image input required' } };

  try {
    // If it's a URL, send as image_url
    if (typeof imageInput === 'string' && imageInput.startsWith('http')) {
      const body = JSON.stringify({ image_url: imageInput });
      return apiRequest('/image/upload', {
        method: 'POST',
        body,
      });
    }

    // If it's a data URL or base64, extract and send as multipart
    let base64Data = imageInput;
    if (imageInput.startsWith('data:')) {
      base64Data = imageInput.split(',')[1];
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const form = new FormData();
    form.append('image', buffer, { filename: 'image.png', contentType: 'image/png' });

    return apiRequest('/image/upload', {
      method: 'POST',
      body: form,
    });
  } catch (err) {
    console.error('[PixVerse] Image upload error:', err.message);
    return { error: { message: err.message } };
  }
}

/**
 * Text-to-Video generation
 * POST /openapi/v2/video/text/generate
 * Returns { Resp: { video_id } }
 */
export async function textToVideo(params) {
  const {
    aspect_ratio,
    duration,
    model,
    motion_mode,
    negative_prompt,
    prompt,
    quality,
    seed,
    style,
    sound_effect_switch,
    sound_effect_content,
  } = params;

  const body = {
    aspect_ratio: aspect_ratio || '16:9',
    duration: duration || 5,
    model: model || 'v5.6',
    prompt: prompt || '',
    quality: quality || '720p',
  };

  if (motion_mode) body.motion_mode = motion_mode;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (seed !== undefined) body.seed = seed;
  if (style) body.style = style;
  if (sound_effect_switch !== undefined) body.sound_effect_switch = sound_effect_switch;
  if (sound_effect_content) body.sound_effect_content = sound_effect_content;

  return apiRequest('/video/text/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Image-to-Video generation
 * First uploads image (if needed), then generates video
 * Returns { Resp: { video_id } }
 */
export async function imageToVideo(params) {
  const {
    image,
    duration,
    model,
    motion_mode,
    negative_prompt,
    prompt,
    quality,
    seed,
    sound_effect_switch,
    sound_effect_content,
  } = params;

  if (!image) {
    return { error: { message: 'Image required for image-to-video' } };
  }

  // Upload image first
  const uploadResult = await uploadImage(image);
  if (uploadResult.error) return uploadResult;

  const imgId = uploadResult.Resp?.img_id;
  if (!imgId) {
    return { error: { message: 'Failed to extract img_id from upload response' } };
  }

  const body = {
    img_id: imgId,
    duration: duration || 5,
    model: model || 'v5.6',
    prompt: prompt || '',
    quality: quality || '720p',
  };

  if (motion_mode) body.motion_mode = motion_mode;
  if (negative_prompt) body.negative_prompt = negative_prompt;
  if (seed !== undefined) body.seed = seed;
  if (sound_effect_switch !== undefined) body.sound_effect_switch = sound_effect_switch;
  if (sound_effect_content) body.sound_effect_content = sound_effect_content;

  return apiRequest('/video/img/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Sound Effect generation
 * Adds sound to an existing PixVerse-generated video or uploaded video
 * Returns { Resp: { video_id } or task_id }
 */
export async function soundEffectGenerate(params) {
  const {
    source_video_id,
    video_url,
    original_sound_switch,
    sound_effect_content,
  } = params;

  const body = {};

  // If source_video_id provided, use it; otherwise upload video first
  if (source_video_id !== undefined) {
    body.source_video_id = source_video_id;
  } else if (video_url) {
    // For now, send as video URL (PixVerse API supports image_url pattern)
    // In a real scenario, might need to upload via /media/upload first
    body.video_url = video_url;
  } else {
    return { error: { message: 'Either source_video_id or video_url required' } };
  }

  if (original_sound_switch !== undefined) body.original_sound_switch = original_sound_switch;
  if (sound_effect_content) body.sound_effect_content = sound_effect_content;

  return apiRequest('/video/sound_effect/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Get video generation status
 * GET /openapi/v2/video/result/{video_id}
 * Normalizes response to standard format:
 * { data: { status: 'COMPLETED'|'PENDING'|'FAILED', generated: ['url1', 'url2'] } }
 */
export async function getVideoStatus(videoId) {
  const result = await apiRequest(`/video/result/${videoId}`, {
    method: 'GET',
  });

  if (result.error) {
    return { data: { status: 'FAILED', error: result.error.message } };
  }

  const resp = result.Resp || {};
  let status = 'PENDING';
  const generated = [];

  // Map PixVerse status codes to standard format
  // 1 = done, 5 = processing, 7 = moderation failed, 8 = generation failed
  switch (resp.status) {
    case 1:
      status = 'COMPLETED';
      if (resp.url) generated.push(resp.url);
      break;
    case 5:
      status = 'PENDING';
      break;
    case 7:
    case 8:
      status = 'FAILED';
      break;
    default:
      status = 'PENDING';
  }

  return {
    data: {
      status,
      generated,
      ...(status === 'FAILED' && { error: resp.err_msg || 'Generation failed' }),
    },
  };
}
