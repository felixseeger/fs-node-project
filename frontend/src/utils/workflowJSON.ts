/**
 * Workflow JSON Import/Export Test Utilities
 * 
 * Comprehensive testing utilities for importing and exporting workflows
 * between ChatUI and the canvas.
 * 
 * Features:
 * - Export generated workflows to JSON files
 * - Import workflows from JSON files to canvas
 * - Validate workflow structure and integrity
 * - Test round-trip import/export cycles
 * - Generate test workflow samples
 */

import type { Workflow, WorkflowEdge } from '../types/workflow';
import type { NodeData } from '../types/nodes';
import { type Node } from '@xyflow/react';

// =============================================================================
// Constants
// =============================================================================

export const WORKFLOW_JSON_VERSION = '1.0';

export const WORKFLOW_EXPORT_FORMAT = {
  version: WORKFLOW_JSON_VERSION,
  exportedAt: '',
  source: 'ChatUI',
  workflow: {
    name: '',
    description: '',
    nodes: [],
    edges: [],
  },
};

// =============================================================================
// Validation Schemas
// =============================================================================

/**
 * Validate basic workflow JSON structure
 */
export function validateWorkflowJSON(json: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Parse JSON
  let data: any;
  try {
    data = JSON.parse(json);
  } catch (error) {
    return {
      valid: false,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }

  // Check version
  if (!data.version) {
    errors.push('Missing "version" field');
  } else if (data.version !== WORKFLOW_JSON_VERSION) {
    errors.push(`Unsupported version: ${data.version} (expected ${WORKFLOW_JSON_VERSION})`);
  }

  // Check workflow object
  if (!data.workflow) {
    errors.push('Missing "workflow" object');
    return { valid: false, errors };
  }

  // Check required fields
  if (!data.workflow.name && typeof data.workflow.name !== 'string') {
    errors.push('Missing or invalid "workflow.name"');
  }

  if (!Array.isArray(data.workflow.nodes)) {
    errors.push('"workflow.nodes" must be an array');
  }

  if (!Array.isArray(data.workflow.edges)) {
    errors.push('"workflow.edges" must be an array');
  }

  // Validate nodes
  if (Array.isArray(data.workflow.nodes)) {
    data.workflow.nodes.forEach((node: any, index: number) => {
      if (!node.id) {
        errors.push(`Node at index ${index} missing "id"`);
      }
      if (!node.type) {
        errors.push(`Node at index ${index} missing "type"`);
      }
      if (!node.position || !node.position.x || !node.position.y) {
        errors.push(`Node at index ${index} missing valid "position"`);
      }
    });
  }

  // Validate edges
  if (Array.isArray(data.workflow.edges)) {
    data.workflow.edges.forEach((edge: any, index: number) => {
      if (!edge.id) {
        errors.push(`Edge at index ${index} missing "id"`);
      }
      if (!edge.source) {
        errors.push(`Edge at index ${index} missing "source"`);
      }
      if (!edge.target) {
        errors.push(`Edge at index ${index} missing "target"`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate node structure
 */
export function validateNode(node: Node<NodeData>): string[] {
  const errors: string[] = [];

  if (!node.id) errors.push('Node missing ID');
  if (!node.type) errors.push(`Node ${node.id || 'unknown'} missing type`);
  if (!node.position) errors.push(`Node ${node.id || 'unknown'} missing position`);
  if (!node.data || !node.data.label) errors.push(`Node ${node.id || 'unknown'} missing label`);

  return errors;
}

/**
 * Validate edge structure
 */
export function validateEdge(edge: WorkflowEdge, nodeIds: Set<string>): string[] {
  const errors: string[] = [];

  if (!edge.id) errors.push('Edge missing ID');
  if (!edge.source) errors.push(`Edge ${edge.id || 'unknown'} missing source`);
  if (!edge.target) errors.push(`Edge ${edge.id || 'unknown'} missing target`);
  
  if (edge.source && !nodeIds.has(edge.source)) {
    errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
  }
  if (edge.target && !nodeIds.has(edge.target)) {
    errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
  }

  return errors;
}

// =============================================================================
// Export Functions
// =============================================================================

/**
 * Export workflow to JSON string
 */
export function exportWorkflowToJSON(
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
): string {
  const exportData = {
    version: WORKFLOW_JSON_VERSION,
    exportedAt: new Date().toISOString(),
    source: 'ChatUI',
    workflow: {
      name: workflow.name || 'AI Generated Workflow',
      description: workflow.description || '',
      nodes: workflow.nodes,
      edges: workflow.edges || [],
      thumbnail: workflow.thumbnail || null,
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export workflow to downloadable JSON file
 */
export function exportWorkflowToFile(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): void {
  const jsonString = exportWorkflowToJSON(workflow);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFileName(workflow.name || 'workflow')}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename for export
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}

// =============================================================================
// Import Functions
// =============================================================================

/**
 * Import workflow from JSON string
 */
export function importWorkflowFromJSON(json: string): Omit<Workflow, 'id'> | null {
  try {
    // Validate first
    const validation = validateWorkflowJSON(json);
    if (!validation.valid) {
      console.error('[WorkflowImport] Validation errors:', validation.errors);
      return null;
    }

    const data = JSON.parse(json);

    return {
      name: data.workflow.name || 'Imported Workflow',
      description: data.workflow.description || '',
      nodes: data.workflow.nodes,
      edges: data.workflow.edges || [],
      thumbnail: data.workflow.thumbnail || undefined,
    };
  } catch (error) {
    console.error('[WorkflowImport] Import error:', error);
    return null;
  }
}

/**
 * Import workflow from file input
 */
export function importWorkflowFromFile(file: File): Promise<Omit<Workflow, 'id'> | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const workflow = importWorkflowFromJSON(json);
        resolve(workflow);
      } catch (error) {
        console.error('[WorkflowImport] File read error:', error);
        resolve(null);
      }
    };

    reader.onerror = () => {
      console.error('[WorkflowImport] Failed to read file');
      resolve(null);
    };

    reader.readAsText(file);
  });
}

/**
 * Open file picker for workflow import
 */
export function openFilePicker(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0] || null;
      resolve(file);
    };

    input.click();
  });
}

