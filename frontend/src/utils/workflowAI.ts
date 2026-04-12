/**
 * Workflow AI Utilities - AI-powered workflow generation
 * 
 * Features:
 * - Prompt analysis and parsing
 * - Node recommendation engine
 * - Provider-aware workflow construction
 * - Workflow validation and optimization
 */

import type { Node } from '@xyflow/react';
import type { NodeData } from '../types';

/**
 * Workflow generation constraints
 */
export interface WorkflowConstraints {
  maxNodes?: number;
  maxDepth?: number;
  provider?: string;
}

/**
 * Workflow metadata
 */
export interface WorkflowMetadata {
  generatedAt: string;
  prompt: string;
  workflowType: string;
  providerPreferences: string[];
  constraints: WorkflowConstraints;
  previewMode: boolean;
}

/**
 * Workflow edge structure
 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  markerEnd?: string | {
    type: string;
    width?: number;
    height?: number;
    color?: string | null;
  };
}

/**
 * Generated workflow structure
 */
export interface GeneratedWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node<NodeData>[];
  edges: WorkflowEdge[];
  metadata: WorkflowMetadata;
}

/**
 * Workflow validation result
 */
export interface WorkflowValidation {
  valid: boolean;
  errors: string[];
  nodeCount?: number;
  edgeCount?: number;
}

/**
 * Generation parameters
 */
export interface GenerateWorkflowParams {
  prompt: string;
  providerPreferences?: string[];
  constraints?: WorkflowConstraints;
  previewMode?: boolean;
  maxNodes?: number;
}

interface PromptAnalysis {
  type: string;
  requirements: {
    quality: string;
    style: string;
    outputFormat: string;
  };
}

/**
 * Generate workflow from text prompt
 */
export async function generateWorkflowFromPrompt(params: GenerateWorkflowParams): Promise<GeneratedWorkflow> {
  const { prompt, providerPreferences = [], constraints = {}, previewMode = false, maxNodes = 10 } = params;

  // Analyze the prompt to determine workflow type
  const analysis = analyzePrompt(prompt);

  // Generate appropriate nodes based on analysis
  const nodes = generateNodesForWorkflow({
    workflowType: analysis.type,
    providerPreferences,
    constraints,
    maxNodes,
  });

  // Connect nodes based on workflow logic
  const edges = generateEdgesForNodes(nodes);

  // Apply provider-aware optimizations
  const optimizedWorkflow = optimizeWorkflow({
    nodes,
    edges,
  }, providerPreferences);

  return {
    id: `workflow-${Date.now()}`,
    name: `Generated ${analysis.type} Workflow`,
    description: `AI-generated workflow from prompt: "${prompt.substring(0, 50)}..."`,
    nodes: optimizedWorkflow.nodes,
    edges: optimizedWorkflow.edges,
    metadata: {
      generatedAt: new Date().toISOString(),
      prompt,
      workflowType: analysis.type,
      providerPreferences,
      constraints,
      previewMode,
    },
  };
}

/**
 * Analyze prompt to determine workflow type and requirements
 */
function analyzePrompt(prompt: string): PromptAnalysis {
  const lowerPrompt = prompt.toLowerCase();

  // Determine workflow type
  let type = 'general';
  if (lowerPrompt.includes('image') || lowerPrompt.includes('photo') || lowerPrompt.includes('picture')) {
    type = 'image';
  } else if (lowerPrompt.includes('video') || lowerPrompt.includes('animation') || lowerPrompt.includes('motion')) {
    type = 'video';
  } else if (lowerPrompt.includes('audio') || lowerPrompt.includes('sound') || lowerPrompt.includes('music')) {
    type = 'audio';
  } else if (lowerPrompt.includes('text') || lowerPrompt.includes('prompt') || lowerPrompt.includes('writing')) {
    type = 'text';
  }

  // Extract key requirements
  const requirements = {
    quality: lowerPrompt.includes('high quality') || lowerPrompt.includes('4k') ? 'high' : 'standard',
    style: getStyleFromPrompt(lowerPrompt),
    outputFormat: getOutputFormatFromPrompt(lowerPrompt),
  };

  return { type, requirements };
}

/**
 * Extract style information from prompt
 */
function getStyleFromPrompt(prompt: string): string {
  if (prompt.includes('realistic') || prompt.includes('photorealistic')) return 'realistic';
  if (prompt.includes('cartoon') || prompt.includes('anime')) return 'cartoon';
  if (prompt.includes('abstract') || prompt.includes('surreal')) return 'abstract';
  if (prompt.includes('minimalist') || prompt.includes('simple')) return 'minimalist';
  return 'general';
}

/**
 * Extract output format from prompt
 */
function getOutputFormatFromPrompt(prompt: string): string {
  if (prompt.includes('png') || prompt.includes('transparent')) return 'png';
  if (prompt.includes('jpg') || prompt.includes('jpeg')) return 'jpg';
  if (prompt.includes('mp4') || prompt.includes('video')) return 'mp4';
  if (prompt.includes('mp3') || prompt.includes('audio')) return 'mp3';
  return 'auto';
}

/**
 * Generate nodes for specific workflow type
 */
