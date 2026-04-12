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
}

/**
 * Workflow validation result
 */
export interface WorkflowValidation {
  valid: boolean;
  errors: string[];
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

/**
 * Generate workflow from text prompt
 */
export function generateWorkflowFromPrompt(
  params: GenerateWorkflowParams
): Promise<GeneratedWorkflow>;

/**
 * Validate workflow structure
 */
export function validateWorkflow(workflow: GeneratedWorkflow): WorkflowValidation;
