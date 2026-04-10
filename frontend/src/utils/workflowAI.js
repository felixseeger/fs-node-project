/**
 * Workflow AI Utilities - AI-powered workflow generation
 * 
 * Features:
 * - Prompt analysis and parsing
 * - Node recommendation engine
 * - Provider-aware workflow construction
 * - Workflow validation and optimization
 */

/**
 * Generate workflow from text prompt
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - User prompt
 * @param {Array} params.providerPreferences - Preferred providers
 * @param {Object} params.constraints - Generation constraints
 * @param {boolean} params.previewMode - Generate preview only
 * @param {number} params.maxNodes - Maximum nodes to generate
 * @returns {Promise<Object>} - Generated workflow
 */
export async function generateWorkflowFromPrompt(params) {
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
    providerPreferences,
  });

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
 * @param {string} prompt - User prompt
 * @returns {Object} - Analysis result
 */
function analyzePrompt(prompt) {
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
 * @param {string} prompt - Lowercase prompt
 * @returns {string} - Detected style
 */
function getStyleFromPrompt(prompt) {
  if (prompt.includes('realistic') || prompt.includes('photorealistic')) return 'realistic';
  if (prompt.includes('cartoon') || prompt.includes('anime')) return 'cartoon';
  if (prompt.includes('abstract') || prompt.includes('surreal')) return 'abstract';
  if (prompt.includes('minimalist') || prompt.includes('simple')) return 'minimalist';
  return 'general';
}

/**
 * Extract output format from prompt
 * @param {string} prompt - Lowercase prompt
 * @returns {string} - Detected format
 */
function getOutputFormatFromPrompt(prompt) {
  if (prompt.includes('png') || prompt.includes('transparent')) return 'png';
  if (prompt.includes('jpg') || prompt.includes('jpeg')) return 'jpg';
  if (prompt.includes('mp4') || prompt.includes('video')) return 'mp4';
  if (prompt.includes('mp3') || prompt.includes('audio')) return 'mp3';
  return 'auto';
}

/**
 * Generate nodes for specific workflow type
 * @param {Object} params - Generation parameters
 * @returns {Array} - Generated nodes
 */
function generateNodesForWorkflow({ workflowType, providerPreferences, constraints, maxNodes }) {
  const nodes = [];

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
      nodes.push(createVideoGeneratorNode(providerPreferences));
      if (nodes.length < maxNodes) nodes.push(createVideoUpscaleNode(providerPreferences));
      break;
    case 'audio':
      nodes.push(createAudioGeneratorNode(providerPreferences));
      if (nodes.length < maxNodes) nodes.push(createAudioEnhancementNode(providerPreferences));
      break;
    case 'text':
      nodes.push(createTextGeneratorNode(providerPreferences));
      if (nodes.length < maxNodes) nodes.push(createTextEnhancementNode(providerPreferences));
      break;
    default:
      nodes.push(createGeneralProcessingNode(providerPreferences));
  }

  // Add output node
  if (nodes.length < maxNodes) {
    nodes.push(createOutputNode(workflowType));
  }

  return nodes.slice(0, maxNodes); // Ensure we don't exceed maxNodes
}

/**
 * Create input node for workflow
 * @param {string} workflowType - Workflow type
 * @returns {Object} - Input node
 */
function createInputNode(workflowType) {
  const inputTypes = {
    image: { label: 'Image Input', handles: [{ id: 'image-in', type: 'target', label: 'Input Image' }] },
    video: { label: 'Video Input', handles: [{ id: 'video-in', type: 'target', label: 'Input Video' }] },
    audio: { label: 'Audio Input', handles: [{ id: 'audio-in', type: 'target', label: 'Input Audio' }] },
    text: { label: 'Text Input', handles: [{ id: 'text-in', type: 'target', label: 'Input Text' }] },
    general: { label: 'Input', handles: [{ id: 'input', type: 'target', label: 'Input' }] },
  };

  const config = inputTypes[workflowType] || inputTypes.general;

  return {
    id: `node-input-${Date.now()}`,
    type: 'input',
    position: { x: 100, y: 100 },
    data: {
      label: config.label,
      handles: config.handles,
    },
  };
}

/**
 * Create generator node with provider preferences
 * @param {Array} providerPreferences - Preferred providers
 * @returns {Object} - Generator node
 */
function createGeneratorNode(providerPreferences) {
  const provider = providerPreferences.includes('freepik') ? 'freepik' : 'default';

  return {
    id: `node-generator-${Date.now()}`,
    type: 'imageGenerator',
    position: { x: 300, y: 100 },
    data: {
      label: `${provider} Image Generator`,
      provider,
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'image-out', type: 'source', label: 'Generated Image' },
      ],
    },
  };
}

/**
 * Generate edges to connect nodes
 * @param {Array} nodes - Nodes to connect
 * @returns {Array} - Generated edges
 */
function generateEdgesForNodes(nodes) {
  const edges = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i];
    const targetNode = nodes[i + 1];

    // Find compatible handles
    const sourceHandle = sourceNode.data.handles?.find(h => h.type === 'source') || { id: 'output' };
    const targetHandle = targetNode.data.handles?.find(h => h.type === 'target') || { id: 'input' };

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
 * @param {Object} workflow - Workflow to optimize
 * @param {Array} providerPreferences - Preferred providers
 * @returns {Object} - Optimized workflow
 */
