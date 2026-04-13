import createVideoGeneratorNode from './createVideoGeneratorNode';
import { klingO1Generate, pollKlingO1Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Kling O1',
  promptOptional: true,
  apiGeneratorFn: async (params) => {
    if (params.first_frame) params.first_frame = await compressImageBase64(params.first_frame);
    if (params.last_frame) params.last_frame = await compressImageBase64(params.last_frame);
    return klingO1Generate(params.model || 'std', params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollKlingO1Status(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'start-image-in', label: 'First Frame (Optional)', paramName: 'first_frame' },
    { id: 'end-image-in', label: 'Last Frame (Optional)', paramName: 'last_frame' },
  ],
  settingsControls: [
    { key: 'model', type: 'pills', label: 'Model Tier', options: [{ value: 'std', label: 'Standard' }, { value: 'pro', label: 'Pro' }], defaultValue: 'std', paramName: 'model' },
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }], defaultValue: '16:9', paramName: 'aspect_ratio' }
  ]
});
