import createVideoGeneratorNode from './createVideoGeneratorNode';
import { wan26Generate, pollWan26Status } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const DURATIONS = [
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
  { value: '15', label: '15s' },
];

const RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const SHOT_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'multi', label: 'Multi' },
];

const SIZE_MAP = {
  '720p': {
    '16:9': '1280*720',
    '9:16': '720*1280',
    '1:1': '960*960',
    '4:3': '1088*832',
    '3:4': '832*1088',
  },
  '1080p': {
    '16:9': '1920*1080',
    '9:16': '1080*1920',
    '1:1': '1440*1440',
    '4:3': '1632*1248',
    '3:4': '1248*1632',
  }
};

export default createVideoGeneratorNode({
  displayName: 'WAN 2.6 Video',
  apiGeneratorFn: async (params) => {
    const { resolution, ratio, image, ...rest } = params;
    const mode = image ? 'image-to-video' : 'text-to-video';
    const size = SIZE_MAP[resolution][ratio];
    
    rest.size = size;
    
    if (image) {
      rest.image = await compressImageBase64(image);
    }
    
    return wan26Generate(mode, resolution, rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    const mode = params.image ? 'image-to-video' : 'text-to-video';
    return pollWan26Status(mode, params.resolution, taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [
    { id: 'image-in', label: 'Image (Optional)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '720p', paramName: 'resolution' },
    { key: 'duration', type: 'pills', label: 'Duration', options: DURATIONS, defaultValue: '5', paramName: 'duration' },
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '16:9', paramName: 'ratio' },
    { key: 'shotType', type: 'pills', label: 'Shot Type', options: SHOT_TYPES, defaultValue: 'single', paramName: 'shot_type' },
    { key: 'promptExpansion', type: 'toggle', label: 'Prompt Expansion', defaultValue: false, paramName: 'enable_prompt_expansion' },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ]
});
