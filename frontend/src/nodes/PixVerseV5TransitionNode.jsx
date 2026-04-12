import createVideoGeneratorNode from './createVideoGeneratorNode';
import { pixVerseV5TransitionGenerate, pollPixVerseV5TransitionStatus } from '../utils/api';
import { compressImageBase64, alignImageToMatch } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '360p', label: '360p' },
  { value: '540p', label: '540p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 8, label: '8s' },
];

export default createVideoGeneratorNode({
  displayName: 'PixVerse V5 Transition',
  apiGeneratorFn: async (params) => {
    let { first_image_url, last_image_url, ...rest } = params;
    
    if (!first_image_url || !last_image_url) {
      return { error: { message: 'Both start and end frames are required' } };
    }
    
    // Backend Alignment for in-out frames
    last_image_url = await alignImageToMatch(first_image_url, last_image_url);

    rest.first_image_url = await compressImageBase64(first_image_url);
    rest.last_image_url = await compressImageBase64(last_image_url);
    
    return pixVerseV5TransitionGenerate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollPixVerseV5TransitionStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'start-image-in', label: 'First Frame (Required)', paramName: 'first_image_url' },
    { id: 'end-image-in', label: 'Last Frame (Required)', paramName: 'last_image_url' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'duration', type: 'pills', label: 'Duration (seconds)', options: DURATIONS, defaultValue: 5, paramName: 'duration' }
  ],
  secondaryOutput: { id: 'prompt-out', label: 'prompt' }
});
