import createVideoGeneratorNode from './createVideoGeneratorNode';
import { runwayGen45Generate, pollRunwayGen45Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 8, label: '8s' },
  { value: 10, label: '10s' },
];

const RATIOS = [
  { value: '1280:720', label: '16:9' },
  { value: '720:1280', label: '9:16' },
  { value: '1104:832', label: '4:3' },
  { value: '960:960', label: '1:1' },
  { value: '832:1104', label: '3:4' },
];

export default createVideoGeneratorNode({
  displayName: 'Runway Gen 4.5',
  apiGeneratorFn: async (params) => {
    const { image, ...rest } = params;
    const mode = image ? 'image-to-video' : 'text-to-video';
    
    if (image) {
      rest.image = await compressImageBase64(image);
      // Ensure seed is set correctly for I2V if it's not -1
      if (rest.seed !== undefined && rest.seed !== -1) {
        // Keep seed
      } else {
        delete rest.seed;
      }
    } else {
      // T2V doesn't support seed in this API
      delete rest.seed;
    }
    
    return runwayGen45Generate(mode, rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    const mode = params.image ? 'image-to-video' : 'text-to-video';
    return pollRunwayGen45Status(mode, taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Image (Optional)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '1280:720', paramName: 'ratio' },
    { key: 'duration', type: 'pills', label: 'Duration (seconds)', options: DURATIONS, defaultValue: 5, paramName: 'duration' },
    { key: 'seed', type: 'number', label: 'Seed (I2V only)', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ]
});
