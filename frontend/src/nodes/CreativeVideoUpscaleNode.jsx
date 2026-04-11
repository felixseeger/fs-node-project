import createVideoGeneratorNode from './createVideoGeneratorNode';
import { videoUpscaleGenerate, pollVideoUpscaleStatus } from '../utils/api';

const RESOLUTIONS = [
  { value: '1k', label: '1K' },
  { value: '2k', label: '2K' },
  { value: '4k', label: '4K' },
];

const FLAVORS = [
  { value: 'vivid', label: 'Vivid' },
  { value: 'natural', label: 'Natural' },
];

export default createVideoGeneratorNode({
  displayName: 'Creative Video Upscaler',
  promptOptional: true,
  hidePrompt: true,
  apiGeneratorFn: async (params) => {
    const { video, resolution, flavor, creativity, sharpen, smart_grain, fps_boost } = params;

    if (!video) {
      return { error: { message: 'Input video is required' } };
    }

    const payload = {
      video,
      resolution,
      flavor,
      creativity,
      sharpen,
      smart_grain,
      fps_boost,
    };

    return videoUpscaleGenerate('standard', payload);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollVideoUpscaleStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  videoInputs: [
    { id: 'video-in', label: 'Input Video (Required)', paramName: 'video' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '2k', paramName: 'resolution' },
    { key: 'flavor', type: 'pills', label: 'Flavor', options: FLAVORS, defaultValue: 'vivid', paramName: 'flavor' },
    { key: 'creativity', type: 'slider', label: 'Creativity', defaultValue: 0, paramName: 'creativity', min: 0, max: 100, step: 1 },
    { key: 'sharpen', type: 'slider', label: 'Sharpening', defaultValue: 0, paramName: 'sharpen', min: 0, max: 100, step: 1 },
    { key: 'smartGrain', type: 'slider', label: 'Smart Grain', defaultValue: 0, paramName: 'smart_grain', min: 0, max: 100, step: 1 },
    { key: 'fpsBoost', type: 'toggle', label: 'Enable FPS Boost (Smooth Motion)', defaultValue: false, paramName: 'fps_boost' },
  ]
});
