/**
 * "All nodes" dropdown in CanvasRunToolbar: reference order + sections, then remaining registered types.
 */
import { getNodeDefaults } from './nodeMenu';

export type CanvasAllNodeRow = {
  /** Stable React key */
  key: string;
  type: string;
  label: string;
  dataPatch?: Record<string, unknown>;
};

export type CanvasAllNodeSection = {
  title: string | null;
  rows: CanvasAllNodeRow[];
};

/** Reference layout (screenshots): section order and labels; types map to real node keys. */
const REFERENCE_SECTIONS: CanvasAllNodeSection[] = [
  {
    title: 'INPUT',
    rows: [
      { key: 'imageNode', type: 'imageNode', label: 'Image Input', dataPatch: { label: 'Image Input' } },
      { key: 'sourceMedia-audio', type: 'sourceMediaNode', label: 'Audio Input', dataPatch: { label: 'Audio Input' } },
      { key: 'sourceMedia-video', type: 'sourceMediaNode', label: 'Video Input', dataPatch: { label: 'Video Input' } },
      { key: 'quiverImageToVector', type: 'quiverImageToVector', label: '3D Viewer', dataPatch: { label: '3D Viewer' } },
    ],
  },
  {
    title: 'TEXT & LLM',
    rows: [
      { key: 'textNode', type: 'textNode', label: 'Prompt', dataPatch: { label: 'Prompt' } },
      { key: 'textLLM', type: 'textLLM', label: 'Claude Sonnet 4', dataPatch: { label: 'Claude Sonnet 4' } },
      { key: 'improvePrompt', type: 'improvePrompt', label: 'Prompt Constructor', dataPatch: { label: 'Prompt Constructor' } },
      { key: 'assetNode', type: 'assetNode', label: 'Array', dataPatch: { label: 'Array' } },
    ],
  },
  {
    title: 'GENERATE',
    rows: [
      { key: 'simplifiedGenerator', type: 'simplifiedGenerator', label: 'Nano Banana 2 Pro', dataPatch: { label: 'Nano Banana 2 Pro' } },
      { key: 'universalGeneratorImage', type: 'universalGeneratorImage', label: 'Generate Image', dataPatch: { label: 'Generate Image' } },
      { key: 'universalGeneratorVideo', type: 'universalGeneratorVideo', label: 'Generate Video', dataPatch: { label: 'Generate Video' } },
      { key: 'tripo3d', type: 'tripo3d', label: 'Generate 3D', dataPatch: { label: 'Generate 3D' } },
    ],
  },
  {
    title: null,
    rows: [
      { key: 'musicGeneration', type: 'musicGeneration', label: 'Generate Audio', dataPatch: { label: 'Generate Audio' } },
      { key: 'generator', type: 'generator', label: 'LLM Generate', dataPatch: { label: 'LLM Generate' } },
    ],
  },
  {
    title: 'PROCESS',
    rows: [
      { key: 'comment', type: 'comment', label: 'Annotate', dataPatch: { label: 'Annotate' } },
      { key: 'groupEditing', type: 'groupEditing', label: 'Split Grid', dataPatch: { label: 'Split Grid' } },
      { key: 'pixVerseV5Transition', type: 'pixVerseV5Transition', label: 'Video Stitch', dataPatch: { label: 'Video Stitch' } },
      { key: 'videoImprove', type: 'videoImprove', label: 'Video Trim', dataPatch: { label: 'Video Trim' } },
      { key: 'vfx', type: 'vfx', label: 'Ease Curve', dataPatch: { label: 'Ease Curve' } },
      { key: 'imageToPrompt', type: 'imageToPrompt', label: 'Frame Grab', dataPatch: { label: 'Frame Grab' } },
      { key: 'layerEditor', type: 'layerEditor', label: 'Image Compare', dataPatch: { label: 'Image Compare' } },
    ],
  },
  {
    title: 'ROUTE',
    rows: [
      {
        key: 'routerNode-router',
        type: 'routerNode',
        label: 'Router',
        dataPatch: {
          label: 'Router',
          outputs: [
            { id: 'out-1', label: 'Output 1' },
            { id: 'out-2', label: 'Output 2' },
          ],
        },
      },
      {
        key: 'routerNode-switch',
        type: 'routerNode',
        label: 'Switch',
        dataPatch: {
          label: 'Switch',
          outputs: [
            { id: 'out-1', label: 'A' },
            { id: 'out-2', label: 'B' },
          ],
        },
      },
    ],
  },
  {
    title: null,
    rows: [
      {
        key: 'routerNode-conditional',
        type: 'routerNode',
        label: 'Conditional Switch',
        dataPatch: {
          label: 'Conditional Switch',
          outputs: [
            { id: 'out-1', label: 'If true' },
            { id: 'out-2', label: 'If false' },
          ],
        },
      },
    ],
  },
  {
    title: 'OUTPUT',
    rows: [
      { key: 'response', type: 'response', label: 'Output', dataPatch: { label: 'Output' } },
      { key: 'imageOutput', type: 'imageOutput', label: 'Output Gallery', dataPatch: { label: 'Output Gallery' } },
    ],
  },
];

