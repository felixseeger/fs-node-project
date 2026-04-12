/**
 * Firebase Collaboration Service
 * Handles real-time presence, cursor tracking, and action feed
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';

// Collection names
const PRESENCE_COLLECTION = 'presence';
const WORKFLOWS_COLLECTION = 'workflows';

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline';
  lastSeen: any;
  currentWorkflowId: string | null;
  cursorX?: number;
  cursorY?: number;
  lastAction?: string;
}

export interface ActionEvent {
  id?: string;
  userId: string;
  userName: string;
  userColor: string;
  action: string;
  target: string;
  timestamp: any;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  type: 'message' | 'system';
}

export interface NodeLock {
  id: string; // This will be the nodeId
  userId: string;
  userName: string;
  userColor: string;
  timestamp: any;
}

/**
 * Update user presence and cursor position
 */
export async function updatePresence(
  userId: string,
  data: Partial<Omit<Collaborator, 'id' | 'lastSeen'>>
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const presenceRef = doc(db, PRESENCE_COLLECTION, userId);

  try {
    await setDoc(presenceRef, {
      ...data,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('[CollaborationService] Update presence error:', error);
  }
}

/**
 * Set user as offline
 */
export async function setOffline(userId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const presenceRef = doc(db, PRESENCE_COLLECTION, userId);

  try {
    await updateDoc(presenceRef, {
      status: 'offline',
      currentWorkflowId: null,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    console.error('[CollaborationService] Set offline error:', error);
  }
}

/**
 * Subscribe to collaborators on a specific workflow
 */
export function subscribeToCollaborators(
  workflowId: string,
  callback: (collaborators: Collaborator[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) return () => {};

  const db = getDb();
  const presenceRef = collection(db, PRESENCE_COLLECTION);
  
  // Only get users who are online and viewing this workflow
  // and have been active in the last 5 minutes
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  const q = query(
    presenceRef,
    where('currentWorkflowId', '==', workflowId),
    where('status', '==', 'online'),
    where('lastSeen', '>=', Timestamp.fromDate(fiveMinutesAgo))
  );

  return onSnapshot(q, (snapshot) => {
    const collaborators = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Collaborator));
    callback(collaborators);
  }, (error) => {
    console.error('[CollaborationService] Collaborators subscription error:', error);
  });
}

/**
 * Acquire a lock on a node
 */
export async function acquireLock(
  workflowId: string,
  nodeId: string,
  userId: string,
  userName: string,
  userColor: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const lockRef = doc(db, WORKFLOWS_COLLECTION, workflowId, 'locks', nodeId);

  try {
    await setDoc(lockRef, {
      userId,
      userName,
      userColor,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('[CollaborationService] Acquire lock error:', error);
  }
}

/**
 * Release a lock on a node
 */
export async function releaseLock(
  workflowId: string,
  nodeId: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const lockRef = doc(db, WORKFLOWS_COLLECTION, workflowId, 'locks', nodeId);

  try {
    await deleteDoc(lockRef);
  } catch (error) {
    console.error('[CollaborationService] Release lock error:', error);
  }
}

/**
 * Subscribe to locks for a workflow
 */
export function subscribeToLocks(
  workflowId: string,
  callback: (locks: NodeLock[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) return () => {};

  const db = getDb();
  const locksRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'locks');

  return onSnapshot(locksRef, (snapshot) => {
    const locks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NodeLock));
    callback(locks);
  }, (error) => {
    console.error('[CollaborationService] Locks subscription error:', error);
  });
}

/**
 * Log an action to the live feed
 */
export async function logAction(
  workflowId: string,
  event: Omit<ActionEvent, 'timestamp'>
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const eventsRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'events');

  try {
    await addDoc(eventsRef, {
      ...event,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('[CollaborationService] Log action error:', error);
  }
}

/**
 * Subscribe to the action feed for a workflow
 */
export function subscribeToActionFeed(
  workflowId: string,
  callback: (events: ActionEvent[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) return () => {};

  const db = getDb();
  const eventsRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'events');
  
  const q = query(
    eventsRef,
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ActionEvent));
    callback(events);
  }, (error) => {
    console.error('[CollaborationService] Action feed subscription error:', error);
  });
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  workflowId: string,
  message: Omit<ChatMessage, 'timestamp'>
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  const chatRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'chat');

  try {
    await addDoc(chatRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('[CollaborationService] Send chat message error:', error);
  }
}

/**
 * Subscribe to chat messages for a workflow
 */
export function subscribeToChat(
  workflowId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) return () => {};

  const db = getDb();
  const chatRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'chat');
  
  const q = query(
    chatRef,
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage));
    callback(messages);
  }, (error) => {
    console.error('[CollaborationService] Chat subscription error:', error);
  });
}

/**
 * Clean up old events (optional utility)
 */
export async function pruneEvents(workflowId: string, keepCount: number = 100): Promise<void> {
  if (!isFirebaseConfigured()) return;
  
  const db = getDb();
  const eventsRef = collection(db, WORKFLOWS_COLLECTION, workflowId, 'events');
  const q = query(eventsRef, orderBy('timestamp', 'desc'), startAfter(keepCount));
  
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);
}
