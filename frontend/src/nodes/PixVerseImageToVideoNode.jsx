import createVideoGeneratorNode from './createVideoGeneratorNode';
import { pixVerseVideoGenerate, pollPixVerseVideoStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const MODELS = [
  { value: 'v5.5', label: 'v5.5' },
  { value: 'v5.6', label: 'v5.6' },
  { value: 'v6', label: 'v6' },
  { value: 'c1', label: 'C1' },
];

const QUALITY = [
  { value: '540p', label: '540p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
];

const MOTION_MODES = [
  { value: 'none', label: 'None' },
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
];

export default createVideoGeneratorNode({
  displayName: 'PixVerse Image-to-Video',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    const { image, ...rest } = params;

    if (!image) {
      return { error: { message: 'Image is required for image-to-video' } };
    }

    rest.image = await compressImageBase64(image);
    return pixVerseVideoGenerate('image', rest);
  },
  apiPollerFn: async (videoId, params, maxAttempts, intervalMs, onProgress) => {
    return pollPixVerseVideoStatus(videoId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [
    { id: 'image-in', label: 'Image (Required)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'model', type: 'pills', label: 'Model', options: MODELS, defaultValue: 'v5.6', paramName: 'model' },
    { key: 'quality', type: 'pills', label: 'Quality', options: QUALITY, defaultValue: '720p', paramName: 'quality' },
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: ASPECT_RATIOS, defaultValue: '16:9', paramName: 'aspect_ratio' },
    { key: 'duration', type: 'slider', label: 'Duration (seconds)', defaultValue: 5, paramName: 'duration', min: 1, max: 10, step: 1, unit: 's' },
    { key: 'motionMode', type: 'pills', label: 'Motion Mode', options: MOTION_MODES, defaultValue: 'medium', paramName: 'motion_mode' },
    { key: 'enableSound', type: 'toggle', label: 'Add Sound Effects', defaultValue: false, paramName: 'sound_effect_switch' },
    { key: 'soundContent', type: 'number', label: 'Sound Description', placeholder: 'Optional sound effect description', paramName: 'sound_effect_content' }
  ]
});