// =============================================================================
// Test Utilities
// =============================================================================

/**
 * Generate a test workflow for testing import/export
 */
export function generateTestWorkflow(): Omit<Workflow, 'id'> {
  return {
    name: 'Test Workflow',
    description: 'A test workflow for import/export testing',
    nodes: [
      {
        id: 'test_node_1',
        type: 'input',
        position: { x: 100, y: 100 },
        data: {
          label: 'Test Input',
          prompt: 'Test prompt',
        } as NodeData,
      },
      {
        id: 'test_node_2',
        type: 'generator',
        position: { x: 400, y: 100 },
        data: {
          label: 'Test Generator',
          model: 'test-model',
        } as NodeData,
      },
      {
        id: 'test_node_3',
        type: 'response',
        position: { x: 700, y: 100 },
        data: {
          label: 'Test Output',
        } as NodeData,
      },
    ],
    edges: [
      {
        id: 'e-test_node_1-output-test_node_2-prompt-in',
        source: 'test_node_1',
        target: 'test_node_2',
        sourceHandle: 'output',
        targetHandle: 'prompt-in',
        style: { stroke: '#ec4899', strokeWidth: 2 },
      },
      {
        id: 'e-test_node_2-output-test_node_3-input',
        source: 'test_node_2',
        target: 'test_node_3',
        sourceHandle: 'output',
        targetHandle: 'input',
        style: { stroke: '#ec4899', strokeWidth: 2 },
      },
    ],
  };
}

/**
 * Test round-trip export/import
 */
