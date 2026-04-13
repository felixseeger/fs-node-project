import { useState, useEffect, useCallback, useRef } from 'react';
import type { Unsubscribe } from 'firebase/firestore';
import type { ChatMessage, ChatConversation } from '../types/chat';
import { isFirebaseConfigured } from '../config/firebase';
import {
  createChatSession as createConversation,
  addChatMessage,
  subscribeToUserChats as subscribeToConversations,
  subscribeToChatMessages as subscribeToMessages,
  deleteChatSession as deleteConversation,
  updateChatTitle as updateConversationTitle
} from '../services/chatService';

interface UseFirebaseChatOptions {
  userId?: string;
  conversationId?: string;
  workflowId?: string;
}

export function useFirebaseChat(options: UseFirebaseChatOptions = {}) {
  const { userId, conversationId: initialConversationId, workflowId } = options;
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(initialConversationId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const isAvailable = isFirebaseConfigured();
  const unsubscribeConvRef = useRef<Unsubscribe | null>(null);
  const unsubscribeMsgRef = useRef<Unsubscribe | null>(null);

  // Subscribe to conversations list
  useEffect(() => {
    if (!isAvailable || !userId) return;
    
    setIsLoading(true);
    setError(null);
    const unsubscribe = subscribeToConversations(userId, (updatedConvs) => {
      setConversations(updatedConvs);
      setIsLoading(false);
    }, (err) => {
      setError(err);
      setIsLoading(false);
    });
    
    unsubscribeConvRef.current = unsubscribe;
    return () => unsubscribe();
  }, [userId, isAvailable]);

  // Subscribe to messages when active conversation changes
  useEffect(() => {
    if (!isAvailable || !activeConversationId) {
      setMessages([]);
      return;
    }
    
    const unsubscribe = subscribeToMessages(activeConversationId, (updatedMsgs) => {
      setMessages(updatedMsgs);
    }, (err) => {
      setError(err);
    });
    
    unsubscribeMsgRef.current = unsubscribe;
    return () => unsubscribe();
  }, [activeConversationId, isAvailable]);

  const sendMessage = useCallback(async (content: string, type: 'user' | 'assistant' = 'user', metadata?: any) => {
    if (!isAvailable || !userId) return null;
    
    try {
      let currentConvId = activeConversationId;
      
      // Auto-create conversation if none active
      if (!currentConvId) {
        currentConvId = await createConversation(userId, content.substring(0, 30), workflowId);
        setActiveConversationId(currentConvId);
      }
      
      const msgId = await addChatMessage(currentConvId, type, content, metadata);
      return msgId;
    } catch (err) {
      console.error('[useFirebaseChat] Failed to send message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      return null;
    }
  }, [userId, activeConversationId, workflowId, isAvailable]);

  const startNewConversation = useCallback(async (title: string = 'New Conversation') => {
    if (!isAvailable || !userId) return null;
    
    try {
      const id = await createConversation(userId, title, workflowId);
      setActiveConversationId(id);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start conversation'));
      return null;
    }
  }, [userId, workflowId, isAvailable]);

  const removeConversation = useCallback(async (id: string) => {
    if (!isAvailable) return;
    try {
      await deleteConversation(id);
      if (activeConversationId === id) {
        setActiveConversationId(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete conversation'));
    }
  }, [activeConversationId, isAvailable]);

  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    startNewConversation,
    removeConversation,
    isLoading,
    error
  };
}