const EXTRA_LABELS: Record<string, string> = {
  inputNode: 'Input',
  workflowTemplate: 'Workflow Template',
  imageAnalyzer: 'Claude Sonnet Vision',
  textLLM: 'Claude Sonnet 4',
  simplifiedGenerator: 'Nano Banana 2 Pro',
  creativeUpscale: 'Creative Upscale',
  precisionUpscale: 'Precision Upscale',
  relight: 'Relight',
  styleTransfer: 'Style Transfer',
  removeBackground: 'Remove Background',
  fluxReimagine: 'Flux Reimagine',
  fluxImageExpand: 'Flux Image Expand',
  seedreamExpand: 'Seedream Expand',
  ideogramExpand: 'Ideogram Expand',
  skinEnhancer: 'Skin Enhancer',
  ideogramInpaint: 'Ideogram Inpaint',
  changeCamera: 'Change Camera',
  kling3: 'Kling 3',
  kling3Omni: 'Kling 3 Omni',
  kling3Motion: 'Kling 3 Motion Control',
  klingElementsPro: 'Kling Elements Pro',
  klingO1: 'Kling O1',
  minimaxLive: 'MiniMax Live',
  wan26: 'WAN 2.6 Video',
  seedance: 'Seedance',
  ltxVideo2Pro: 'LTX Video 2 Pro',
  runwayGen45: 'Runway Gen-4.5',
  runwayGen4Turbo: 'Runway Gen-4 Turbo',
  runwayActTwo: 'Runway Act Two',
  omniHuman: 'OmniHuman',
  creativeVideoUpscale: 'Creative Video Upscale',
  precisionVideoUpscale: 'Precision Video Upscale',
  textToIcon: 'Text to Icon',
  aiImageClassifier: 'AI Image Classifier',
  soundEffects: 'Sound Effects',
  audioIsolation: 'Audio Isolation',
  voiceover: 'Voiceover',
  adaptedPrompt: 'Adapted Prompt',
  facialEditing: 'Facial Editing',
  textElement: 'Text Element',
  videoOutput: 'Video Output',
  soundOutput: 'Sound Output',
};

