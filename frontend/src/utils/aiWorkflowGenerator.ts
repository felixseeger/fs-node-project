/**
 * AI Workflow Generator - Converts natural language prompts to workflow structures
 * This is a mock implementation that generates reasonable workflows based on prompt analysis
 */

import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../types';

interface WorkflowConstraints {
  maxNodes?: number;
}

interface GenerateWorkflowParams {
  prompt: string;
  providerPreferences?: string[];
  constraints?: WorkflowConstraints;
}

interface GeneratedWorkflow {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

interface PromptAnalysis {
  type: string;
  subject: string;
  style: string;
  parameters: Record<string, string>;
}

/**
 * Generate workflow from natural language prompt
 */
export async function generateWorkflowFromPrompt({ 
  prompt, 
  providerPreferences = ['freepik', 'anthropic'], 
  constraints = {} 
}: GenerateWorkflowParams): Promise<GeneratedWorkflow> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Analyze prompt to determine workflow type
  const analysis = analyzePrompt(prompt);
  
  // Generate appropriate workflow based on analysis
  switch (analysis.type) {
    case 'image_generation':
      return generateImageWorkflow(analysis, providerPreferences, constraints);
    case 'video_generation':
      return generateVideoWorkflow(analysis, providerPreferences, constraints);
    case 'audio_generation':
      return generateAudioWorkflow(analysis, providerPreferences, constraints);
    case 'complex_composition':
      return generateComplexWorkflow(analysis, providerPreferences, constraints);
    default:
      return generateDefaultWorkflow(analysis, providerPreferences, constraints);
  }
}

/**
 * Analyze prompt to determine workflow type and extract key parameters
 */
function analyzePrompt(prompt: string): PromptAnalysis {
  const lowerPrompt = prompt.toLowerCase();
  const result: PromptAnalysis = {
    type: 'default',
    subject: '',
    style: '',
    parameters: {}
  };

  // Determine workflow type
  if (lowerPrompt.includes('video') || lowerPrompt.includes('animation') || lowerPrompt.includes('motion')) {
    result.type = 'video_generation';
  } else if (lowerPrompt.includes('audio') || lowerPrompt.includes('music') || lowerPrompt.includes('sound')) {
    result.type = 'audio_generation';
  } else if (lowerPrompt.includes('compose') || lowerPrompt.includes('combination') || 
             lowerPrompt.includes('multiple') || lowerPrompt.includes('series')) {
    result.type = 'complex_composition';
  } else {
    result.type = 'image_generation';
  }

  // Extract subject
  const subjectKeywords = ['landscape', 'portrait', 'cityscape', 'character', 'poster', 'composition', 'design', 'illustration'];
  result.subject = subjectKeywords.find(keyword => lowerPrompt.includes(keyword)) || 'creative work';

  // Extract style
  const styleKeywords = [
    { keywords: ['surreal', 'dreamlike', 'fantasy'], style: 'surreal' },
    { keywords: ['cyberpunk', 'futuristic', 'neon'], style: 'cyberpunk' },
    { keywords: ['vintage', 'retro', 'old'], style: 'vintage' },
    { keywords: ['abstract', 'geometric', 'minimal'], style: 'abstract' },
    { keywords: ['realistic', 'photorealistic', 'photo'], style: 'realistic' }
  ];

  const foundStyle = styleKeywords.find(({ keywords }) => 
    keywords.some(keyword => lowerPrompt.includes(keyword))
  );
  result.style = foundStyle ? foundStyle.style : 'creative';

  // Extract parameters
  if (lowerPrompt.includes('vibrant') || lowerPrompt.includes('colorful')) {
    result.parameters.colors = 'vibrant';
  }
  if (lowerPrompt.includes('dark') || lowerPrompt.includes('night')) {
    result.parameters.mood = 'dark';
  }

  return result;
}

/**
 * Generate image workflow
 */
