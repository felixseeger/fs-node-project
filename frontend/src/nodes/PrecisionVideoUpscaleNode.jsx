import createVideoGeneratorNode from './createVideoGeneratorNode';
import { precisionVideoUpscaleGenerate, pollPrecisionVideoUpscaleStatus } from '../utils/api';

const RESOLUTIONS = [
  { value: '1k', label: '1K' },
  { value: '2k', label: '2K' },
  { value: '4k', label: '4K' },
];

export default createVideoGeneratorNode({
  displayName: 'Precision Video Upscaler',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    const { video, resolution, strength, sharpen, smart_grain, fps_boost, prompt } = params;

    if (!video) {
      return { error: { message: 'Input video is required' } };
    }

    const payload = {
      video_url: video,
      resolution,
      strength,
      sharpen,
      smart_grain,
      fps_boost,
    };

    if (prompt) {
      payload.prompt = prompt;
    }

    return precisionVideoUpscaleGenerate(payload);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollPrecisionVideoUpscaleStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  videoInputs: [
    { id: 'video-in', label: 'Input Video (Required)', paramName: 'video' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '2k', paramName: 'resolution' },
    { key: 'strength', type: 'slider', label: 'Upscale Strength', defaultValue: 60, paramName: 'strength', min: 1, max: 100, step: 1 },
    { key: 'sharpen', type: 'slider', label: 'Sharpening', defaultValue: 0, paramName: 'sharpen', min: 0, max: 100, step: 1 },
    { key: 'smartGrain', type: 'slider', label: 'Smart Grain', defaultValue: 0, paramName: 'smart_grain', min: 0, max: 100, step: 1 },
    { key: 'fpsBoost', type: 'toggle', label: 'Enable FPS Boost (Smooth Motion)', defaultValue: false, paramName: 'fps_boost' },
  ]
});
