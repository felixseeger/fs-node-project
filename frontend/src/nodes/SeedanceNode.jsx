import createVideoGeneratorNode from './createVideoGeneratorNode';
import { seedanceGenerate, pollSeedanceStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Seedance 1.5 Pro',
  apiGeneratorFn: async (params) => {
    if (params.image) params.image = await compressImageBase64(params.image);
    return seedanceGenerate(params.resolution || '720p', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollSeedanceStatus(params.resolution || '720p', taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: false,
  imageInputs: [{ id: 'image-in', label: 'Image (Optional)', paramName: 'image' }],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: [{ value: '720p', label: '720p' }, { value: '1080p', label: '1080p' }], defaultValue: '720p', paramName: 'resolution' }
  ]
});
