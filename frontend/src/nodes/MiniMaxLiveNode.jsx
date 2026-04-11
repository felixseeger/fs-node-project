import createVideoGeneratorNode from './createVideoGeneratorNode';
import { minimaxLiveGenerate, pollMiniMaxLiveStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
];

const CAMERA_MOVEMENTS = [
  { value: '', label: 'None' },
  { value: '[Static shot]', label: 'Static' },
  { value: '[Truck left]', label: 'Truck Left' },
  { value: '[Truck right]', label: 'Truck Right' },
  { value: '[Pan left]', label: 'Pan Left' },
  { value: '[Pan right]', label: 'Pan Right' },
  { value: '[Push in]', label: 'Push In' },
  { value: '[Pull out]', label: 'Pull Out' },
  { value: '[Pedestal up]', label: 'Pedestal Up' },
  { value: '[Pedestal down]', label: 'Pedestal Down' },
  { value: '[Tilt up]', label: 'Tilt Up' },
  { value: '[Tilt down]', label: 'Tilt Down' },
  { value: '[Zoom in]', label: 'Zoom In' },
  { value: '[Zoom out]', label: 'Zoom Out' },
  { value: '[Shake]', label: 'Shake' },
];

export default createVideoGeneratorNode({
  displayName: 'MiniMax Live',
  apiGeneratorFn: async (params) => {
    const { image, camera_movement, prompt, ...rest } = params;
    
    if (!image) {
      return { error: { message: 'Image is required for MiniMax Live' } };
    }
    
    rest.image_url = await compressImageBase64(image);

    let finalPrompt = prompt || '';
    if (camera_movement && !finalPrompt.includes(camera_movement)) {
      finalPrompt = `${finalPrompt} ${camera_movement}`;
    }
    rest.prompt = finalPrompt;

    return minimaxLiveGenerate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollMiniMaxLiveStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Image (Required)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '16:9', paramName: 'aspect_ratio' },
    { key: 'cameraMovement', type: 'select', label: 'Camera Movement', options: CAMERA_MOVEMENTS, defaultValue: '', paramName: 'camera_movement' },
    { key: 'promptOptimizer', type: 'toggle', label: 'Prompt Optimizer', defaultValue: true, paramName: 'prompt_optimizer' }
  ]
});
