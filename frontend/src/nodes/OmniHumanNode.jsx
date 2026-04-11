import createVideoGeneratorNode from './createVideoGeneratorNode';
import { omniHumanGenerate, pollOmniHumanStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

export default createVideoGeneratorNode({
  displayName: 'OmniHuman',
  promptOptional: true, // Prompt is optional in OmniHuman (uses audio + image)
  apiGeneratorFn: async (params) => {
    const { image, audio, ...rest } = params;

    if (!image || !audio) {
      return { error: { message: 'Both an image and an audio track are required for OmniHuman' } };
    }

    rest.image_url = await compressImageBase64(image);
    rest.audio_url = audio;

    return omniHumanGenerate(rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollOmniHumanStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Human Image (Required)', paramName: 'image' },
  ],
  audioInputs: [
    { id: 'audio-text-in', label: 'Audio Track (Required)', paramName: 'audio' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'turboMode', type: 'toggle', label: 'Turbo Mode', defaultValue: true, paramName: 'turbo_mode' }
  ]
});