function generateNodesForWorkflow({ 
  workflowType, 
  providerPreferences, 
  constraints, 
  maxNodes 
}: { 
  workflowType: string; 
  providerPreferences: string[]; 
  constraints: WorkflowConstraints; 
  maxNodes: number; 
}): Node<NodeData>[] {
  const nodes: Node<NodeData>[] = [];

  // Add input node
  nodes.push(createInputNode(workflowType));

  // Add processing nodes based on workflow type
  switch (workflowType) {
    case 'image':
      nodes.push(createGeneratorNode(providerPreferences));
      if (nodes.length < maxNodes) nodes.push(createUpscaleNode(providerPreferences));
      if (nodes.length < maxNodes) nodes.push(createEnhancementNode(providerPreferences));
      break;
    case 'video':
      nodes.push(createVideoGeneratorNode());
      if (nodes.length < maxNodes) nodes.push(createVideoUpscaleNode());
      break;
    case 'audio':
      nodes.push(createAudioGeneratorNode());
      if (nodes.length < maxNodes) nodes.push(createAudioEnhancementNode());
      break;
    case 'text':
      nodes.push(createTextGeneratorNode());
      if (nodes.length < maxNodes) nodes.push(createTextEnhancementNode());
      break;
    default:
      nodes.push(createGeneralProcessingNode());
  }

  // Add output node
  if (nodes.length < maxNodes) {
    nodes.push(createOutputNode(workflowType));
  }

  return nodes.slice(0, maxNodes); // Ensure we don't exceed maxNodes
}

/**
 * Create input node for workflow
 */
function createInputNode(workflowType: string): Node<NodeData> {
  const inputTypes: Record<string, { label: string; handles: any[] }> = {
    image: { label: 'Image Input', handles: [{ id: 'image-in', type: 'target', label: 'Input Image' }] },
    video: { label: 'Video Input', handles: [{ id: 'video-in', type: 'target', label: 'Input Video' }] },
    audio: { label: 'Audio Input', handles: [{ id: 'audio-in', type: 'target', label: 'Input Audio' }] },
    text: { label: 'Text Input', handles: [{ id: 'text-in', type: 'target', label: 'Input Text' }] },
    general: { label: 'Input', handles: [{ id: 'input', type: 'target', label: 'Input' }] },
  };

  const config = inputTypes[workflowType] || inputTypes.general;

  const id = `node-input-${Date.now()}`;
  return {
    id,
    type: 'input',
    position: { x: 100, y: 100 },
    data: {
      id,
      label: config.label,
      handles: config.handles,
    } as any,
  };
}

/**
 * Create generator node with provider preferences
 */
function createGeneratorNode(providerPreferences: string[]): Node<NodeData> {
  const provider = providerPreferences.includes('freepik') ? 'freepik' : 'default';

  const id = `node-generator-${Date.now()}`;
  return {
    id,
    type: 'imageGenerator',
    position: { x: 300, y: 100 },
    data: {
      id,
      label: `${provider} Image Generator`,
      provider,
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'image-out', type: 'source', label: 'Generated Image' },
      ],
    } as any,
  };
}

/**
 * Generate edges to connect nodes
 */
