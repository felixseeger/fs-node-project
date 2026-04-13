import createVideoGeneratorNode from './createVideoGeneratorNode';
import { klingElementsProGenerate, pollKlingElementsProStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Kling Elements Pro',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    if (params.images?.length) {
      params.images = await Promise.all(params.images.slice(0, 4).map(img => compressImageBase64(img)));
    }
    return klingElementsProGenerate(params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKlingElementsProStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [{ id: 'images-in', label: 'Images (1-4)', paramName: 'images', isArray: true }],
  settingsControls: [
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: [{ value: '1_1', label: '1:1' }, { value: '16_9', label: '16:9' }], defaultValue: '16_9', paramName: 'aspect_ratio' }
  ]
});
