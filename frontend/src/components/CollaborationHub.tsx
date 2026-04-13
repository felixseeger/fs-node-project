import React, { useState, useCallback, type FC } from 'react';
// @ts-ignore
import { useStore } from '../store';
import { useCollaboration } from '../hooks/useCollaboration';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { useViewport, useNodes } from '@xyflow/react';
import type { Collaborator, ActionEvent, ChatMessage, NodeLock } from '../services/collaborationService';

interface CollaborationHubProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (message: string, type?: 'error' | 'success') => void;
}

/**
 * CollaboratorPresence - Renders avatars and activity on the canvas
 */
export const CollaboratorPresence: FC = () => {
  const { x, y, zoom } = useViewport();
  const { currentWorkflow } = useStore();
  const { user } = useAuth();
  const { profile } = useUser(user?.uid);
  
  const { collaborators } = useCollaboration({
    workflowId: currentWorkflow?.id || null,
    userId: user?.uid || null,
    userName: profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
    userAvatar: profile?.photoURL || profile?.avatarUri || '👤',
    userColor: profile?.themeColor || '#3b82f6'
  });

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {collaborators.map(collaborator => {
        if (typeof collaborator.cursorX !== 'number' || typeof collaborator.cursorY !== 'number') return null;
        const screenX = collaborator.cursorX * zoom + x;
        const screenY = collaborator.cursorY * zoom + y;
        
        return (
          <div 
            key={collaborator.id}
            className="absolute flex flex-col items-center"
            style={{ 
              transform: `translate(${screenX}px, ${screenY}px)`,
              transition: 'transform 0.1s linear'
            }}
          >
            {/* Cursor SVG */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: collaborator.color || '#3b82f6', transform: 'rotate(-20deg)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
              <path d="M2.5 14.5L14.5 8.5L2.5 2.5V14.5Z" fill="currentColor" stroke="white" strokeWidth="1" />
            </svg>
            <div 
              className="mt-1 px-2 py-1 rounded text-white text-xs shadow-lg flex items-center gap-1.5 max-w-[150px]"
              style={{ backgroundColor: collaborator.color || '#3b82f6' }}
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold shrink-0 overflow-hidden">
                {collaborator.avatar?.startsWith('http') || collaborator.avatar?.startsWith('data:') ? (
                  <img src={collaborator.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  collaborator.avatar?.slice(0, 2) || 'U'
                )}
              </div>
              <div className="min-w-0 overflow-hidden">
                <div className="font-bold leading-tight truncate">{collaborator.name || 'Unknown User'}</div>
                {collaborator.lastAction && (
                  <div className="opacity-80 text-[9px] leading-tight truncate">{collaborator.lastAction}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * NodeLocks - Renders lock indicators over nodes being edited
 */
export const NodeLocks: FC = () => {
  const { currentWorkflow } = useStore();
  const { user } = useAuth();
  const nodes = useNodes();
  const { x, y, zoom } = useViewport();
  
  const { locks } = useCollaboration({
    workflowId: currentWorkflow?.id || null,
    userId: user?.uid || null
  });

  if (!locks || locks.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {locks.map(lock => {
        // Find the node this lock refers to
        const node = nodes.find(n => n.id === lock.id);
        if (!node || lock.userId === user?.uid) return null;
        
        const screenX = node.position.x * zoom + x;
        const screenY = node.position.y * zoom + y;
        
        // Handle xyflow Node type which might have measured property
        const nodeWidth = ((node as any).measured?.width || 200) * zoom;
        const nodeHeight = ((node as any).measured?.height || 100) * zoom;

        return (
          <div 
            key={lock.id}
            className="absolute border-2 rounded-lg pointer-events-none flex items-start justify-end p-1"
            style={{ 
              transform: `translate(${screenX}px, ${screenY}px)`,
              width: `${nodeWidth}px`,
              height: `${nodeHeight}px`,
              borderColor: lock.userColor,
              backgroundColor: `${lock.userColor}10`,
              transition: 'all 0.2s ease-out'
            }}
          >
            <div 
              className="px-1.5 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-1 shadow-sm absolute top-0 right-0"
              style={{ backgroundColor: lock.userColor, transform: 'translateY(-100%)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              {lock.userName} editing
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * LiveActionFeed - Sidebar showing real-time collaborative events
 */
export const LiveActionFeed: FC = () => {
  const { currentWorkflow } = useStore();
  const { user } = useAuth();
  
  const { actionFeed } = useCollaboration({
    workflowId: currentWorkflow?.id || null,
    userId: user?.uid || null
  });

  // Prevent enormous feeds from killing the DOM
  const displayFeed = actionFeed.slice(0, 50);

  return (
    <div className="absolute right-4 top-20 w-64 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg shadow-xl overflow-hidden z-40 flex flex-col max-h-96 pointer-events-auto">
      <div className="p-3 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center shrink-0">
        <h3 className="text-white text-sm font-bold flex items-center gap-2 m-0 p-0">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          Live Action Feed
        </h3>
      </div>
      <div className="p-2 overflow-y-auto flex-1 flex flex-col gap-2 min-h-0">
        {displayFeed.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-4">No recent activity</div>
        ) : (
          displayFeed.map((item, idx) => (
            <div key={item.id || idx} className="p-2 rounded bg-gray-800/50 border border-gray-700/50 text-xs min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="font-bold truncate" style={{ color: item.userColor || '#9ca3af' }}>{item.userName || 'Unknown'}</span>
                <span className="text-gray-500 text-[10px] shrink-0">
                  {item.timestamp?.toDate ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
              <div className="text-gray-300 break-words line-clamp-2">
                <span className="opacity-80">{item.action} </span>
                <span className="font-medium text-white">{item.target}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * CollaborationHub - Real-time collaboration interface
 * Enables multi-user workflow editing with presence and communication
 */
export const CollaborationHub: FC<CollaborationHubProps> = ({ isOpen, onClose, showToast }) => {
  const { currentWorkflow } = useStore();
  const { user } = useAuth();
  const { profile } = useUser(user?.uid);
  
  const { collaborators, actionFeed, messages, sendMessage } = useCollaboration({
    workflowId: currentWorkflow?.id || null,
    userId: user?.uid || null,
    userName: profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
    userAvatar: profile?.photoURL || profile?.avatarUri || '👤',
    userColor: profile?.themeColor || '#3b82f6'
  });

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('team');

  /**
   * Send a message
   */
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
  }, [newMessage, sendMessage]);

  /**
   * Share current workflow
   */
  const shareWorkflow = useCallback(async () => {
    if (!currentWorkflow) {
      if (showToast) showToast('No active workflow to share', 'error');
      return;
    }
    
    try {
      const shareLink = `${window.location.origin}/share/${currentWorkflow.id}`;
      
      // Try using the modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
        if (showToast) showToast('Workflow link copied to clipboard!', 'success');
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          if (showToast) showToast('Workflow link copied to clipboard!', 'success');
        } catch (err) {
          console.error('Fallback copy failed', err);
          if (showToast) showToast('Failed to copy link', 'error');
        }
        document.body.removeChild(textArea);
      }
      
      console.log(`Workflow shared! Link copied to clipboard: ${shareLink}`);
    } catch (err) {
      console.error('Failed to copy workflow link:', err);
      if (showToast) showToast('Failed to copy workflow link', 'error');
    }
  }, [currentWorkflow, showToast]);

  if (!isOpen) return null;

  return (
    <div className="collaboration-hub fixed right-4 bottom-20 w-80 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden" style={{ zIndex: 10000 }}>
      <div className="hub-header flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
        <h3 className="text-white font-semibold text-sm">👥 Collaboration Hub</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close collaboration hub"
        >
          <svg className="w-5 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="hub-tabs px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          {['team', 'chat', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="hub-content h-80 overflow-y-auto p-3">
        {activeTab === 'team' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-medium">Active Collaborators</h4>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {collaborators.length + 1} online
              </span>
            </div>

            <div className="space-y-2">
              {/* Current User */}
              <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-700/50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2 text-sm overflow-hidden">
                    {profile?.photoURL || profile?.avatarUri ? (
                      <img src={profile.photoURL || profile.avatarUri} alt="You" className="w-full h-full object-cover" />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">You ({profile?.displayName || 'Anonymous'})</div>
                    <div className="text-gray-400 text-xs">Editor</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>

              {/* Other Collaborators */}
              {collaborators.map(collab => (
                <div key={collab.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm overflow-hidden"
                      style={{ backgroundColor: collab.color + '40', color: collab.color }}
                    >
                      {collab.avatar?.startsWith('http') || collab.avatar?.startsWith('data:') ? (
                        <img src={collab.avatar} alt={collab.name} className="w-full h-full object-cover" />
                      ) : (
                        collab.avatar?.slice(0, 2) || '👤'
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{collab.name}</div>
                      <div className="text-gray-400 text-xs truncate max-w-[100px]">{collab.lastAction || 'Viewing'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500" />
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
              <h4 className="text-white font-medium mb-2">Collaboration Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={shareWorkflow}
                  className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  🔗 Share Workflow
                </button>
                <button
                  className="w-full flex items-center justify-center py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                  onClick={shareWorkflow}
                >
                  📋 Copy Workflow Link
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-container flex flex-col h-full">
            <div className="messages flex-1 overflow-y-auto space-y-2 mb-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-xs py-10 italic">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message, idx) => (
                  <div
                    key={message.id || idx}
                    className={`message flex items-end ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== user?.uid && message.type !== 'system' && (
                      <div className="flex-shrink-0 mr-2 mb-1">
                        {message.senderAvatar?.startsWith('http') || message.senderAvatar?.startsWith('data:') ? (
                          <img src={message.senderAvatar} alt={message.senderName} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm">
                            {message.senderAvatar?.slice(0, 2) || '👤'}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`inline-block max-w-[85%] p-2 rounded-lg text-sm ${
                        message.type === 'system'
                          ? 'bg-gray-700 text-gray-200 text-center mx-auto'
                          : message.senderId === user?.uid
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-700 text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {message.senderId !== user?.uid && message.type !== 'system' && (
                        <div className="text-[10px] font-bold opacity-70 mb-1">{message.senderName}</div>
                      )}
                      {message.type === 'system' && '🤖 '}
                      {message.text}
                      <div className="text-[9px] opacity-70 mt-1">
                        {message.timestamp?.toDate ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  !newMessage.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-container space-y-3">
            <h4 className="text-white font-medium">Recent Activity</h4>

            <div className="space-y-2">
              {actionFeed.map((event, idx) => (
                <div key={event.id || idx} className="p-2 bg-gray-800 rounded border border-gray-700 text-sm">
                  <div className="text-gray-400 text-xs">
                    {event.timestamp?.toDate ? new Date(event.timestamp.toDate()).toLocaleTimeString() : 'Just now'}
                  </div>
                  <div className="text-gray-200">
                    <span className="font-bold" style={{ color: event.userColor }}>{event.userName}</span>
                    <span className="opacity-70 text-xs ml-1">{event.action} {event.target}</span>
                  </div>
                </div>
              ))}
              {actionFeed.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4">No recent activity</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Collaboration Presence Indicator
 * Shows user presence status in the UI
 */
export const CollaborationPresence: FC = () => {
  const { currentWorkflow } = useStore();
  const { user } = useAuth();
  const { profile } = useUser(user?.uid);
  const { collaborators } = useCollaboration({
    workflowId: currentWorkflow?.id || null,
    userId: user?.uid || null
  });

  const totalCount = collaborators.length + 1;
  const userAvatar = profile?.photoURL || profile?.avatarUri || '👤';
  
  return (
    <div className="fixed bottom-4 left-4 flex items-center space-x-2" style={{ zIndex: 10000 }}>
      <div className="flex -space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs shadow-lg z-30 overflow-hidden" title="You">
          {userAvatar.startsWith('http') || userAvatar.startsWith('data:') ? (
             <img src={userAvatar} alt="You" className="w-full h-full object-cover" />
          ) : (
             userAvatar.slice(0, 2)
          )}
        </div>
        {collaborators.slice(0, 2).map((collab, index) => (
          <div 
            key={collab.id}
            className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs shadow-lg overflow-hidden"
            style={{ zIndex: 20 - index, backgroundColor: collab.color + '80' }}
            title={collab.name}
          >
            {collab.avatar?.startsWith('http') || collab.avatar?.startsWith('data:') ? (
              <img src={collab.avatar} alt={collab.name} className="w-full h-full object-cover" />
            ) : (
              collab.avatar?.slice(0, 2) || '👤'
            )}
          </div>
        ))}
        {totalCount > 3 && (
          <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs shadow-lg z-10">
            +{totalCount - 3}
          </div>
        )}
      </div>
      <div className="bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full text-white text-sm border border-gray-700 shadow-xl">
        <span className="font-bold text-blue-400">{totalCount}</span> {totalCount === 1 ? 'collaborator' : 'collaborators'} online
      </div>
    </div>
  );
};


/**
 * Mock collaboration utilities
 */
export const CollaborationUtils = {
  initializeSession: (workflowId: string) => {
    console.log(`Initializing collaboration session for workflow: ${workflowId}`);
    return {
      sessionId: `collab-${Date.now()}`,
      workflowId,
      initialized: true
    };
  },
  joinSession: (sessionId: string, userData: any) => {
    console.log(`User ${userData.name} joined session: ${sessionId}`);
    return {
      success: true,
      userId: `user-${Date.now()}`,
      sessionId
    };
  },
  sendMessage: (sessionId: string, message: any) => {
    console.log(`Sending message to session ${sessionId}:`, message);
    return {
      success: true,
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  },
  updatePresence: (sessionId: string, userId: string, status: string) => {
    console.log(`Updating presence for ${userId} in ${sessionId}: ${status}`);
    return {
      success: true,
      status
    };
  },
  shareWorkflow: (workflowId: string, permissions: string) => {
    const shareLink = `${window.location.origin}/share/${workflowId}?perm=${permissions}`;
    console.log(`Generating share link: ${shareLink}`);
    return {
      success: true,
      shareLink,
      permissions
    };
  }
};
