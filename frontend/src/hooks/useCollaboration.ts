/**
 * React Hook for Real-time Collaboration
 * Tracks presence, cursors, and live action feed
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  updatePresence, 
  setOffline, 
  subscribeToCollaborators, 
  subscribeToActionFeed,
  subscribeToChat,
  subscribeToLocks,
  acquireLock,
  releaseLock,
  logAction,
  sendChatMessage,
  type Collaborator,
  type ActionEvent,
  type ChatMessage,
  type NodeLock
} from '../services/collaborationService';
import { isFirebaseConfigured } from '../config/firebase';

interface UseCollaborationOptions {
  workflowId: string | null;
  userId: string | null;
  userName?: string;
  userAvatar?: string;
  userColor?: string;
  enabled?: boolean;
}

export function useCollaboration({
  workflowId,
  userId,
  userName = 'Anonymous',
  userAvatar = 'U',
  userColor = '#3b82f6',
  enabled = true
}: UseCollaborationOptions) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [actionFeed, setActionFeed] = useState<ActionEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [locks, setLocks] = useState<NodeLock[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const isAvailable = isFirebaseConfigured() && enabled;

  // 1. Handle user presence and lifecycle
  useEffect(() => {
    if (!isAvailable || !userId || !workflowId) return;

    // Set user as online when joining
    updatePresence(userId, {
      name: userName,
      avatar: userAvatar,
      color: userColor,
      status: 'online',
      currentWorkflowId: workflowId,
    });

    // Cleanup on unmount or when workflow changes
    return () => {
      setOffline(userId);
    };
  }, [isAvailable, userId, workflowId, userName, userAvatar, userColor]);

  // 2. Subscribe to other collaborators
  useEffect(() => {
    if (!isAvailable || !workflowId) return;

    const unsubscribe = subscribeToCollaborators(workflowId, (updatedCollaborators) => {
      // Filter out current user from the list
      setCollaborators(updatedCollaborators.filter(c => c.id !== userId));
    });

    return unsubscribe;
  }, [isAvailable, workflowId, userId]);

  // 3. Subscribe to live action feed
  useEffect(() => {
    if (!isAvailable || !workflowId) return;

    const unsubscribe = subscribeToActionFeed(workflowId, (events) => {
      setActionFeed(events);
    });

    return unsubscribe;
  }, [isAvailable, workflowId]);

  // 4. Subscribe to chat messages
  useEffect(() => {
    if (!isAvailable || !workflowId) return;

    const unsubscribe = subscribeToChat(workflowId, (newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [isAvailable, workflowId]);

  // 5. Subscribe to node locks
  useEffect(() => {
    if (!isAvailable || !workflowId) return;

    const unsubscribe = subscribeToLocks(workflowId, (updatedLocks) => {
      setLocks(updatedLocks);
    });

    return unsubscribe;
  }, [isAvailable, workflowId]);

  /**
   * Manually update cursor position in canvas space
   */
  const updateCursor = useCallback((x: number, y: number) => {
    if (!isAvailable || !userId || !workflowId) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 200) return; // Cursor updates are frequent, throttle more
    lastUpdateRef.current = now;

    updatePresence(userId, {
      cursorX: x,
      cursorY: y,
    });
  }, [isAvailable, userId, workflowId]);

  /**
   * Lock a node for editing
   */
  const lockNode = useCallback((nodeId: string) => {
    if (!isAvailable || !userId || !workflowId) return;
    acquireLock(workflowId, nodeId, userId, userName, userColor);
  }, [isAvailable, userId, workflowId, userName, userColor]);

  /**
   * Unlock a node
   */
  const unlockNode = useCallback((nodeId: string) => {
    if (!isAvailable || !userId || !workflowId) return;
    releaseLock(workflowId, nodeId);
  }, [isAvailable, userId, workflowId]);

  /**
   * Record a user action in the live feed
   */
  const trackAction = useCallback((action: string, target: string) => {
    if (!isAvailable || !userId || !workflowId) return;

    logAction(workflowId, {
      userId,
      userName,
      userColor,
      action,
      target,
    });

    // Also update current user's last action in presence
    updatePresence(userId, {
      lastAction: `${action} ${target}`,
    });
  }, [isAvailable, userId, workflowId, userName, userColor]);

  /**
   * Send a chat message
   */
  const sendMessage = useCallback((text: string) => {
    if (!isAvailable || !userId || !workflowId || !text.trim()) return;

    sendChatMessage(workflowId, {
      senderId: userId,
      senderName: userName,
      text,
      type: 'message',
    });
  }, [isAvailable, userId, workflowId, userName]);

  return {
    collaborators,
    actionFeed,
    messages,
    locks,
    updateCursor,
    lockNode,
    unlockNode,
    trackAction,
    sendMessage,
  };
}
