import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToUserChats,
  createChatSession,
  updateChatTitle,
  deleteChatSession,
  subscribeToChatMessages,
  addChatMessage,
} from '../services/chatService';
import type { ChatSession, ChatMessage } from '../types/chat';

export function useUserChats(userId: string | undefined | null) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToUserChats(userId, (newChats) => {
        setChats(newChats);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  }, [userId]);

  const createChat = useCallback(async (title?: string) => {
    if (!userId) throw new Error('User not authenticated');
    return await createChatSession(userId, title);
  }, [userId]);

  const removeChat = useCallback(async (chatId: string) => {
    await deleteChatSession(chatId);
  }, []);

  const updateTitle = useCallback(async (chatId: string, title: string) => {
    await updateChatTitle(chatId, title);
  }, []);

  return { chats, loading, error, createChat, removeChat, updateTitle };
}

export function useChatMessages(chatId: string | undefined | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToChatMessages(chatId, (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = useCallback(async (role: 'user' | 'assistant' | 'system', content: string) => {
    if (!chatId) throw new Error('No active chat session');
    await addChatMessage(chatId, role, content);
  }, [chatId]);

  return { messages, loading, error, sendMessage };
}
