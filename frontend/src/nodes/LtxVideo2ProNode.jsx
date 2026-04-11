import createVideoGeneratorNode from './createVideoGeneratorNode';
import { ltxVideo2ProGenerate, pollLtxVideo2ProStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RESOLUTIONS = [
  { value: '1080p', label: '1080p' },
  { value: '1440p', label: '1440p' },
  { value: '2160p', label: '4K (2160p)' },
];

const DURATIONS = [
  { value: 6, label: '6s' },
  { value: 8, label: '8s' },
  { value: 10, label: '10s' },
];

const FPS_OPTIONS = [
  { value: 25, label: '25 fps' },
  { value: 50, label: '50 fps' },
];

export default createVideoGeneratorNode({
  displayName: 'LTX Video 2.0 Pro',
  apiGeneratorFn: async (params) => {
    const { image, ...rest } = params;
    const mode = image ? 'image-to-video' : 'text-to-video';
    
    if (image) {
      rest.image_url = await compressImageBase64(image);
    }
    
    return ltxVideo2ProGenerate(mode, rest);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    const mode = params.image ? 'image-to-video' : 'text-to-video';
    return pollLtxVideo2ProStatus(mode, taskId, maxAttempts, intervalMs, onProgress);
  },
  supportsNegativePrompt: true,
  imageInputs: [
    { id: 'image-in', label: 'Image (Optional)', paramName: 'image' },
  ],
  settingsControls: [
    { key: 'resolution', type: 'pills', label: 'Resolution', options: RESOLUTIONS, defaultValue: '1080p', paramName: 'resolution' },
    { key: 'duration', type: 'pills', label: 'Duration (seconds)', options: DURATIONS, defaultValue: 6, paramName: 'duration' },
    { key: 'fps', type: 'pills', label: 'Frames per second', options: FPS_OPTIONS, defaultValue: 25, paramName: 'fps' },
    { key: 'generateAudio', type: 'toggle', label: 'Generate Audio', defaultValue: false, paramName: 'generate_audio' },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '-1 for random', defaultValue: -1, paramName: 'seed' }
  ]
});
