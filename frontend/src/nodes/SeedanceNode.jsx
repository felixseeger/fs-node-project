import createVideoGeneratorNode from './createVideoGeneratorNode';
import { seedanceGenerate, pollSeedanceStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const RATIOS = [
  { value: 'widescreen_16_9', label: '16:9' },
  { value: 'social_story_9_16', label: '9:16' },
  { value: 'square_1_1', label: '1:1' },
  { value: 'classic_4_3', label: '4:3' },
  { value: 'traditional_3_4', label: '3:4' },
  { value: 'film_horizontal_21_9', label: '21:9' },
  { value: 'film_vertical_9_21', label: '9:21' },
];

export default createVideoGeneratorNode({
  displayName: 'Seedance 1.5 Pro',
  apiGeneratorFn: async (params) => {
    const { image, resolution, ...rest } = params;
    
    if (image) {
      rest.image_url = await compressImageBase64(image);
    }
    
    if (rest.seed === -1) {
      delete rest.seed;
    }
    
    return seedanceGenerate(resolution || '720p', rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollSeedanceStatus(params.resolution || '720p', taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Image (Optional)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: 'widescreen_16_9', paramName: 'aspect_ratio' },
    { key: 'duration', type: 'slider', label: 'Duration (seconds)', defaultValue: 5, paramName: 'duration', min: 4, max: 12, step: 1, unit: 's' },
    { key: 'generateAudio', type: 'toggle', label: 'Generate Audio', defaultValue: true, paramName: 'generate_audio' },
    { key: 'cameraFixed', type: 'toggle', label: 'Camera Fixed', defaultValue: false, paramName: 'camera_fixed' },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ]
});
