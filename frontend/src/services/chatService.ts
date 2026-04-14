import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import type { ChatSession, ChatMessage } from '../types/chat';

const AI_CHATS_COLLECTION = 'ai_chats';

// --- CHAT SESSIONS ---

export function subscribeToUserChats(
  userId: string, 
  callback: (chats: ChatSession[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const q = query(
    collection(db, AI_CHATS_COLLECTION),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as ChatSession;
    });
    callback(chats);
  }, (error) => {
    console.error('[ChatService] Error subscribing to user chats:', error);
    if (onError) onError(error);
  });
}

export async function createChatSession(userId: string, title: string = 'New Conversation', workflowId?: string): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const data: any = {
    userId,
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (workflowId !== undefined) {
    data.workflowId = workflowId;
  }
  
  const chatRef = await addDoc(collection(db, AI_CHATS_COLLECTION), data);
  
  return chatRef.id;
}

export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  await updateDoc(doc(db, AI_CHATS_COLLECTION, chatId), { 
    title,
    updatedAt: serverTimestamp() 
  });
}

export async function deleteChatSession(chatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  // NOTE: In production, consider a cloud function to delete subcollections (messages),
  // or handle cleanup on the client if necessary.
  await deleteDoc(doc(db, AI_CHATS_COLLECTION, chatId));
}

// --- MESSAGES ---

export function subscribeToChatMessages(
  chatId: string, 
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const q = query(
    collection(db, AI_CHATS_COLLECTION, chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      } as ChatMessage;
    });
    callback(messages);
  }, (error) => {
    console.error(`[ChatService] Error subscribing to messages for chat ${chatId}:`, error);
    if (onError) onError(error);
  });
}

export async function addChatMessage(chatId: string, role: 'user' | 'assistant' | 'system', content: string, metadata?: any): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const data: any = {
    role,
    content,
    createdAt: serverTimestamp(),
  };
  
  if (metadata !== undefined) {
    data.metadata = metadata;
  }
  
  // Add the message
  const msgRef = await addDoc(collection(db, AI_CHATS_COLLECTION, chatId, 'messages'), data);
  
  // Update the parent chat's updatedAt timestamp
  await updateDoc(doc(db, AI_CHATS_COLLECTION, chatId), {
    updatedAt: serverTimestamp(),
  });

  return msgRef.id;
}