export function testRoundTrip(workflow: Omit<Workflow, 'id'>): { success: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // Export
    const jsonString = exportWorkflowToJSON(workflow);
    
    // Validate
    const validation = validateWorkflowJSON(jsonString);
    if (!validation.valid) {
      errors.push(...validation.errors);
      return { success: false, errors };
    }

    // Import
    const imported = importWorkflowFromJSON(jsonString);
    if (!imported) {
      errors.push('Failed to import workflow after export');
      return { success: false, errors };
    }

    // Compare
    if (imported.name !== workflow.name) {
      errors.push(`Name mismatch: expected "${workflow.name}", got "${imported.name}"`);
    }

    if (imported.nodes.length !== workflow.nodes.length) {
      errors.push(`Node count mismatch: expected ${workflow.nodes.length}, got ${imported.nodes.length}`);
    }

    if (imported.edges.length !== workflow.edges.length) {
      errors.push(`Edge count mismatch: expected ${workflow.edges.length}, got ${imported.edges.length}`);
    }

    return {
      success: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Round-trip test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, errors };
  }
}

/**
 * Count nodes by type in workflow
 */
export function getNodeStats(workflow: Omit<Workflow, 'id'>): Record<string, number> {
  const stats: Record<string, number> = {};
  
  workflow.nodes.forEach((node) => {
    const type = node.type || 'unknown';
    stats[type] = (stats[type] || 0) + 1;
  });

  return stats;
}

/**
 * Get workflow summary for logging
 */
export function getWorkflowSummary(workflow: Omit<Workflow, 'id'>): string {
  const stats = getNodeStats(workflow);
  const nodeTypes = Object.entries(stats)
    .map(([type, count]) => `${count}x ${type}`)
    .join(', ');

  return `Workflow "${workflow.name}": ${workflow.nodes.length} nodes (${nodeTypes}), ${workflow.edges.length} edges`;
}

// =============================================================================
// ChatUI Integration Helpers
// =============================================================================

/**
 * Prepare workflow for export from ChatUI generation result
 */
export function prepareWorkflowForExport(
  result: { workflow?: { name?: string; nodes: Node<NodeData>[]; edges: WorkflowEdge[] } } | null
): Omit<Workflow, 'id'> | null {
  if (!result?.workflow) {
    return null;
  }

  return {
    name: result.workflow.name || 'AI Generated Workflow',
    description: 'Generated by ChatUI AI Assistant',
    nodes: result.workflow.nodes,
    edges: result.workflow.edges || [],
  };
}

/**
 * Handle workflow import and prepare for canvas display
 */
export function handleImportedWorkflow(
  workflow: Omit<Workflow, 'id'> | null,
  callbacks: {
    onSetNodes?: (nodes: Node<NodeData>[]) => void;
    onSetEdges?: (edges: WorkflowEdge[]) => void;
    onSaveToFirebase?: (workflow: Omit<Workflow, 'id'>) => Promise<void>;
    onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
  }
): void {
  if (!workflow) {
    callbacks.onNotify?.('Failed to import workflow: Invalid format', 'error');
    return;
  }

  try {
    // Validate nodes and edges
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    const nodeErrors = workflow.nodes.flatMap(validateNode);
    const edgeErrors = workflow.edges.flatMap(e => validateEdge(e, nodeIds));

    if (nodeErrors.length > 0 || edgeErrors.length > 0) {
      const allErrors = [...nodeErrors, ...edgeErrors];
      console.warn('[WorkflowImport] Validation warnings:', allErrors);
      callbacks.onNotify?.(`Imported with ${allErrors.length} warning(s)`, 'info');
    }

    // Set on canvas
    callbacks.onSetNodes?.(workflow.nodes);
    callbacks.onSetEdges?.(workflow.edges);

    // Optional: Save to Firebase
    // callbacks.onSaveToFirebase?.(workflow);

    const summary = getWorkflowSummary(workflow);
    callbacks.onNotify?.(`Imported: ${summary}`, 'success');
  } catch (error) {
    console.error('[WorkflowImport] Error applying workflow:', error);
    callbacks.onNotify?.('Failed to apply imported workflow', 'error');
  }
}
