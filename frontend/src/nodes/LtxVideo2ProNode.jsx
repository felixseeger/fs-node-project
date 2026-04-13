import createVideoGeneratorNode from './createVideoGeneratorNode';
import { ltxVideo2ProGenerate, pollLtxVideo2ProStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'LTX Video 2.0 Pro',
  apiGeneratorFn: async (params) => {
    if (params.image) params.image = await compressImageBase64(params.image);
    return ltxVideo2ProGenerate(params.image ? 'image-to-video' : 'text-to-video', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollLtxVideo2ProStatus(params.image ? 'image-to-video' : 'text-to-video', taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [{ id: 'image-in', label: 'Image (Optional)', paramName: 'image' }],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: [{ value: '1080p', label: '1080p' }, { value: '4k', label: '4K' }], defaultValue: '1080p', paramName: 'resolution' }
  ]
});
