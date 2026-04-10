/**
 * Workflow Embedding Utilities
 * 
 * This module provides functions for embedding workflow metadata into outputs
 * and extracting workflows from embedded metadata.
 * 
 * Note: Only provider references are embedded (not API keys or sensitive data)
 */

/**
 * Embed workflow metadata into an output object
 * 
 * @param {Object} output - The output object to embed workflow into
 * @param {Object} workflow - The workflow to embed
 * @param {Array} providers - Array of provider IDs used in the workflow
 * @returns {Object} Output with embedded workflow metadata
 */
export function embedWorkflowInOutput(output, workflow, providers) {
  if (!output) {
    output = {};
  }
  
  // Create a copy to avoid mutating the original
  const result = { ...output };
  
  result.nodeBananaWorkflow = {
    version: "1.0",
    nodes: workflow.nodes || [],
    edges: workflow.edges || [],
    providers: providers || [],
    timestamp: new Date().toISOString(),
    metadata: {
      generatedBy: "Node Banana Architecture",
      providerReferencesOnly: true,
      embeddingVersion: "1.0"
    }
  };
  
  return result;
}

/**
 * Extract workflow from embedded metadata
 * 
 * @param {Object} output - The output object containing embedded workflow
 * @returns {Object|null} Extracted workflow or null if not found
 */
export function extractWorkflowFromOutput(output) {
  if (!output || !output.nodeBananaWorkflow) {
    return null;
  }
  
  const embedded = output.nodeBananaWorkflow;
  
  // Validate the embedded workflow structure
  if (!embedded.nodes || !Array.isArray(embedded.nodes) ||
      !embedded.edges || !Array.isArray(embedded.edges) ||
      !embedded.providers || !Array.isArray(embedded.providers)) {
    console.warn("Invalid embedded workflow structure");
    return null;
  }
  
  return {
    nodes: embedded.nodes,
    edges: embedded.edges,
    providers: embedded.providers,
    timestamp: embedded.timestamp,
    metadata: embedded.metadata
  };
}

/**
 * Check if an output contains embedded workflow metadata
 * 
 * @param {Object} output - The output object to check
 * @returns {boolean} True if workflow is embedded
 */
export function hasEmbeddedWorkflow(output) {
  return !!output?.nodeBananaWorkflow;
}

/**
 * Get provider references from embedded workflow
 * 
 * @param {Object} output - The output object containing embedded workflow
 * @returns {Array} Array of provider IDs or empty array
 */
export function getEmbeddedProviders(output) {
  if (hasEmbeddedWorkflow(output)) {
    return output.nodeBananaWorkflow.providers || [];
  }
  return [];
}

/**
 * Validate embedded workflow structure
 * 
 * @param {Object} output - The output object to validate
 * @returns {boolean} True if structure is valid
 */
export function validateEmbeddedWorkflow(output) {
  if (!hasEmbeddedWorkflow(output)) {
    return false;
  }
  
  const embedded = output.nodeBananaWorkflow;
  
  // Check required fields
  if (typeof embedded.version !== 'string' ||
      !Array.isArray(embedded.nodes) ||
      !Array.isArray(embedded.edges) ||
      !Array.isArray(embedded.providers) ||
      typeof embedded.timestamp !== 'string') {
    return false;
  }
  
  // Check metadata
  if (embedded.metadata && 
      embedded.metadata.providerReferencesOnly !== true) {
    return false;
  }
  
  return true;
}

/**
 * Create visual badge for embedded workflows
 * 
 * @param {Object} output - The output object
 * @returns {JSX.Element|null} Badge component or null
 */
export function createEmbeddedWorkflowBadge(output) {
  if (!hasEmbeddedWorkflow(output)) {
    return null;
  }
  
  const providers = getEmbeddedProviders(output);
  const providerNames = providers.join(', ');
  
  return {
    type: 'embeddedWorkflowBadge',
    label: 'Embedded Workflow',
    providers: providerNames,
    ariaLabel: `This output contains an embedded workflow with ${providers.length} provider reference(s)`
  };
}

/**
 * Reconstruct workflow from embedded metadata
 * 
 * @param {Object} embeddedWorkflow - The extracted workflow data
 * @returns {Object} Reconstructed workflow for reimport
 */
export function reconstructWorkflow(embeddedWorkflow) {
  // Create a workflow object suitable for reimport
  return {
    name: `Reconstructed Workflow - ${new Date(embeddedWorkflow.timestamp).toLocaleDateString()}`,
    nodes: embeddedWorkflow.nodes,
    edges: embeddedWorkflow.edges,
    providers: embeddedWorkflow.providers,
    metadata: {
      source: 'embedded',
      originalTimestamp: embeddedWorkflow.timestamp,
      providerReferencesOnly: true
    }
  };
}

// Export all functions
const WorkflowEmbedding = {
  embedWorkflowInOutput,
  extractWorkflowFromOutput,
  hasEmbeddedWorkflow,
  getEmbeddedProviders,
  validateEmbeddedWorkflow,
  createEmbeddedWorkflowBadge,
  reconstructWorkflow
};

export default WorkflowEmbedding;
