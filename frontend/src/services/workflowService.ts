/**
 * Firebase Workflow Service
 * Persistent storage for workflows using Firestore
 * Features: CRUD, real-time sync, offline support, versioning
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
  onSnapshot,
  type Unsubscribe,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import type { Workflow } from '../types/workflow';
import { processAssetsInObject } from './storageService';

// Collection name
const WORKFLOWS_COLLECTION = 'workflows';

/**
 * Convert Firestore timestamp to ISO string
 */
function timestampToString(timestamp: Timestamp | null | undefined): string | undefined {
  if (!timestamp) return undefined;
  return timestamp.toDate().toISOString();
}

/**
 * Serialize workflow for Firestore (handle non-serializable data)
 */
function serializeWorkflow(workflow: Omit<Workflow, 'id'>): DocumentData {
  return {
    name: workflow.name,
    description: workflow.description || '',
    nodes: JSON.parse(JSON.stringify(workflow.nodes)),
    edges: JSON.parse(JSON.stringify(workflow.edges || [])),
    thumbnail: workflow.thumbnail || null,
    nodeCount: (workflow.nodes || []).length,
    updatedAt: serverTimestamp(),
    isPublic: workflow.isPublic || false,
    authorName: workflow.authorName || null,
    sharedWith: workflow.sharedWith || [],
  };
}

/**
 * Deserialize workflow from Firestore
 */
function deserializeWorkflow(id: string, data: DocumentData): Workflow {
  return {
    id,
    name: data.name,
    description: data.description,
    nodes: data.nodes || [],
    edges: data.edges || [],
    thumbnail: data.thumbnail,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
    isPublic: data.isPublic || false,
    authorName: data.authorName,
    sharedWith: data.sharedWith || [],
    userId: data.userId,
  };
}

// =============================================================================
// CRUD Operations
// =============================================================================

/**
 * Create a new workflow
 * @param userId - Owner's user ID
 * @param workflow - Workflow data (without id)
 * @returns Created workflow with ID
 */
export async function createWorkflow(
  userId: string,
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Workflow> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);
  
  // Upload any local assets to Firebase Storage before saving
  const processedWorkflow = await processAssetsInObject(workflow);

  const workflowData = {
    ...serializeWorkflow(processedWorkflow),
    userId,
    createdAt: serverTimestamp(),
    isDeleted: false,
    version: 1,
  };

  // Race the Firestore write against a timeout to prevent hanging
  // when security rules deny the write (offline persistence queues it silently)
  const docRef = await Promise.race([
    addDoc(workflowsRef, workflowData),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timed out after 10s')), 10000)
    ),
  ]);

  console.log('[WorkflowService] Created workflow:', docRef.id);
  
  return {
    id: docRef.id,
    name: workflow.name,
    description: workflow.description,
    nodes: workflow.nodes,
    edges: workflow.edges,
    thumbnail: workflow.thumbnail,
  };
}

/**
 * Get a workflow by ID
 * @param workflowId - Workflow ID
 * @returns Workflow or null if not found
 */
export async function getWorkflow(workflowId: string): Promise<Workflow | null> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);
  const snapshot = await getDoc(workflowRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  if (data.isDeleted) {
    return null;
  }

  return deserializeWorkflow(snapshot.id, data);
}

/**
 * Update an existing workflow
 * @param workflowId - Workflow ID
 * @param updates - Partial workflow updates
 * @param userId - User making the update (for permissions)
 */
export async function updateWorkflow(
  workflowId: string,
  updates: Partial<Omit<Workflow, 'id'>>,
  userId?: string
): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);

  // Optional: Check ownership before updating
  if (userId) {
    const snapshot = await getDoc(workflowRef);
    if (!snapshot.exists()) {
      throw new Error('Workflow not found');
    }
    const data = snapshot.data();
    if (data.userId !== userId) {
      throw new Error('Permission denied: not workflow owner');
    }
  }

  const updateData: DocumentData = {
    updatedAt: serverTimestamp(),
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;

  // Process nodes and edges to upload any local assets
  let processedNodes = updates.nodes;
  let processedEdges = updates.edges;
  if (updates.nodes !== undefined || updates.edges !== undefined) {
    const processed = await processAssetsInObject({ nodes: updates.nodes, edges: updates.edges });
    if (updates.nodes !== undefined) processedNodes = processed.nodes;
    if (updates.edges !== undefined) processedEdges = processed.edges;
  }

  if (processedNodes !== undefined) {
    updateData.nodes = JSON.parse(JSON.stringify(processedNodes));
    updateData.nodeCount = processedNodes.length;
  }
  if (processedEdges !== undefined) {
    updateData.edges = JSON.parse(JSON.stringify(processedEdges));
  }
  if (updates.thumbnail !== undefined) updateData.thumbnail = updates.thumbnail;

  // Increment version
  updateData.version = (await getDoc(workflowRef)).data()?.version || 1;
  updateData.version += 1;
await updateDoc(workflowRef, updateData);

console.log('[WorkflowService] Updated workflow:', workflowId);
}

