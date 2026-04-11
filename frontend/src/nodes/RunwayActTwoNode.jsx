import createVideoGeneratorNode from './createVideoGeneratorNode';
import { runwayActTwoGenerate, pollRunwayActTwoStatus } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';

const RATIOS = [
  { value: '1280:720', label: '16:9' },
  { value: '720:1280', label: '9:16' },
  { value: '1104:832', label: '4:3' },
  { value: '832:1104', label: '3:4' },
  { value: '960:960', label: '1:1' },
  { value: '1584:672', label: '21:9' },
];

export default createVideoGeneratorNode({
  displayName: 'Runway Act-One',
  promptOptional: true, // Prompt is purely optional in Act-One
  apiGeneratorFn: async (params) => {
    const { character, reference, ratio, bodyControl, expressionIntensity, seed } = params;

    if (!character || !reference) {
      return { error: { message: 'Both Character Image and Reference Video are required' } };
    }

    const isVideo = character.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i);
    let characterUri = character;
    if (!isVideo) {
      characterUri = await compressImageBase64(character);
    }

    const payload = {
      character: { type: isVideo ? 'video' : 'image', uri: characterUri },
      reference: { type: 'video', uri: reference },
      ratio,
      body_control: bodyControl,
      expression_intensity: expressionIntensity,
    };

    if (seed && seed !== 0) {
      payload.seed = seed;
    }

    return runwayActTwoGenerate(payload);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollRunwayActTwoStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  imageInputs: [
    { id: 'character-in', label: 'Character Image (Required)', paramName: 'character' },
  ],
  videoInputs: [
    { id: 'reference-in', label: 'Reference Video (Required)', paramName: 'reference' }
  ],
  settingsControls: [
    { key: 'ratio', type: 'pills', label: 'Aspect Ratio', options: RATIOS, defaultValue: '1280:720', paramName: 'ratio' },
    { key: 'expressionIntensity', type: 'slider', label: 'Expression Intensity', defaultValue: 3, paramName: 'expressionIntensity', min: 1, max: 5, step: 1 },
    { key: 'bodyControl', type: 'toggle', label: 'Body Control', defaultValue: true, paramName: 'bodyControl' },
    { key: 'seed', type: 'number', label: 'Seed', placeholder: '0 for random', defaultValue: 0, paramName: 'seed' }
  ]
});
