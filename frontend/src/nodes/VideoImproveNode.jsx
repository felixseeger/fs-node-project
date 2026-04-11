import createVideoGeneratorNode from './createVideoGeneratorNode';
import { videoImproveGenerate, pollVideoImproveStatus } from '../utils/api';

const BASE_MODELS = [
    { value: 'self_forcing', label: 'Self-Forcing (Wan)' },
    { value: 'causal_forcing', label: 'Causal Forcing (Wan)' },
    { value: 'longlive', label: 'LongLive (Wan)' },
    { value: 'krea14b', label: 'Krea 14B' },
];

const REWARD_MODELS = [
    { value: 'hpsv3', label: 'HPSv3 (Aesthetics)' },
    { value: 'videoalign_vq', label: 'VideoAlign VQ (Fidelity)' },
    { value: 'videoalign_mq', label: 'VideoAlign MQ (Motion)' },
    { value: 'videoalign_ta', label: 'VideoAlign TA (Alignment)' },
    { value: 'multi_reward', label: 'Multi-Reward (All)' },
];

const NUM_FRAMES_OPTIONS = [
    { value: 81, label: 'Short (81)' },
    { value: 240, label: 'Standard (240)' },
    { value: 480, label: 'Long (480)' },
];

export default createVideoGeneratorNode({
  displayName: 'Astrolabe Video Improve',
  promptOptional: false,
  apiGeneratorFn: async (params) => {
    return videoImproveGenerate(params);
  },
  apiPollerFn: async (taskId, params, maxAttempts, intervalMs, onProgress) => {
    return pollVideoImproveStatus(taskId, maxAttempts, intervalMs);
  },
  supportsNegativePrompt: false,
  settingsControls: [
    { key: 'baseModel', type: 'select', label: 'Base Video Model', options: BASE_MODELS, defaultValue: 'self_forcing', paramName: 'base_model' },
    { key: 'rewardModel', type: 'select', label: 'Reward Model (Improvement Goal)', options: REWARD_MODELS, defaultValue: 'hpsv3', paramName: 'reward_model' },
    { key: 'numFrames', type: 'pills', label: 'Number of Frames', options: NUM_FRAMES_OPTIONS, defaultValue: 240, paramName: 'num_frames' }
  ]
});
