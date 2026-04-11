import createVideoGeneratorNode from './createVideoGeneratorNode';
import { runwayGen4TurboGenerate, pollRunwayGen4TurboStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
];

const RATIOS = [
  { value: '1280:720', label: '16:9' },
  { value: '720:1280', label: '9:16' },
  { value: '1104:832', label: '4:3' },
  { value: '832:1104', label: '3:4' },
  { value: '960:960', label: '1:1' },
  { value: '1584:672', label: '21:9' },
];

export default createVideoGeneratorNode({
  displayName: 'Runway Gen4 Turbo',
  promptOptional: true, // Prompt is optional for Gen4 Turbo since image is required
  apiGeneratorFn: async (params) => {
    const { image, ...rest } = params;
    
    if (!image) {
      return { error: { message: 'Image is required for Runway Gen4 Turbo' } };
    }
    
    rest.image = await compressImageBase64(image);
    
    // Seed and watermark are handled correctly if passed
    if (rest.seed === -1) {
      delete rest.seed;
    }

    return runwayGen4TurboGenerate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollRunwayGen4TurboStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Image (Required)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '1280:720', paramName: 'ratio' },
    { key: 'duration', type: 'pills', label: 'Duration (seconds)', options: DURATIONS, defaultValue: 5, paramName: 'duration' },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ]
});