function generateImageWorkflow(analysis: PromptAnalysis, providers: string[], constraints: WorkflowConstraints): GeneratedWorkflow {
  const maxNodes = constraints.maxNodes || 8;
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // Input node
  const inputNode: Node<NodeData> = {
    id: `node-input-${Date.now()}`,
    type: 'input',
    position: { x: 100, y: 100 },
    data: {
      id: `node-input-${Date.now()}`,
      label: 'Input Parameters',
      prompt: `Generate a ${analysis.style} ${analysis.subject} with ${analysis.parameters.colors || 'appropriate'} colors and ${analysis.parameters.mood || 'neutral'} mood`,
      aspectRatio: '16:9',
      resolution: '1024x1024'
    } as any
  };
  nodes.push(inputNode);

  // Prompt improvement node
  if (nodes.length < maxNodes) {
    const improveNode: Node<NodeData> = {
      id: `node-improve-${Date.now() + 1}`,
      type: 'improvePrompt',
      position: { x: 100, y: 250 },
      data: { 
        id: `node-improve-${Date.now() + 1}`,
        label: 'Improve Prompt', 
        promptType: 'detailed', 
        language: 'english' 
      } as any
    };
    nodes.push(improveNode);
    edges.push({ id: `edge-${Date.now()}`, source: inputNode.id, target: improveNode.id, sourceHandle: 'prompt-out', targetHandle: 'prompt-in' });
  }

  // Generator node
  if (nodes.length < maxNodes) {
    const generatorNode: Node<NodeData> = {
      id: `node-generator-${Date.now() + 2}`,
      type: 'generator',
      position: { x: 100, y: 400 },
      data: {
        id: `node-generator-${Date.now() + 2}`,
        label: 'Image Generator',
        provider: providers[0],
        model: 'nano-banana-2',
        style: analysis.style
      } as any
    };
    nodes.push(generatorNode);
    edges.push({ 
      id: `edge-${Date.now() + 1}`, 
      source: nodes[nodes.length - 2].id, 
      target: generatorNode.id, 
      sourceHandle: 'prompt-out', 
      targetHandle: 'prompt-in'
    });
  }

  // Upscale node
  if (nodes.length < maxNodes) {
    const upscaleNode: Node<NodeData> = {
      id: `node-upscale-${Date.now() + 3}`,
      type: 'creativeUpScale',
      position: { x: 100, y: 550 },
      data: { 
        id: `node-upscale-${Date.now() + 3}`,
        label: 'Creative Upscale', 
        scale: '2x', 
        provider: providers[0] 
      } as any
    };
    nodes.push(upscaleNode);
    edges.push({ 
      id: `edge-${Date.now() + 2}`, 
      source: nodes[nodes.length - 2].id, 
      target: upscaleNode.id, 
      sourceHandle: 'output', 
      targetHandle: 'image-in'
    });
  }

  // Output node
  if (nodes.length < maxNodes) {
    const outputNode: Node<NodeData> = {
      id: `node-output-${Date.now() + 4}`,
      type: 'imageOutput',
      position: { x: 100, y: 700 },
      data: { 
        id: `node-output-${Date.now() + 4}`,
        label: 'Final Output' 
      } as any
    };
    nodes.push(outputNode);
    edges.push({ 
      id: `edge-${Date.now() + 3}`, 
      source: nodes[nodes.length - 2].id, 
      target: outputNode.id, 
      sourceHandle: 'output', 
      targetHandle: 'image-in'
    });
  }

  return { nodes, edges };
}

/**
 * Generate video workflow
 */
