import createVideoGeneratorNode from './createVideoGeneratorNode';
import { wan26Generate, pollWan26Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'WAN 2.6 Video',
  apiGeneratorFn: async (params) => {
    if (params.image) params.image = await compressImageBase64(params.image);
    return wan26Generate(params.image ? 'image-to-video' : 'text-to-video', params.resolution || '720p', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollWan26Status(params.image ? 'image-to-video' : 'text-to-video', params.resolution || '720p', taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [{ id: 'image-in', label: 'Image (Optional)', paramName: 'image' }],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: [{ value: '720p', label: '720p' }, { value: '1080p', label: '1080p' }], defaultValue: '720p', paramName: 'resolution' }
  ]
});