function generateEdgesForNodes(nodes: Node<NodeData>[]): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i];
    const targetNode = nodes[i + 1];

    // Find compatible handles
    const sourceHandle = (sourceNode.data as any).handles?.find((h: any) => h.type === 'source') || { id: 'output' };
    const targetHandle = (targetNode.data as any).handles?.find((h: any) => h.type === 'target') || { id: 'input' };

    edges.push({
      id: `edge-${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      sourceHandle: sourceHandle.id,
      target: targetNode.id,
      targetHandle: targetHandle.id,
    });
  }

  return edges;
}

/**
 * Optimize workflow based on provider preferences
 */
function optimizeWorkflow({ nodes, edges }: { nodes: Node<NodeData>[]; edges: WorkflowEdge[] }, providerPreferences: string[]): { nodes: Node<NodeData>[]; edges: WorkflowEdge[] } {
  // Apply provider-specific optimizations
  const optimizedNodes = nodes.map(node => {
    if (providerPreferences.includes('freepik') && node.type === 'imageGenerator') {
      return {
        ...node,
        data: {
          ...node.data,
          provider: 'freepik',
          label: 'Freepik Image Generator',
        } as any,
      };
    }
    return node;
  });

  return { nodes: optimizedNodes, edges };
}

/**
 * Validate generated workflow
 */
export function validateWorkflow(workflow: GeneratedWorkflow): WorkflowValidation {
  const errors = [];

  // Check for minimum nodes
  if (workflow.nodes.length < 2) {
    errors.push('Workflow must have at least 2 nodes');
  }

  // Check for input node
  const hasInput = workflow.nodes.some(node => 
    node.type === 'input' || 
    (node.data as any).handles?.some((h: any) => h.type === 'target' && !h.id.includes('-out'))
  );
  if (!hasInput) {
    errors.push('Workflow must have an input node');
  }

  // Check for output node
  const hasOutput = workflow.nodes.some(node => 
    node.type === 'output' || 
    (node.data as any).handles?.some((h: any) => h.type === 'source' && h.id.includes('-out'))
  );
  if (!hasOutput) {
    errors.push('Workflow must have an output node');
  }

  return {
    valid: errors.length === 0,
    errors,
    nodeCount: workflow.nodes.length,
    edgeCount: workflow.edges.length,
  };
}

// Helper functions for creating specific node types
function createUpscaleNode(providerPreferences: string[]): Node<NodeData> {
  const id = `node-upscale-${Date.now()}`;
  return {
    id,
    type: 'imageUpscale',
    position: { x: 500, y: 100 },
    data: {
      id,
      label: 'Image Upscale',
      provider: providerPreferences[0] || 'default',
      handles: [
        { id: 'image-in', type: 'target', label: 'Input Image' },
        { id: 'image-out', type: 'source', label: 'Upscaled Image' },
      ],
    } as any,
  };
}

function createEnhancementNode(providerPreferences: string[]): Node<NodeData> {
  const id = `node-enhance-${Date.now()}`;
  return {
    id,
    type: 'imageEnhance',
    position: { x: 700, y: 100 },
    data: {
      id,
      label: 'Image Enhancement',
      provider: providerPreferences[0] || 'default',
      handles: [
        { id: 'image-in', type: 'target', label: 'Input Image' },
        { id: 'image-out', type: 'source', label: 'Enhanced Image' },
      ],
    } as any,
  };
}

function createOutputNode(workflowType: string): Node<NodeData> {
  const outputTypes: Record<string, { label: string; handleId: string }> = {
    image: { label: 'Image Output', handleId: 'image-in' },
    video: { label: 'Video Output', handleId: 'video-in' },
    audio: { label: 'Audio Output', handleId: 'audio-in' },
    text: { label: 'Text Output', handleId: 'text-in' },
    general: { label: 'Output', handleId: 'input' },
  };

  const config = outputTypes[workflowType] || outputTypes.general;

  const id = `node-output-${Date.now()}`;
  return {
    id,
    type: 'output',
    position: { x: 900, y: 100 },
    data: {
      id,
      label: config.label,
      handles: [
        { id: config.handleId, type: 'target', label: 'Input' },
      ],
    } as any,
  };
}

// Additional node creators for other workflow types
function createVideoGeneratorNode(): Node<NodeData> {
  const id = `node-video-gen-${Date.now()}`;
  return {
    id,
    type: 'videoGenerator',
    position: { x: 300, y: 100 },
    data: {
      id,
      label: 'Video Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'video-out', type: 'source', label: 'Generated Video' },
      ],
    } as any,
  };
}

function createAudioGeneratorNode(): Node<NodeData> {
  const id = `node-audio-gen-${Date.now()}`;
  return {
    id,
    type: 'audioGenerator',
    position: { x: 300, y: 100 },
    data: {
      id,
      label: 'Audio Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'audio-out', type: 'source', label: 'Generated Audio' },
      ],
    } as any,
  };
}

function createGeneralProcessingNode(): Node<NodeData> {
  const id = `node-process-${Date.now()}`;
  return {
    id,
    type: 'processor',
    position: { x: 300, y: 100 },
    data: {
      id,
      label: 'Processing Node',
      handles: [
        { id: 'input', type: 'target', label: 'Input' },
        { id: 'output', type: 'source', label: 'Output' },
      ],
    } as any,
  };
}

function createTextGeneratorNode(): Node<NodeData> {
  const id = `node-text-gen-${Date.now()}`;
  return {
    id,
    type: 'textGenerator',
    position: { x: 300, y: 100 },
    data: {
      id,
      label: 'Text Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'text-out', type: 'source', label: 'Generated Text' },
      ],
    } as any,
  };
}

function createVideoUpscaleNode(): Node<NodeData> {
  const id = `node-video-upscale-${Date.now()}`;
  return {
    id,
    type: 'videoUpscale',
    position: { x: 500, y: 100 },
    data: {
      id,
      label: 'Video Upscale',
      handles: [
        { id: 'video-in', type: 'target', label: 'Input Video' },
        { id: 'video-out', type: 'source', label: 'Upscaled Video' },
      ],
    } as any,
  };
}

function createAudioEnhancementNode(): Node<NodeData> {
  const id = `node-audio-enhance-${Date.now()}`;
  return {
    id,
    type: 'audioEnhance',
    position: { x: 500, y: 100 },
    data: {
      id,
      label: 'Audio Enhancement',
      handles: [
        { id: 'audio-in', type: 'target', label: 'Input Audio' },
        { id: 'audio-out', type: 'source', label: 'Enhanced Audio' },
      ],
    } as any,
  };
}

function createTextEnhancementNode(): Node<NodeData> {
  const id = `node-text-enhance-${Date.now()}`;
  return {
    id,
    type: 'textEnhance',
    position: { x: 500, y: 100 },
    data: {
      id,
      label: 'Text Enhancement',
      handles: [
        { id: 'text-in', type: 'target', label: 'Input Text' },
        { id: 'text-out', type: 'source', label: 'Enhanced Text' },
      ],
    } as any,
  };
}
