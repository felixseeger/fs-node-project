import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { getDb } from '../config/firebase';
import type { ChatMessage, ChatConversation } from '../types/chat';

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_SUBCOLLECTION = 'messages';

/**
 * Create a new conversation
 */
export async function createConversation(userId: string, title: string, workflowId?: string): Promise<string> {
  const db = getDb();
  const convRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
    userId,
    title,
    workflowId: workflowId || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isDeleted: false,
  });
  return convRef.id;
}

/**
 * Add a message to a conversation
 */
export async function addChatMessage(conversationId: string, type: 'user' | 'assistant', content: string, metadata?: any): Promise<string> {
  const db = getDb();
  
  // Add message to subcollection
  const msgRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_SUBCOLLECTION), {
    type,
    content,
    timestamp: serverTimestamp(),
    metadata: metadata || null,
  });
  
  // Update conversation last message and timestamp
  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
    lastMessage: content.substring(0, 100),
    updatedAt: serverTimestamp(),
  });
  
  return msgRef.id;
}

/**
 * List conversations for a user
 */
export function subscribeToConversations(userId: string, callback: (conversations: ChatConversation[]) => void) {
  const db = getDb();
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatConversation[];
    callback(conversations);
  });
}

/**
 * Subscribe to messages in a conversation
 */
export function subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
  const db = getDb();
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_SUBCOLLECTION),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  });
}

/**
 * Delete a conversation (soft delete)
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
    title,
    updatedAt: serverTimestamp(),
  });
}