/**
* Toggle workflow public status
*/
export async function toggleWorkflowPublic(
workflowId: string,
isPublic: boolean,
authorName?: string
): Promise<void> {
if (!isFirebaseConfigured()) {
  throw new Error('Firebase not configured');
}

const db = getDb();
const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);

await updateDoc(workflowRef, {
  isPublic,
  authorName: authorName || null,
  updatedAt: serverTimestamp(),
});

console.log('[WorkflowService] Toggled public status for:', workflowId, isPublic);
}

/**
* Soft delete a workflow
...
 * @param workflowId - Workflow ID
 * @param userId - User making the delete (for permissions)
 */
export async function deleteWorkflow(workflowId: string, userId?: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);

  // Optional: Check ownership
  if (userId) {
    const snapshot = await getDoc(workflowRef);
    if (!snapshot.exists()) {
      throw new Error('Workflow not found');
    }
    const data = snapshot.data();
    if (data.userId !== userId) {
      throw new Error('Permission denied: not workflow owner');
    }
  }

  await updateDoc(workflowRef, {
    isDeleted: true,
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log('[WorkflowService] Soft deleted workflow:', workflowId);
}

/**
 * Permanently delete a workflow
 * @param workflowId - Workflow ID
 */
export async function permanentlyDeleteWorkflow(workflowId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);
  await deleteDoc(workflowRef);

  console.log('[WorkflowService] Permanently deleted workflow:', workflowId);
}

// =============================================================================
// Query Operations
// =============================================================================

export interface ListWorkflowsOptions {
  userId?: string;
  limit?: number;
  orderByField?: 'createdAt' | 'updatedAt' | 'name';
  orderDirection?: 'asc' | 'desc';
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>;
  includeDeleted?: boolean;
}

export interface ListWorkflowsResult {
  workflows: Workflow[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * List workflows with pagination
 */
export async function listWorkflows(
  options: ListWorkflowsOptions = {}
): Promise<ListWorkflowsResult> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);

  // Build query
  let q = query(workflowsRef);

  // Filter by user
  if (options.userId) {
    q = query(q, where('userId', '==', options.userId));
  }

  // Filter deleted
  if (!options.includeDeleted) {
    q = query(q, where('isDeleted', '==', false));
  }

  // Order by
  const orderField = options.orderByField || 'updatedAt';
  const orderDir = options.orderDirection || 'desc';
  q = query(q, orderBy(orderField, orderDir));

  // Pagination
  const pageLimit = options.limit || 20;
  q = query(q, limit(pageLimit + 1)); // +1 to check if there are more

  // Start after for pagination
  if (options.startAfterDoc) {
    q = query(q, startAfter(options.startAfterDoc));
  }

  const snapshot = await getDocs(q);
  const docs = snapshot.docs;

  // Check if there are more results
  const hasMore = docs.length > pageLimit;
  const workflowsDocs = hasMore ? docs.slice(0, pageLimit) : docs;

  const workflows = workflowsDocs.map(doc => 
    deserializeWorkflow(doc.id, doc.data())
  );

  return {
    workflows,
    lastDoc: workflowsDocs.length > 0 ? workflowsDocs[workflowsDocs.length - 1] : null,
    hasMore,
  };
}

/**
 * Search workflows by name
 */
export async function searchWorkflows(
  searchTerm: string,
  userId?: string,
  limitCount: number = 20
): Promise<Workflow[]> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  // Note: Firestore doesn't support text search natively
  // For production, consider Algolia or Elasticsearch
  // This is a simple prefix search workaround

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);

  let q = query(
    workflowsRef,
    where('isDeleted', '==', false),
    orderBy('name'),
    limit(limitCount * 2) // Get more to filter
  );

  if (userId) {
    q = query(q, where('userId', '==', userId));
  }

  const snapshot = await getDocs(q);
  const searchLower = searchTerm.toLowerCase();

  return snapshot.docs
    .map(doc => deserializeWorkflow(doc.id, doc.data()))
    .filter(wf => wf.name.toLowerCase().includes(searchLower))
    .slice(0, limitCount);
}

// =============================================================================
// Real-time Subscriptions
// =============================================================================

