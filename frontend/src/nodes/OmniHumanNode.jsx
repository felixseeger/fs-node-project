import createVideoGeneratorNode from './createVideoGeneratorNode';
import { omniHumanGenerate, pollOmniHumanStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'OmniHuman',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    if (params.image) params.image = await compressImageBase64(params.image);
    return omniHumanGenerate(params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollOmniHumanStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [{ id: 'image-in', label: 'Human Image (Required)', paramName: 'image' }],
  audioInputs: [{ id: 'audio-text-in', label: 'Audio Track (Required)', paramName: 'audio' }],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: [{ value: '720p', label: '720p' }, { value: '1080p', label: '1080p' }], defaultValue: '720p', paramName: 'resolution' }
  ]
});
