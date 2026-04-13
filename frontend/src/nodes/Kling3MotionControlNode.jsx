import createVideoGeneratorNode from './createVideoGeneratorNode';
import { kling3MotionGenerate, pollKling3MotionStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Kling 3 Motion Control',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    if (params.image_url) params.image_url = await compressImageBase64(params.image_url);
    return kling3MotionGenerate(params.model || 'std', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKling3MotionStatus(params.model || 'std', taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [{ id: 'image-in', label: 'Character Image (Required)', paramName: 'image_url' }],
  videoInputs: [{ id: 'video-in', label: 'Motion Video (Required)', paramName: 'video_url' }],
  settingsControls: [
    { key: 'model', type: 'pills', label: 'Model Tier', options: [{ value: 'std', label: 'Standard' }, { value: 'pro', label: 'Pro' }], defaultValue: 'std', paramName: 'model' },
    { key: 'orientation', type: 'pills', label: 'Orientation', options: [{ value: 'video', label: 'Video' }, { value: 'image', label: 'Image' }], defaultValue: 'video', paramName: 'character_orientation' }
  ]
});
