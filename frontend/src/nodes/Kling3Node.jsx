import createVideoGeneratorNode from './createVideoGeneratorNode';
import { kling3Generate, pollKling3Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Kling 3 Video',
  apiGeneratorFn: async (params) => {
    if (params.start_image_url) params.start_image_url = await compressImageBase64(params.start_image_url);
    if (params.end_image_url) params.end_image_url = await compressImageBase64(params.end_image_url);
    return kling3Generate(params.model || 'std', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKling3Status(taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [
    { id: 'start-image-in', label: 'Start Frame (Optional)', paramName: 'start_image_url' },
    { id: 'end-image-in', label: 'End Frame (Optional)', paramName: 'end_image_url' },
  ],
  settingsControls: [
    { key: 'model', type: 'pills', label: 'Model Tier', defaultValue: 'std', paramName: 'model', options: [{ value: 'std', label: 'Standard' }, { value: 'pro', label: 'Pro' }] },
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', defaultValue: '16:9', paramName: 'aspect_ratio', options: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }] }
  ]
});