function optimizeWorkflow({ nodes, edges }, providerPreferences) {
  // Apply provider-specific optimizations
  const optimizedNodes = nodes.map(node => {
    if (providerPreferences.includes('freepik') && node.type === 'imageGenerator') {
      return {
        ...node,
        data: {
          ...node.data,
          provider: 'freepik',
          label: 'Freepik Image Generator',
        },
      };
    }
    return node;
  });

  return { nodes: optimizedNodes, edges };
}

/**
 * Validate generated workflow
 * @param {Object} workflow - Workflow to validate
 * @returns {Object} - Validation result
 */
export function validateWorkflow(workflow) {
  const errors = [];

  // Check for minimum nodes
  if (workflow.nodes.length < 2) {
    errors.push('Workflow must have at least 2 nodes');
  }

  // Check for input node
  const hasInput = workflow.nodes.some(node => 
    node.type === 'input' || 
    node.data.handles?.some(h => h.type === 'target' && !h.id.includes('-out'))
  );
  if (!hasInput) {
    errors.push('Workflow must have an input node');
  }

  // Check for output node
  const hasOutput = workflow.nodes.some(node => 
    node.type === 'output' || 
    node.data.handles?.some(h => h.type === 'source' && h.id.includes('-out'))
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
function createUpscaleNode(providerPreferences) {
  return {
    id: `node-upscale-${Date.now()}`,
    type: 'imageUpscale',
    position: { x: 500, y: 100 },
    data: {
      label: 'Image Upscale',
      provider: providerPreferences[0] || 'default',
      handles: [
        { id: 'image-in', type: 'target', label: 'Input Image' },
        { id: 'image-out', type: 'source', label: 'Upscaled Image' },
      ],
    },
  };
}

function createEnhancementNode(providerPreferences) {
  return {
    id: `node-enhance-${Date.now()}`,
    type: 'imageEnhance',
    position: { x: 700, y: 100 },
    data: {
      label: 'Image Enhancement',
      provider: providerPreferences[0] || 'default',
      handles: [
        { id: 'image-in', type: 'target', label: 'Input Image' },
        { id: 'image-out', type: 'source', label: 'Enhanced Image' },
      ],
    },
  };
}

function createOutputNode(workflowType) {
  const outputTypes = {
    image: { label: 'Image Output', handleId: 'image-in' },
    video: { label: 'Video Output', handleId: 'video-in' },
    audio: { label: 'Audio Output', handleId: 'audio-in' },
    text: { label: 'Text Output', handleId: 'text-in' },
    general: { label: 'Output', handleId: 'input' },
  };

  const config = outputTypes[workflowType] || outputTypes.general;

  return {
    id: `node-output-${Date.now()}`,
    type: 'output',
    position: { x: 900, y: 100 },
    data: {
      label: config.label,
      handles: [
        { id: config.handleId, type: 'target', label: 'Input' },
      ],
    },
  };
}

// Additional node creators for other workflow types
function createVideoGeneratorNode() {
  return {
    id: `node-video-gen-${Date.now()}`,
    type: 'videoGenerator',
    position: { x: 300, y: 100 },
    data: {
      label: 'Video Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'video-out', type: 'source', label: 'Generated Video' },
      ],
    },
  };
}

function createAudioGeneratorNode() {
  return {
    id: `node-audio-gen-${Date.now()}`,
    type: 'audioGenerator',
    position: { x: 300, y: 100 },
    data: {
      label: 'Audio Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'audio-out', type: 'source', label: 'Generated Audio' },
      ],
    },
  };
}

function createGeneralProcessingNode() {
  return {
    id: `node-process-${Date.now()}`,
    type: 'processor',
    position: { x: 300, y: 100 },
    data: {
      label: 'Processing Node',
      handles: [
        { id: 'input', type: 'target', label: 'Input' },
        { id: 'output', type: 'source', label: 'Output' },
      ],
    },
  };
}

function createTextGeneratorNode() {
  return {
    id: `node-text-gen-${Date.now()}`,
    type: 'textGenerator',
    position: { x: 300, y: 100 },
    data: {
      label: 'Text Generator',
      handles: [
        { id: 'prompt-in', type: 'target', label: 'Prompt' },
        { id: 'text-out', type: 'source', label: 'Generated Text' },
      ],
    },
  };
}

function createVideoUpscaleNode() {
  return {
    id: `node-video-upscale-${Date.now()}`,
    type: 'videoUpscale',
    position: { x: 500, y: 100 },
    data: {
      label: 'Video Upscale',
      handles: [
        { id: 'video-in', type: 'target', label: 'Input Video' },
        { id: 'video-out', type: 'source', label: 'Upscaled Video' },
      ],
    },
  };
}

function createAudioEnhancementNode() {
  return {
    id: `node-audio-enhance-${Date.now()}`,
    type: 'audioEnhance',
    position: { x: 500, y: 100 },
    data: {
      label: 'Audio Enhancement',
      handles: [
        { id: 'audio-in', type: 'target', label: 'Input Audio' },
        { id: 'audio-out', type: 'source', label: 'Enhanced Audio' },
      ],
    },
  };
}

function createTextEnhancementNode() {
  return {
    id: `node-text-enhance-${Date.now()}`,
    type: 'textEnhance',
    position: { x: 500, y: 100 },
    data: {
      label: 'Text Enhancement',
      handles: [
        { id: 'text-in', type: 'target', label: 'Input Text' },
        { id: 'text-out', type: 'source', label: 'Enhanced Text' },
      ],
    },
  };
}