/**
 * Subscribe to a single workflow's changes
 * @param workflowId - Workflow ID
 * @param callback - Function called when workflow changes
 * @returns Unsubscribe function
 */
export function subscribeToWorkflow(
  workflowId: string,
  callback: (workflow: Workflow | null) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);

  return onSnapshot(workflowRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    const data = snapshot.data();
    if (data.isDeleted) {
      callback(null);
      return;
    }

    callback(deserializeWorkflow(snapshot.id, data));
  }, (error) => {
    console.error('[WorkflowService] Subscription error:', error);
    callback(null);
  });
}

/**
 * Subscribe to user's workflows list
 * @param userId - User ID
 * @param callback - Function called when workflows change
 * @returns Unsubscribe function
 */
export function subscribeToUserWorkflows(
  userId: string,
  callback: (workflows: Workflow[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);
  const q = query(
    workflowsRef,
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const workflows = snapshot.docs.map(doc => 
      deserializeWorkflow(doc.id, doc.data())
    );
    callback(workflows);
  }, (error) => {
    console.error('[WorkflowService] Subscription error:', error);
    callback([]);
  });
}

/**
 * Subscribe to public (community) workflows
 * @param callback - Function called when workflows change
 * @returns Unsubscribe function
 */
export function subscribeToPublicWorkflows(
  callback: (workflows: Workflow[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);
  const q = query(
    workflowsRef,
    where('isPublic', '==', true),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const workflows = snapshot.docs.map(doc => 
      deserializeWorkflow(doc.id, doc.data())
    );
    callback(workflows);
  }, (error) => {
    console.error('[WorkflowService] Public subscription error:', error);
    callback([]);
  });
}

// =============================================================================
// Sharing Operations
// =============================================================================

/**
 * Share a workflow with a user by email
 */
export async function shareWorkflow(
  workflowId: string,
  ownerUserId: string,
  email: string
): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);
  const snapshot = await getDoc(workflowRef);

  if (!snapshot.exists()) throw new Error('Workflow not found');
  const data = snapshot.data();
  if (data.userId !== ownerUserId) throw new Error('Permission denied: not workflow owner');

  const current: string[] = data.sharedWith || [];
  const normalized = email.trim().toLowerCase();
  if (current.includes(normalized)) return;

  await updateDoc(workflowRef, {
    sharedWith: [...current, normalized],
    updatedAt: serverTimestamp(),
  });

  console.log('[WorkflowService] Shared workflow', workflowId, 'with', normalized);
}

/**
 * Unshare a workflow (remove a user's email)
 */
export async function unshareWorkflow(
  workflowId: string,
  ownerUserId: string,
  email: string
): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');

  const db = getDb();
  const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);
  const snapshot = await getDoc(workflowRef);

  if (!snapshot.exists()) throw new Error('Workflow not found');
  const data = snapshot.data();
  if (data.userId !== ownerUserId) throw new Error('Permission denied: not workflow owner');

  const current: string[] = data.sharedWith || [];
  const normalized = email.trim().toLowerCase();

  await updateDoc(workflowRef, {
    sharedWith: current.filter(e => e !== normalized),
    updatedAt: serverTimestamp(),
  });

  console.log('[WorkflowService] Unshared workflow', workflowId, 'from', normalized);
}

/**
 * Subscribe to workflows shared with a specific email
 */
export function subscribeToSharedWorkflows(
  email: string,
  callback: (workflows: Workflow[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);
  const normalized = email.trim().toLowerCase();
  const q = query(
    workflowsRef,
    where('sharedWith', 'array-contains', normalized),
    where('isDeleted', '==', false),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const workflows = snapshot.docs
      .map(d => deserializeWorkflow(d.id, d.data()))
      .sort((a, b) => {
        const aTime = a.updatedAt ? Date.parse(a.updatedAt) : 0;
        const bTime = b.updatedAt ? Date.parse(b.updatedAt) : 0;
        return bTime - aTime;
      });
    callback(workflows);
  }, (error) => {
    console.error('[WorkflowService] Shared subscription error:', error);
    callback([]);
  });
}

// =============================================================================
// Batch Operations
// =============================================================================

/**
 * Duplicate a workflow
 * @param workflowId - Workflow ID to duplicate
 * @param userId - New owner user ID
 * @returns New workflow ID
 */
export async function duplicateWorkflow(
  workflowId: string,
  userId: string
): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const original = await getWorkflow(workflowId);
  if (!original) {
    throw new Error('Workflow not found');
  }

  const newWorkflow = await createWorkflow(userId, {
    name: `${original.name} (Copy)`,
    description: original.description,
    nodes: original.nodes,
    edges: original.edges,
    thumbnail: original.thumbnail,
  });

  return newWorkflow.id;
}

