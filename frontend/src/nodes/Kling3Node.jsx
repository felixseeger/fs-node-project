import createVideoGeneratorNode from './createVideoGeneratorNode';
import { kling3Generate, pollKling3Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

export default createVideoGeneratorNode({
  displayName: 'Kling 3 Video',
  apiGeneratorFn: async (params) => {
    const { model, ...rest } = params;
    
    // Compress images before sending to API
    if (rest.start_image_url) {
      rest.start_image_url = await compressImageBase64(rest.start_image_url);
    }
    if (rest.end_image_url) {
      rest.end_image_url = await compressImageBase64(rest.end_image_url);
    }
    
    // Duration must be a string for this API
    if (rest.duration) {
      rest.duration = rest.duration.toString();
    }
    
    return kling3Generate(model || 'std', rest);
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
    {
      key: 'model', type: 'pills', label: 'Model Tier', defaultValue: 'std', paramName: 'model',
      options: [
        { value: 'std', label: 'Standard' },
        { value: 'pro', label: 'Pro' }
      ]
    },
    {
      key: 'aspectRatio', type: 'pills', label: 'Aspect Ratio', defaultValue: '16:9', paramName: 'aspect_ratio',
      options: [
        { value: '16:9', label: '16:9' },
        { value: '9:16', label: '9:16' },
        { value: '1:1', label: '1:1' }
      ]
    },
    {
      key: 'duration', type: 'slider', label: 'Duration (seconds)', defaultValue: 5, paramName: 'duration',
      min: 3, max: 15, step: 1, unit: 's'
    },
    {
      key: 'cfgScale', type: 'slider', label: 'CFG Scale (Prompt Adherence)', defaultValue: 0.5, paramName: 'cfg_scale',
      min: 0, max: 1, step: 0.05
    },
    {
      key: 'generateAudio', type: 'toggle', label: 'Generate Audio', defaultValue: false, paramName: 'generate_audio'
    }
  ]
});
