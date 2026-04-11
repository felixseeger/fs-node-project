import createVideoGeneratorNode from './createVideoGeneratorNode';
import { pixVerseV5Generate, pollPixVerseV5Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '360p', label: '360p' },
  { value: '540p', label: '540p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

export default createVideoGeneratorNode({
  displayName: 'PixVerse V5',
  promptOptional: true, // Prompt is optional for PixVerse image-to-video
  apiGeneratorFn: async (params) => {
    const { image, seed, ...rest } = params;
    
    if (!image) {
      return { error: { message: 'Image is required for PixVerse V5' } };
    }
    
    rest.image = await compressImageBase64(image);
    
    if (seed !== -1) {
      rest.seed = seed;
    }
    
    return pixVerseV5Generate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollPixVerseV5Status(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false, // PixVerse doesn't use a negative prompt here
  imageInputs: [
    { id: 'image-in', label: 'Image (Required)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '16:9', paramName: 'aspect_ratio' },
    { key: 'motionIntensity', type: 'slider', label: 'Motion Intensity', defaultValue: 5, paramName: 'motion_intensity', min: 1, max: 10, step: 1 },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ],
  secondaryOutput: { id: 'prompt-out', label: 'prompt' }
});