function generateVideoWorkflow(analysis: PromptAnalysis, providers: string[], constraints: WorkflowConstraints): GeneratedWorkflow {
  const maxNodes = constraints.maxNodes || 6;
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // Input node
  const inputNode: Node<NodeData> = {
    id: `node-input-${Date.now()}`,
    type: 'input',
    position: { x: 100, y: 100 },
    data: {
      id: `node-input-${Date.now()}`,
      label: 'Video Parameters',
      prompt: `Create a ${analysis.style} ${analysis.subject} video sequence`,
      duration: '10 seconds',
      aspectRatio: '16:9'
    } as any
  };
  nodes.push(inputNode);

  // Video generator node
  if (nodes.length < maxNodes) {
    const videoNode: Node<NodeData> = {
      id: `node-video-${Date.now() + 1}`,
      type: 'kling3',
      position: { x: 100, y: 250 },
      data: { 
        id: `node-video-${Date.now() + 1}`,
        label: 'Kling 3 Video', 
        provider: providers[0], 
        motion: 'smooth' 
      } as any
    };
    nodes.push(videoNode);
    edges.push({ id: `edge-${Date.now()}`, source: inputNode.id, target: videoNode.id, sourceHandle: 'prompt-out', targetHandle: 'prompt-in' });
  }

  // Video upscale node
  if (nodes.length < maxNodes) {
    const upscaleNode: Node<NodeData> = {
      id: `node-vfx-${Date.now() + 2}`,
      type: 'creativeVideoUpscale',
      position: { x: 100, y: 400 },
      data: { 
        id: `node-vfx-${Date.now() + 2}`,
        label: 'Video Upscale', 
        quality: 'high', 
        provider: providers[0] 
      } as any
    };
    nodes.push(upscaleNode);
    edges.push({ id: `edge-${Date.now() + 1}`, source: nodes[nodes.length - 2].id, target: upscaleNode.id, sourceHandle: 'output-video', targetHandle: 'video-in' });
  }

  // Output node
  if (nodes.length < maxNodes) {
    const outputNode: Node<NodeData> = {
      id: `node-output-${Date.now() + 3}`,
      type: 'response',
      position: { x: 100, y: 550 },
      data: { 
        id: `node-output-${Date.now() + 3}`,
        label: 'Video Output' 
      } as any
    };
    nodes.push(outputNode);
    edges.push({ id: `edge-${Date.now() + 2}`, source: nodes[nodes.length - 2].id, target: outputNode.id, sourceHandle: 'output-video', targetHandle: 'video-in' });
  }

  return { nodes, edges };
}

/**
 * Generate audio workflow
 */
function generateAudioWorkflow(analysis: PromptAnalysis, providers: string[], constraints: WorkflowConstraints): GeneratedWorkflow {
  const maxNodes = constraints.maxNodes || 4;
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // Input node
  const inputNode: Node<NodeData> = {
    id: `node-input-${Date.now()}`,
    type: 'input',
    position: { x: 100, y: 100 },
    data: {
      id: `node-input-${Date.now()}`,
      label: 'Audio Parameters',
      prompt: `Generate ${analysis.style} audio for ${analysis.subject}`,
      duration: '30 seconds'
    } as any
  };
  nodes.push(inputNode);

  // Audio generator node
  if (nodes.length < maxNodes) {
    const audioNode: Node<NodeData> = {
      id: `node-audio-${Date.now() + 1}`,
      type: 'musicGeneration',
      position: { x: 100, y: 250 },
      data: { 
        id: `node-audio-${Date.now() + 1}`,
        label: 'Music Generator', 
        style: analysis.style, 
        provider: providers[1] 
      } as any
    };
    nodes.push(audioNode);
    edges.push({ id: `edge-${Date.now()}`, source: inputNode.id, target: audioNode.id, sourceHandle: 'prompt-out', targetHandle: 'prompt-in' });
  }

  // Output node
  if (nodes.length < maxNodes) {
    const outputNode: Node<NodeData> = {
      id: `node-output-${Date.now() + 2}`,
      type: 'soundOutput',
      position: { x: 100, y: 400 },
      data: { 
        id: `node-output-${Date.now() + 2}`,
        label: 'Audio Output' 
      } as any
    };
    nodes.push(outputNode);
    edges.push({ id: `edge-${Date.now() + 1}`, source: nodes[nodes.length - 2].id, target: outputNode.id, sourceHandle: 'output-audio', targetHandle: 'audio-in' });
  }

  return { nodes, edges };
}