/**
 * Bulk delete workflows
 * @param workflowIds - Array of workflow IDs
 */
export async function bulkDeleteWorkflows(workflowIds: string[]): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const batch = writeBatch(db);

  for (const workflowId of workflowIds) {
    const workflowRef = doc(db, WORKFLOWS_COLLECTION, workflowId);
    batch.update(workflowRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  console.log('[WorkflowService] Bulk deleted workflows:', workflowIds.length);
}

// =============================================================================
// Import/Export
// =============================================================================

/**
 * Export workflow as JSON
 */
export function exportWorkflowToJSON(workflow: Workflow): string {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    workflow: {
      name: workflow.name,
      description: workflow.description,
      nodes: workflow.nodes,
      edges: workflow.edges,
    },
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import workflow from JSON
 */
export function importWorkflowFromJSON(json: string): Omit<Workflow, 'id'> | null {
  try {
    const data = JSON.parse(json);
    
    // Validate structure
    if (!data.workflow || !data.workflow.nodes || !data.workflow.edges) {
      throw new Error('Invalid workflow format');
    }

    return {
      name: data.workflow.name || 'Imported Workflow',
      description: data.workflow.description,
      nodes: data.workflow.nodes,
      edges: data.workflow.edges,
      thumbnail: data.workflow.thumbnail,
    };
  } catch (error) {
    console.error('[WorkflowService] Import error:', error);
    return null;
  }
}

// =============================================================================
// Statistics
// =============================================================================

export interface WorkflowStats {
  totalWorkflows: number;
  totalNodes: number;
  recentWorkflows: number;
  popularNodeTypes: Array<{ type: string; count: number }>;
}

/**
 * Get user workflow statistics
 */
export async function getWorkflowStats(userId: string): Promise<WorkflowStats> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  const db = getDb();
  const workflowsRef = collection(db, WORKFLOWS_COLLECTION);
  const q = query(
    workflowsRef,
    where('userId', '==', userId),
    where('isDeleted', '==', false)
  );

  const snapshot = await getDocs(q);
  const workflows = snapshot.docs.map(doc => doc.data());

  // Calculate stats
  const totalNodes = workflows.reduce((sum, wf) => sum + (wf.nodeCount || 0), 0);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentWorkflows = workflows.filter(wf => {
    const updatedAt = wf.updatedAt?.toDate?.();
    return updatedAt && updatedAt > oneWeekAgo;
  }).length;

  // Count node types
  const nodeTypeCounts: Record<string, number> = {};
  workflows.forEach(wf => {
    (wf.nodes || []).forEach((node: any) => {
      nodeTypeCounts[node.type] = (nodeTypeCounts[node.type] || 0) + 1;
    });
  });

  const popularNodeTypes = Object.entries(nodeTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalWorkflows: workflows.length,
    totalNodes,
    recentWorkflows,
    popularNodeTypes,
  };
}

export interface WorkflowSnapshot {
  id: string;
  workflowId: string;
  timestamp: number;
  label: string;
  nodes: any[];
  edges: any[];
}

/**
 * Save a workflow snapshot to a subcollection
 */
export async function saveWorkflowSnapshot(workflowId: string, snapshot: Omit<WorkflowSnapshot, 'id' | 'workflowId' | 'timestamp'>): Promise<string> {
  const db = getDb();
  if (!db) throw new Error('Firebase not initialized');

  const snapshotRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'snapshots');
  const docRef = await addDoc(snapshotRef, {
    ...snapshot,
    timestamp: serverTimestamp()
  });
  
  return docRef.id;
}

/**
 * Fetch all snapshots for a workflow
 */
export async function getWorkflowSnapshots(workflowId: string): Promise<WorkflowSnapshot[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const snapshotsRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'snapshots');
    const q = query(snapshotsRef, orderBy('timestamp', 'desc'));
    const snapshotQuery = await getDocs(q);
    
    return snapshotQuery.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        workflowId,
        timestamp: data.timestamp?.toMillis() || Date.now(),
        label: data.label || 'Snapshot',
        nodes: data.nodes || [],
        edges: data.edges || []
      };
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return [];
  }
}

/**
 * Clear all snapshots for a workflow
 */
export async function clearWorkflowSnapshots(workflowId: string): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    const snapshotsRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'snapshots');
    const snapshotQuery = await getDocs(snapshotsRef);
    
    const batch = writeBatch(db);
    snapshotQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error clearing snapshots:', error);
  }
}
