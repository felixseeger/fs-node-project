/**
 * Workflow Service
 * Business logic for workflow management
 */
import {
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  listUserWorkflows,
  listPublicWorkflows,
  forkWorkflow,
} from '../models/workflow.js';
import { incrementWorkflowCount } from '../models/profile.js';

/**
 * Create a new workflow
 * @param {string} uid - User UID
 * @param {Object} workflowData - Workflow data
 * @returns {Promise<Object>} Created workflow
 */
export async function createUserWorkflow(uid, workflowData) {
  // Validate workflow data
  if (!workflowData.name) {
    throw new Error('Workflow name is required');
  }

  const workflow = await createWorkflow(uid, workflowData);

  // Update profile count
  await incrementWorkflowCount(uid, 1);

  return workflow;
}

/**
 * Get workflow with authorization check
 * @param {string} workflowId - Workflow ID
 * @param {string} [requestingUid] - Requesting user UID (for access control)
 * @returns {Promise<Object>} Workflow
 */
export async function getWorkflowWithAccess(workflowId, requestingUid) {
  const workflow = await getWorkflow(workflowId);

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Check access
  const isOwner = workflow.uid === requestingUid;
  const isPublic = workflow.isPublic;

  if (!isOwner && !isPublic) {
    throw new Error('Unauthorized: workflow is private');
  }

  return {
    ...workflow,
    access: isOwner ? 'owner' : 'read',
  };
}

/**
 * Update workflow with validation
 * @param {string} workflowId - Workflow ID
 * @param {string} uid - Owner UID
 * @param {Object} updates - Updates
 * @returns {Promise<Object>} Updated workflow
 */
export async function updateUserWorkflow(workflowId, uid, updates) {
  // Validate nodes and edges if provided
  if (updates.nodes) {
    if (!Array.isArray(updates.nodes)) {
      throw new Error('Nodes must be an array');
    }
    // Validate node structure
    for (const node of updates.nodes) {
      if (!node.id || !node.type) {
        throw new Error('Each node must have id and type');
      }
    }
  }

  if (updates.edges) {
    if (!Array.isArray(updates.edges)) {
      throw new Error('Edges must be an array');
    }
    for (const edge of updates.edges) {
      if (!edge.id || !edge.source || !edge.target) {
        throw new Error('Each edge must have id, source, and target');
      }
    }
  }

  return updateWorkflow(workflowId, uid, updates);
}

/**
 * Delete workflow
 * @param {string} workflowId - Workflow ID
 * @param {string} uid - Owner UID
 * @returns {Promise<void>}
 */
export async function deleteUserWorkflow(workflowId, uid) {
  await deleteWorkflow(workflowId, uid);
  // Note: Profile count decrement could be handled here or via Cloud Function
}

/**
 * Get user's workflows with pagination
 * @param {string} uid - User UID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Workflows with pagination
 */
export async function getUserWorkflows(uid, options = {}) {
  const workflows = await listUserWorkflows(uid, options);

  return {
    workflows,
    hasMore: workflows.length === (options.limit || 20),
  };
}

/**
 * Get public workflows with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Public workflows with pagination
 */
export async function getPublicWorkflowsList(options = {}) {
  const workflows = await listPublicWorkflows(options);

  return {
    workflows,
    hasMore: workflows.length === (options.limit || 20),
  };
}

/**
 * Fork a workflow
 * @param {string} workflowId - Original workflow ID
 * @param {string} uid - New owner UID
 * @returns {Promise<Object>} Forked workflow
 */
export async function forkUserWorkflow(workflowId, uid) {
  const forked = await forkWorkflow(workflowId, uid);
  await incrementWorkflowCount(uid, 1);
  return forked;
}

/**
 * Duplicate a workflow (for owner)
 * @param {string} workflowId - Workflow ID
 * @param {string} uid - Owner UID
 * @returns {Promise<Object>} Duplicated workflow
 */
export async function duplicateWorkflow(workflowId, uid) {
  const original = await getWorkflow(workflowId);

  if (!original) {
    throw new Error('Workflow not found');
  }

  if (original.uid !== uid) {
    throw new Error('Unauthorized: not workflow owner');
  }

  const duplicate = await createWorkflow(uid, {
    name: `${original.name} (copy)`,
    description: original.description,
    nodes: original.nodes,
    edges: original.edges,
    metadata: original.metadata,
    tags: original.tags,
    parentId: workflowId,
  });

  await incrementWorkflowCount(uid, 1);
  return duplicate;
}

export default {
  createUserWorkflow,
  getWorkflowWithAccess,
  updateUserWorkflow,
  deleteUserWorkflow,
  getUserWorkflows,
  getPublicWorkflowsList,
  forkUserWorkflow,
  duplicateWorkflow,
};
