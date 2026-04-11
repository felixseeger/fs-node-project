import createVideoGeneratorNode from './createVideoGeneratorNode';
import { kling3MotionGenerate, pollKling3MotionStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ORIENTATIONS = [
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

export default createVideoGeneratorNode({
  displayName: 'Kling 3 Motion Control',
  promptOptional: true, // Prompt is optional since image & video drive it
  apiGeneratorFn: async (params) => {
    const { model, image_url, video_url, ...rest } = params;

    if (!image_url || !video_url) {
      return { error: { message: 'Both an image and a reference video are required' } };
    }

    rest.image_url = await compressImageBase64(image_url);
    rest.video_url = video_url; // Wait, video isn't compressed

    return kling3MotionGenerate(model || 'std', rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKling3MotionStatus(params.model || 'std', taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'image-in', label: 'Character Image (Required)', paramName: 'image_url' },
  ],
  videoInputs: [
    { id: 'video-in', label: 'Motion Video (Required)', paramName: 'video_url' }
  ],
  settingsControls: [
    { key: 'model', type: 'pills', label: 'Model Tier', options: MODELS, defaultValue: 'std', paramName: 'model' },
    { key: 'orientation', type: 'pills', label: 'Character Orientation', options: ORIENTATIONS, defaultValue: 'video', paramName: 'character_orientation' },
    { key: 'cfgScale', type: 'slider', label: 'CFG Scale', defaultValue: 0.5, paramName: 'cfg_scale', min: 0, max: 1, step: 0.05 }
  ]
});
