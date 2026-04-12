import { type Node, type Edge } from '@xyflow/react';
import { getHandleDataType } from '../utils/handleTypes';
import { NODE_MENU } from '../config/nodeMenu';

// Basic map of compatible types
const compatibilityMap: Record<string, string[]> = {
  image: ['image', 'any'],
  video: ['video', 'any'],
  audio: ['audio', 'any'],
  text: ['text', 'any', 'prompt'],
  any: ['image', 'video', 'audio', 'text', 'any', 'prompt'],
  prompt: ['prompt', 'text', 'any']
};

/**
 * Heuristic mapping of node types to their likely input/output handles
 * This complements what's defined in the UI components
 */
const nodeTypeHandleHeuristics: Record<string, { inputs: string[], outputs: string[] }> = {
  textNode: { inputs: [], outputs: ['text'] },
  imageNode: { inputs: [], outputs: ['image'] },
  generator: { inputs: ['text', 'image'], outputs: ['image'] },
  universalGeneratorImage: { inputs: ['inputPrompt'], outputs: ['outputImage'] },
  universalGeneratorVideo: { inputs: ['inputPrompt'], outputs: ['outputVideo'] },
  vfx: { inputs: ['video-in'], outputs: ['outputVideo'] },
  creativeVideoUpscale: { inputs: ['video-in'], outputs: ['outputVideo'] },
  precisionVideoUpscale: { inputs: ['video-in'], outputs: ['outputVideo'] },
  musicGeneration: { inputs: ['inputPrompt'], outputs: ['outputAudio'] },
  soundEffects: { inputs: ['inputPrompt'], outputs: ['outputAudio'] },
  voiceover: { inputs: ['inputPrompt'], outputs: ['outputAudio'] },
  imageAnalyzer: { inputs: ['localImages'], outputs: ['analysisResult'] },
  imageToPrompt: { inputs: ['inputImagePreview'], outputs: ['outputPrompt'] },
  improvePrompt: { inputs: ['inputPrompt'], outputs: ['outputPrompt'] },
  aiImageClassifier: { inputs: ['inputImagePreview'], outputs: ['outputText'] },
  response: { inputs: ['image', 'text', 'video', 'audio'], outputs: [] },
  router: { inputs: ['any'], outputs: ['any'] },
};

export class SmartConnectorEngine {
  /**
   * Evaluates compatibility between a source handle type and a target handle type.
   */
  static isCompatible(sourceType: string, targetType: string): boolean {
    const sType = sourceType.toLowerCase();
    const tType = targetType.toLowerCase();
    
    if (sType === tType) return true;
    
    return compatibilityMap[sType]?.includes(tType) || false;
  }

  /**
   * Recommends target nodes and handles for a given source node and handle.
   */
  static getSuggestions(
    sourceNodeId: string,
    sourceHandleId: string,
    nodes: Node[],
    edges: Edge[]
  ) {
    const suggestions: Array<{ node: Node; handleId: string; score: number }> = [];
    const srcType = getHandleDataType(sourceHandleId);

    // Heuristic: identify the intent based on source node type
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const sourceCategory = this.getNodeCategory(sourceNode?.type || '');

    nodes.forEach(node => {
      // Don't suggest connecting to self
      if (node.id === sourceNodeId) return;

      const targetType = node.type || '';
      const targetCategory = this.getNodeCategory(targetType);
      
      // Get possible input handles for this node type
      const possibleInputs = this.getPossibleInputs(node);
      
      possibleInputs.forEach(inputHandleId => {
        const inputDataType = getHandleDataType(inputHandleId);
        
        if (this.isCompatible(srcType, inputDataType)) {
          let score = 70; // Base score for compatible types
          
          // Semantic intent bonus: Inputs -> LLMs -> Generation -> Editing -> Outputs
          if (sourceCategory === 'Inputs' && targetCategory === 'LLMs') score += 15;
          if (sourceCategory === 'Inputs' && targetCategory.includes('Generation')) score += 10;
          if (targetCategory === 'Outputs' || targetType === 'response') score += 5;
          if (sourceCategory.includes('Generation') && targetCategory.includes('Editing')) score += 15;
          
          // Penalize if already connected
          const isAlreadyConnected = edges.some(
            e => e.source === sourceNodeId && e.sourceHandle === sourceHandleId && 
                 e.target === node.id && e.targetHandle === inputHandleId
          );
          if (isAlreadyConnected) score -= 40;
          
          suggestions.push({
            node,
            handleId: inputHandleId,
            score: Math.min(score, 100)
          });
        }
      });
    });

    return suggestions.sort((a, b) => b.score - a.score);
  }

  private static getNodeCategory(type: string): string {
    for (const section of NODE_MENU) {
      if (section.items.some(i => i.type === type)) return section.section;
    }
    return 'Other';
  }

  private static getPossibleInputs(node: Node): string[] {
    const type = node.type || '';
    const heuristic = nodeTypeHandleHeuristics[type];
    if (heuristic) return heuristic.inputs;

    // Fallback: look at data.inputs if it exists
    const data = node.data as any;
    if (Array.isArray(data?.inputs)) {
      return data.inputs.map((i: any) => i.id || i.name);
    }

    // Generic fallback based on common patterns
    if (type.includes('Image')) return ['image', 'image-in', 'inputImage'];
    if (type.includes('Video')) return ['video', 'video-in', 'inputVideo'];
    if (type.includes('Audio')) return ['audio', 'audio-in', 'inputAudio'];
    if (type.includes('Prompt') || type.includes('Text')) return ['text', 'prompt', 'inputPrompt'];

    return ['input'];
  }

  static getPossibleOutputs(node: Node): string[] {
    const type = node.type || '';
    const heuristic = nodeTypeHandleHeuristics[type];
    if (heuristic) return heuristic.outputs;

    // Fallback: look at data.outputs if it exists
    const data = node.data as any;
    if (Array.isArray(data?.outputs)) {
      return data.outputs.map((o: any) => o.id || o.name);
    }

    // Generic fallback based on common patterns
    if (type.includes('Generator')) return ['outputImage'];
    if (type.includes('Input')) return [type.replace('Input', '')];

    return ['output'];
  }
}
