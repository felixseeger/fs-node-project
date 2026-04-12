import createVideoGeneratorNode from './createVideoGeneratorNode';
import { klingO1Generate, pollKlingO1Status } from '../utils/api';
import { compressImageBase64, alignImageToMatch } from '../utils/imageUtils';

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
];

export default createVideoGeneratorNode({
  displayName: 'Kling O1',
  promptOptional: true, // Prompt is optional if images are provided
  apiGeneratorFn: async (params) => {
    let { model, first_frame, last_frame, ...rest } = params;

    if (!first_frame && !last_frame) {
      return { error: { message: 'Kling O1 requires at least a first or last frame.' } };
    }

    // Backend Alignment for in-out frames
    if (first_frame && last_frame) {
      last_frame = await alignImageToMatch(first_frame, last_frame);
    }

    if (first_frame) {
      rest.first_frame = await compressImageBase64(first_frame);
    }
    if (last_frame) {
      rest.last_frame = await compressImageBase64(last_frame);
    }

    return klingO1Generate(model || 'std', rest);
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
    { key: 'model', type: 'pills', label: 'Model Tier', options: MODELS, defaultValue: 'std', paramName: 'model' },
    { key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', options: ASPECT_RATIOS, defaultValue: '16:9', paramName: 'aspect_ratio' },
    { key: 'duration', type: 'slider', label: 'Duration (seconds)', defaultValue: 5, paramName: 'duration', min: 3, max: 15, step: 1, unit: 's' }
  ]
});
