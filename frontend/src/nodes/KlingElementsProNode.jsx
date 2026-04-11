import createVideoGeneratorNode from './createVideoGeneratorNode';
import { klingElementsProGenerate, pollKlingElementsProStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const DURATIONS = [
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
];

const ASPECT_RATIOS = [
  { value: 'widescreen_16_9', label: '16:9' },
  { value: 'social_story_9_16', label: '9:16' },
  { value: 'square_1_1', label: '1:1' },
];

export default createVideoGeneratorNode({
  displayName: 'Kling Elements Pro',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    const { images, ...rest } = params;
    
    if (!images || !images.length) {
      return { error: { message: 'At least one image is required for Kling Elements Pro' } };
    }
    
    const compressedImages = await Promise.all(
      images.slice(0, 4).map(img => compressImageBase64(img))
    );
    
    rest.images = compressedImages;
    return klingElementsProGenerate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKlingElementsProStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'images-in', label: 'Images (1 to 4)', paramName: 'images', isArray: true },
  ],
  settingsControls: [
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: ASPECT_RATIOS, defaultValue: 'widescreen_16_9', paramName: 'aspect_ratio' },
    { key: 'duration', type: 'pills', label: 'Duration (seconds)', options: DURATIONS, defaultValue: '5', paramName: 'duration' }
  ]
});
