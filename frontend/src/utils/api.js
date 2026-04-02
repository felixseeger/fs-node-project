const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON response:", text.substring(0, 200));
    if (!res.ok) {
      return { error: { message: `HTTP ${res.status}: ${text.substring(0, 100)}...` } };
    }
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

export async function generateImage(params) {
  const res = await fetch(`${API_BASE}/api/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function generateKora(params) {
  const res = await fetch(`${API_BASE}/api/generate-kora`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollStatus(taskId, maxAttempts = 90, intervalMs = 2000, onProgress) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/status/${taskId}`);
    const data = await safeJson(res);

    // Call progress callback if provided
    if (onProgress) {
      onProgress(i + 1, maxAttempts, data);
    }

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Polling timeout');
}

export async function analyzeImage(params) {
  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function upscaleCreative(params) {
  const res = await fetch(`${API_BASE}/api/upscale-creative`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/upscale-creative/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Upscale failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Upscale polling timeout');
}

export async function upscalePrecision(params) {
  const res = await fetch(`${API_BASE}/api/upscale-precision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollPrecisionStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/upscale-precision/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Precision upscale failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Precision upscale polling timeout');
}

export async function relightImage(params) {
  const res = await fetch(`${API_BASE}/api/relight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollRelightStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/relight/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Relight failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Relight polling timeout');
}

export async function styleTransfer(params) {
  const res = await fetch(`${API_BASE}/api/style-transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollStyleTransferStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/style-transfer/${taskId}`);
    const data = await safeJson(res);

    const status = data.data?.task_status || data.data?.status;
    if (status === 'COMPLETED') return data;
    if (status === 'FAILED') throw new Error('Style transfer failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Style transfer polling timeout');
}

export async function removeBackground(params) {
  const res = await fetch(`${API_BASE}/api/remove-background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function reimagineFlux(params) {
  const res = await fetch(`${API_BASE}/api/reimagine-flux`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function imageExpandFluxPro(params) {
  const res = await fetch(`${API_BASE}/api/image-expand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollImageExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/image-expand/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Image expand failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Image expand polling timeout');
}

export async function seedreamExpand(params) {
  const res = await fetch(`${API_BASE}/api/seedream-expand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollSeedreamExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/seedream-expand/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Seedream expand failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Seedream expand polling timeout');
}

export async function ideogramExpand(params) {
  const res = await fetch(`${API_BASE}/api/ideogram-expand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollIdeogramExpandStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/ideogram-expand/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Ideogram expand failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Ideogram expand polling timeout');
}

export async function skinEnhancer(mode, params) {
  const res = await fetch(`${API_BASE}/api/skin-enhancer/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollSkinEnhancerStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/skin-enhancer/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Skin enhancer failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Skin enhancer polling timeout');
}

export async function ideogramInpaint(params) {
  const res = await fetch(`${API_BASE}/api/ideogram-inpaint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollIdeogramInpaintStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/ideogram-inpaint/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Ideogram inpaint failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Ideogram inpaint polling timeout');
}

export async function changeCamera(params) {
  const res = await fetch(`${API_BASE}/api/change-camera`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollChangeCameraStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/change-camera/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Change camera failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Change camera polling timeout');
}

export async function kling3Generate(mode, params) {
  const res = await fetch(`${API_BASE}/api/kling3/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollKling3Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/kling3/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Kling 3 generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Kling 3 polling timeout');
}

export async function kling3OmniGenerate(mode, params) {
  const res = await fetch(`${API_BASE}/api/kling3-omni/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollKling3OmniStatus(taskId, isReference, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/kling3-omni/${taskId}?reference=${isReference}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Kling 3 Omni generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Kling 3 Omni polling timeout');
}

export async function kling3MotionGenerate(mode, params) {
  const res = await fetch(`${API_BASE}/api/kling3-motion/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollKling3MotionStatus(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/kling3-motion/${mode}/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Kling 3 Motion Control generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Kling 3 Motion Control polling timeout');
}

export async function vfxGenerate(params) {
  const res = await fetch(`${API_BASE}/api/vfx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollVfxStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/vfx/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('VFX processing failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('VFX polling timeout');
}

export async function klingElementsProGenerate(params) {
  const res = await fetch(`${API_BASE}/api/kling-elements-pro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollKlingElementsProStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/kling-elements-pro/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Kling Elements Pro generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Kling Elements Pro polling timeout');
}

export async function klingO1Generate(mode, params) {
  const res = await fetch(`${API_BASE}/api/kling-o1/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollKlingO1Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/kling-o1/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Kling O1 generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Kling O1 polling timeout');
}

export async function minimaxLiveGenerate(params) {
  const res = await fetch(`${API_BASE}/api/minimax-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollMiniMaxLiveStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/minimax-live/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('MiniMax Live generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('MiniMax Live polling timeout');
}

export async function wan26Generate(mode, resolution, params) {
  const res = await fetch(`${API_BASE}/api/wan-v2-6/${mode}/${resolution}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollWan26Status(mode, resolution, taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/wan-v2-6/${mode}/${resolution}/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('WAN 2.6 generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('WAN 2.6 polling timeout');
}

export async function seedanceGenerate(resolution, params) {
  const res = await fetch(`${API_BASE}/api/seedance-1-5-pro/${resolution}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollSeedanceStatus(resolution, taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/seedance-1-5-pro/${resolution}/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Seedance generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Seedance polling timeout');
}

export async function ltxVideo2ProGenerate(mode, params) {
  const res = await fetch(`${API_BASE}/api/ltx-2-pro/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollLtxVideo2ProStatus(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/ltx-2-pro/${mode}/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('LTX Video 2.0 Pro generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('LTX Video 2.0 Pro polling timeout');
}

export async function runwayGen45Generate(mode, params) {
  const res = await fetch(`${API_BASE}/api/runway-4-5/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollRunwayGen45Status(mode, taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/runway-4-5/${mode}/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Runway Gen 4.5 generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Runway Gen 4.5 polling timeout');
}

export async function runwayGen4TurboGenerate(params) {
  const res = await fetch(`${API_BASE}/api/runway-gen4-turbo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollRunwayGen4TurboStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/runway-gen4-turbo/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Runway Gen4 Turbo generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Runway Gen4 Turbo polling timeout');
}

export async function runwayActTwoGenerate(params) {
  const res = await fetch(`${API_BASE}/api/runway-act-two`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollRunwayActTwoStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/runway-act-two/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Runway Act Two generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Runway Act Two polling timeout');
}

export async function pixVerseV5Generate(params) {
  const res = await fetch(`${API_BASE}/api/pixverse-v5`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollPixVerseV5Status(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/pixverse-v5/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('PixVerse V5 generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('PixVerse V5 polling timeout');
}

export async function pixVerseV5TransitionGenerate(params) {
  const res = await fetch(`${API_BASE}/api/pixverse-v5-transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollPixVerseV5TransitionStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/pixverse-v5-transition/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('PixVerse V5 Transition generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('PixVerse V5 Transition polling timeout');
}

export async function omniHumanGenerate(params) {
  const res = await fetch(`${API_BASE}/api/omni-human-1-5`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollOmniHumanStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/omni-human-1-5/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('OmniHuman generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('OmniHuman polling timeout');
}

export async function videoUpscaleGenerate(mode, params) {
  const res = await fetch(`${API_BASE}/api/video-upscale/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollVideoUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/video-upscale/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Video upscaling failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Video upscaling polling timeout');
}

export async function precisionVideoUpscaleGenerate(params) {
  const res = await fetch(`${API_BASE}/api/video-upscaler-precision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollPrecisionVideoUpscaleStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/video-upscaler-precision/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Precision video upscaling failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Precision video upscaling polling timeout');
}

export async function textToIconGenerate(params) {
  const res = await fetch(`${API_BASE}/api/text-to-icon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollTextToIconStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/text-to-icon/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Icon generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Icon generation polling timeout');
}

export async function imageToPromptGenerate(params) {
  const res = await fetch(`${API_BASE}/api/image-to-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollImageToPromptStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/image-to-prompt/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Image to prompt generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Image to prompt polling timeout');
}

export async function imageClassifierGenerate(params) {
  const res = await fetch(`${API_BASE}/api/classifier/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function improvePromptGenerate(params) {
  const res = await fetch(`${API_BASE}/api/improve-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollImprovePromptStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/improve-prompt/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Improve prompt failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Improve prompt polling timeout');
}

export async function musicGenerate(params) {
  const res = await fetch(`${API_BASE}/api/music-generation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollMusicStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/music-generation/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Music generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Music generation polling timeout');
}

export async function soundEffectsGenerate(params) {
  const res = await fetch(`${API_BASE}/api/sound-effects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollSoundEffectsStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/sound-effects/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Sound effects generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Sound effects polling timeout');
}

export async function audioIsolationGenerate(params) {
  const res = await fetch(`${API_BASE}/api/audio-isolation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollAudioIsolationStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/audio-isolation/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Audio isolation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Audio isolation polling timeout');
}

export async function voiceoverGenerate(params) {
  const res = await fetch(`${API_BASE}/api/voiceover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return safeJson(res);
}

export async function pollVoiceoverStatus(taskId, maxAttempts = 120, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/voiceover/${taskId}`);
    const data = await safeJson(res);

    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Voiceover generation failed');

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Voiceover polling timeout');
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const res = await fetch(`${API_BASE}/api/upload-image`, {
    method: 'POST',
    body: formData,
  });
  return safeJson(res);
}

export async function groupEditGenerate(params) {
  const res = await fetch(`${API_BASE}/api/group-edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err.error || 'Failed to process group edit');
  }
  return safeJson(res);
}

export async function facialEditGenerate(params) {
  const res = await fetch(`${API_BASE}/api/facial-edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
 * @returns {Promise<{success: boolean, workflow: object}>}
 */
export async function generateAIWorkflow(prompt, mode = 'standard') {
  const res = await fetch(`${API_BASE}/api/ai-workflow/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode }),
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, currentNodes }),
  });
  return safeJson(res);
}

/**
 * Get available workflow patterns
 * @returns {Promise<{success: boolean, patterns: array}>}
 */
export async function getWorkflowPatterns() {
  const res = await fetch(`${API_BASE}/api/ai-workflow/patterns`);
  return safeJson(res);
}

/**
 * Get all available node types organized by category
 * @returns {Promise<{success: boolean, categories: object}>}
 */
export async function getAINodeTypes() {
  const res = await fetch(`${API_BASE}/api/ai-workflow/nodes`);
  return safeJson(res);
}
