import createVideoGeneratorNode from './createVideoGeneratorNode';
import { pixVerseV5TransitionGenerate, pollPixVerseV5TransitionStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'PixVerse V5 Transition',
  apiGeneratorFn: async (params) => {
    if (params.first_image_url) params.first_image_url = await compressImageBase64(params.first_image_url);
    if (params.last_image_url) params.last_image_url = await compressImageBase64(params.last_image_url);
    return pixVerseV5TransitionGenerate(params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollPixVerseV5TransitionStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'start-image-in', label: 'First Frame', paramName: 'first_image_url' },
    { id: 'end-image-in', label: 'Last Frame', paramName: 'last_image_url' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: [{ value: '720p', label: '720p' }, { value: '1080p', label: '1080p' }], defaultValue: '720p', paramName: 'resolution' }
  ]
});
