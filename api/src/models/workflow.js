/**
 * Workflow Model
 * Handles workflow documents in Firestore
 */
import { db } from '../config/firebase.js';

const WORKFLOWS_COLLECTION = 'workflows';

/**
 * Create a new workflow
 * @param {string} uid - Owner user ID
 * @param {Object} workflowData - Workflow data
 * @returns {Promise<Object>} Created workflow with ID
 */
export async function createWorkflow(uid, workflowData) {
  const now = new Date().toISOString();
  const workflowRef = db.collection(WORKFLOWS_COLLECTION).doc();

  const workflowDoc = {
    uid,
    name: workflowData.name || 'Untitled Workflow',
    description: workflowData.description || null,
    nodes: workflowData.nodes || [],
    edges: workflowData.edges || [],
    metadata: workflowData.metadata || {},
    thumbnailUrl: workflowData.thumbnailUrl || null,
    isPublic: workflowData.isPublic || false,
    tags: workflowData.tags || [],
    version: workflowData.version || 1,
    parentId: workflowData.parentId || null,
    createdAt: now,
    updatedAt: now,
  };

  await workflowRef.set(workflowDoc);
  return { id: workflowRef.id, ...workflowDoc };
}

/**
 * Get workflow by ID
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<Object|null>} Workflow document or null
 */
export async function getWorkflow(workflowId) {
  const workflowRef = db.collection(WORKFLOWS_COLLECTION).doc(workflowId);
  const doc = await workflowRef.get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Update workflow
 * @param {string} workflowId - Workflow ID
 * @param {string} uid - Owner user ID (for authorization)
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated workflow
 */
export async function updateWorkflow(workflowId, uid, updates) {
  const workflowRef = db.collection(WORKFLOWS_COLLECTION).doc(workflowId);
  const now = new Date().toISOString();

  // Verify ownership
  const doc = await workflowRef.get();
  if (!doc.exists) {
    throw new Error('Workflow not found');
  }

  const workflow = doc.data();
  if (workflow.uid !== uid) {
    throw new Error('Unauthorized: not workflow owner');
  }

  // Remove protected fields
  const { uid: _, createdAt, id, ...safeUpdates } = updates;

  await workflowRef.update({
    ...safeUpdates,
    updatedAt: now,
  });

  return getWorkflow(workflowId);
}

/**
 * Delete workflow
 * @param {string} workflowId - Workflow ID
 * @param {string} uid - Owner user ID (for authorization)
 * @returns {Promise<void>}
 */
export async function deleteWorkflow(workflowId, uid) {
  const workflowRef = db.collection(WORKFLOWS_COLLECTION).doc(workflowId);
  const doc = await workflowRef.get();

  if (!doc.exists) {
    throw new Error('Workflow not found');
  }

  const workflow = doc.data();
  if (workflow.uid !== uid) {
    throw new Error('Unauthorized: not workflow owner');
  }

  await workflowRef.delete();
}

/**
 * List workflows by user
 * @param {string} uid - User ID
 * @param {Object} [options] - Query options
 * @param {number} [options.limit=20] - Max results
 * @param {string} [options.cursor] - Pagination cursor
 * @param {string} [options.orderBy='updatedAt'] - Sort field
 * @param {'asc'|'desc'} [options.order='desc'] - Sort direction
 * @returns {Promise<Object[]>} Array of workflows
 */
export async function listUserWorkflows(uid, { limit = 20, cursor, orderBy = 'updatedAt', order = 'desc' } = {}) {
  let query = db.collection(WORKFLOWS_COLLECTION)
    .where('uid', '==', uid)
    .orderBy(orderBy, order)
    .limit(limit);

  if (cursor) {
    const cursorDoc = await db.collection(WORKFLOWS_COLLECTION).doc(cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * List public workflows (for discovery)
 * @param {Object} [options] - Query options
 * @param {number} [options.limit=20] - Max results
 * @param {string} [options.cursor] - Pagination cursor
 * @param {string[]} [options.tags] - Filter by tags
 * @returns {Promise<Object[]>} Array of public workflows
 */
export async function listPublicWorkflows({ limit = 20, cursor, tags } = {}) {
  let query = db.collection(WORKFLOWS_COLLECTION)
    .where('isPublic', '==', true)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (tags && tags.length > 0) {
    query = query.where('tags', 'array-contains-any', tags.slice(0, 10));
  }

  if (cursor) {
    const cursorDoc = await db.collection(WORKFLOWS_COLLECTION).doc(cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fork a workflow (create a copy owned by current user)
 * @param {string} workflowId - Original workflow ID
 * @param {string} newUid - New owner UID
 * @returns {Promise<Object>} Forked workflow
 */
export async function forkWorkflow(workflowId, newUid) {
  const original = await getWorkflow(workflowId);
  if (!original) {
    throw new Error('Workflow not found');
  }

  if (!original.isPublic) {
    throw new Error('Cannot fork private workflow');
  }

  return createWorkflow(newUid, {
    name: `${original.name} (fork)`,
    description: original.description,
    nodes: original.nodes,
    edges: original.edges,
    metadata: original.metadata,
    tags: original.tags,
    parentId: workflowId,
  });
}

export default {
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  listUserWorkflows,
  listPublicWorkflows,
  forkWorkflow,
};