/**
 * Generate complex multi-step workflow
 */
function generateComplexWorkflow(analysis: PromptAnalysis, providers: string[], constraints: WorkflowConstraints): GeneratedWorkflow {
  const maxNodes = constraints.maxNodes || 10;
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // Input node
  const inputNode: Node<NodeData> = {
    id: `node-input-${Date.now()}`,
    type: 'input',
    position: { x: 50, y: 100 },
    data: {
      id: `node-input-${Date.now()}`,
      label: 'Main Input',
      prompt: `Create a ${analysis.style} ${analysis.subject} composition`
    } as any
  };
  nodes.push(inputNode);

  // Branch 1: Image generation
  if (nodes.length < maxNodes) {
    const imageNode: Node<NodeData> = {
      id: `node-image-${Date.now() + 1}`,
      type: 'generator',
      position: { x: 50, y: 250 },
      data: { 
        id: `node-image-${Date.now() + 1}`,
        label: 'Base Image', 
        provider: providers[0], 
        model: 'nano-banana-2' 
      } as any
    };
    nodes.push(imageNode);
    edges.push({ id: `edge-${Date.now()}`, source: inputNode.id, target: imageNode.id, sourceHandle: 'prompt-out', targetHandle: 'prompt-in' });
  }

  // Branch 2: Parallel processing
  if (nodes.length < maxNodes) {
    const parallelNode: Node<NodeData> = {
      id: `node-parallel-${Date.now() + 2}`,
      type: 'generator',
      position: { x: 250, y: 250 },
      data: { 
        id: `node-parallel-${Date.now() + 2}`,
        label: 'Variant Image', 
        provider: providers[0], 
        model: 'kora-reality' 
      } as any
    };
    nodes.push(parallelNode);
    edges.push({ id: `edge-${Date.now() + 1}`, source: inputNode.id, target: parallelNode.id, sourceHandle: 'prompt-out', targetHandle: 'prompt-in' });
  }

  // Merge node
  if (nodes.length < maxNodes && nodes.length >= 3) {
    const mergeNode: Node<NodeData> = {
      id: `node-merge-${Date.now() + 3}`,
      type: 'router',
      position: { x: 150, y: 400 },
      data: { 
        id: `node-merge-${Date.now() + 3}`,
        label: 'Combine Images' 
      } as any
    };
    nodes.push(mergeNode);
    edges.push({ id: `edge-${Date.now() + 2}`, source: nodes[nodes.length - 3].id, target: mergeNode.id, sourceHandle: 'output', targetHandle: 'image-0' });
    edges.push({ id: `edge-${Date.now() + 3}`, source: nodes[nodes.length - 2].id, target: mergeNode.id, sourceHandle: 'output', targetHandle: 'image-1' });
  }

  // Final output
  if (nodes.length < maxNodes) {
    const outputNode: Node<NodeData> = {
      id: `node-output-${Date.now() + 4}`,
      type: 'response',
      position: { x: 150, y: 550 },
      data: { 
        id: `node-output-${Date.now() + 4}`,
        label: 'Final Composition' 
      } as any
    };
    nodes.push(outputNode);
    edges.push({ id: `edge-${Date.now() + 4}`, source: nodes[nodes.length - 2].id, target: outputNode.id, sourceHandle: 'output', targetHandle: 'image-in' });
  }

  return { nodes, edges };
}

/**
 * Generate default fallback workflow
 */
function generateDefaultWorkflow(analysis: PromptAnalysis, providers: string[], constraints: WorkflowConstraints): GeneratedWorkflow {
  return generateImageWorkflow(analysis, providers, constraints);
}