function typeToLabel(type: string): string {
  if (EXTRA_LABELS[type]) return EXTRA_LABELS[type];
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** Optional grouping for remaining node types (stable order). */
const APPENDIX_GROUPS: { title: string; types: string[] }[] = [
  {
    title: 'INPUT & WORKFLOW',
    types: ['inputNode', 'workflowTemplate', 'textElement'],
  },
  {
    title: 'VISION & TEXT',
    types: ['imageAnalyzer', 'aiImageClassifier', 'adaptedPrompt'],
  },
  {
    title: 'IMAGE EDITING',
    types: [
      'creativeUpscale',
      'precisionUpscale',
      'relight',
      'styleTransfer',
      'removeBackground',
      'fluxReimagine',
      'fluxImageExpand',
      'seedreamExpand',
      'ideogramExpand',
      'skinEnhancer',
      'ideogramInpaint',
      'changeCamera',
      'facialEditing',
      'textToIcon',
    ],
  },
  {
    title: 'VIDEO GENERATION',
    types: [
      'kling3',
      'kling3Omni',
      'kling3Motion',
      'klingElementsPro',
      'klingO1',
      'minimaxLive',
      'wan26',
      'seedance',
      'ltxVideo2Pro',
      'runwayGen45',
      'runwayGen4Turbo',
      'runwayActTwo',
      'omniHuman',
    ],
  },
  {
    title: 'VIDEO EDITING',
    types: ['creativeVideoUpscale', 'precisionVideoUpscale'],
  },
  {
    title: 'AUDIO',
    types: ['soundEffects', 'audioIsolation', 'voiceover'],
  },
  {
    title: 'OUTPUT',
    types: ['videoOutput', 'soundOutput'],
  },
];

/**
 * Merge NODE_MENU defaults, response special-case, and optional row patch (e.g. label).
 */
export function resolveCanvasNodeData(
  type: string,
  dataPatch?: Record<string, unknown>
): Record<string, unknown> {
  const fromMenu = getNodeDefaults(type);
  let base: Record<string, unknown>;
  if (fromMenu) {
    base = { ...fromMenu };
  } else if (type === 'response') {
    base = { label: 'Response · Output', responseFields: [] };
  } else if (type === 'imageOutput' || type === 'videoOutput' || type === 'soundOutput') {
    base = { label: typeToLabel(type) };
  } else if (type === 'workflowTemplate') {
    base = { label: 'Workflow Template', templateId: '', templateData: null };
  } else if (type === 'inputNode') {
    base = { label: 'Input' };
  } else if (type === 'textElement') {
    base = { label: 'Text', content: '' };
  } else {
    base = { label: typeToLabel(type) };
  }
  if (dataPatch && Object.keys(dataPatch).length) {
    return { ...base, ...dataPatch };
  }
  return base;
}

/**
 * Full menu: reference sections (filtered to registered types), then appendix groups.
 */
export function buildCanvasAllNodesSections(registeredTypes: string[]): CanvasAllNodeSection[] {
  const reg = new Set(registeredTypes);
  const skipInputDup = reg.has('inputNode') && reg.has('input');

  const out: CanvasAllNodeSection[] = [];

  for (const sec of REFERENCE_SECTIONS) {
    const rows = sec.rows.filter((r) => reg.has(r.type));
    if (rows.length === 0) continue;
    out.push({ title: sec.title, rows });
  }

  const placed = new Set<string>();
  for (const sec of REFERENCE_SECTIONS) {
    for (const r of sec.rows) {
      if (reg.has(r.type)) placed.add(r.type);
    }
  }

  const remaining = registeredTypes.filter((t) => {
    if (skipInputDup && t === 'input') return false;
    return !placed.has(t);
  });

  if (remaining.length === 0) return out;

  const remainingSet = new Set(remaining);
  const usedAppendix = new Set<string>();

  for (const group of APPENDIX_GROUPS) {
    const rows: CanvasAllNodeRow[] = [];
    for (const type of group.types) {
      if (!remainingSet.has(type)) continue;
      usedAppendix.add(type);
      rows.push({
        key: type,
        type,
        label: typeToLabel(type),
      });
    }
    if (rows.length) out.push({ title: group.title, rows });
  }

  const leftovers = remaining.filter((t) => !usedAppendix.has(t)).sort((a, b) => a.localeCompare(b));
  if (leftovers.length) {
    out.push({
      title: 'OTHER',
      rows: leftovers.map((type) => ({
        key: type,
        type,
        label: typeToLabel(type),
      })),
    });
  }

  return out;
}
