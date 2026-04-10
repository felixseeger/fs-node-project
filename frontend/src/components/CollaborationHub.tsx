import React, { useState, useEffect, useCallback, FC, KeyboardEvent } from 'react';
// @ts-ignore
import { useStore } from '../store';
// @ts-ignore
import { usePresence, useUser } from '../utils/collaboration';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: string;
  role: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  type: 'message' | 'system';
}

interface CollaborationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CollaborationHub - Real-time collaboration interface
 * Enables multi-user workflow editing with presence and communication
 */
const CollaborationHub: FC<CollaborationHubProps> = ({ isOpen, onClose }) => {
  const { workflows, currentWorkflow, setWorkflow } = useStore();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('team');
  const [userPresence, setUserPresence] = useState<Record<string, string>>({});

  // Mock collaboration data
  const mockCollaborators: Collaborator[] = [
    { id: 'user1', name: 'Alex Johnson', avatar: '👤', status: 'online', role: 'Editor' },
    { id: 'user2', name: 'Sam Wilson', avatar: '👤', status: 'online', role: 'Viewer' },
    { id: 'user3', name: 'Taylor Lee', avatar: '👤', status: 'offline', role: 'Editor' }
  ];

  const mockMessages: Message[] = [
    { id: 'msg1', sender: 'user1', text: 'I\'ve updated the image generation workflow', timestamp: '10:30 AM', type: 'message' },
    { id: 'msg2', sender: 'user2', text: 'Looks good! Let me test the video generation part', timestamp: '10:32 AM', type: 'message' },
    { id: 'msg3', sender: 'system', text: 'Alex Johnson joined the workflow', timestamp: '10:25 AM', type: 'system' }
  ];

  /**
   * Initialize collaboration
   */
  const initializeCollaboration = useCallback(() => {
    setCollaborators(mockCollaborators);
    setMessages(mockMessages);
    
    const initialPresence: Record<string, string> = {};
    mockCollaborators.forEach(user => {
      initialPresence[user.id] = user.status;
    });
    setUserPresence(initialPresence);
  }, []);

  /**
   * Send a message
   */
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: 'current-user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'message'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }, [newMessage]);

  /**
   * Handle user presence updates
   */
  const updateUserPresence = useCallback((userId: string, status: string) => {
    setUserPresence(prev => ({
      ...prev,
      [userId]: status
    }));
    
    setCollaborators(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    );
    
    const statusText = status === 'online' ? 'joined' : 'left';
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `${collaborators.find(u => u.id === userId)?.name} ${statusText} the workflow`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system'
      }
    ]);
  }, [collaborators]);

  /**
   * Share current workflow
   */
  const shareWorkflow = useCallback(() => {
    if (!currentWorkflow) return;
    
    const shareLink = `${window.location.origin}/share/${currentWorkflow.id}`;
    navigator.clipboard.writeText(shareLink);
    
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Workflow shared! Link copied to clipboard: ${shareLink}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'system'
      }
    ]);
  }, [currentWorkflow]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeCollaboration();
  }, [initializeCollaboration]);

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
                {collaborators.filter(c => c.status === 'online').length} online
              </span>
            </div>

            <div className="space-y-2">
              {collaborators.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-400 capitalize">{user.status}</span>
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
                >
                  📋 Copy Workflow Link
                </button>
                <button
                  className="w-full flex items-center justify-center py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  👥 Invite Collaborator
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-container flex flex-col h-full">
            <div className="messages flex-1 overflow-y-auto space-y-2 mb-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'current-user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-xs p-2 rounded-lg text-sm ${
                      message.type === 'system'
                        ? 'bg-gray-700 text-gray-200 text-center mx-auto'
                        : message.sender === 'current-user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-700 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {message.type === 'system' && '🤖 '}
                    {message.text}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
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
              {messages
                .filter(msg => msg.type === 'system')
                .map(message => (
                  <div key={message.id} className="p-2 bg-gray-800 rounded border border-gray-700 text-sm">
                    <div className="text-gray-400">{message.timestamp}</div>
                    <div className="text-gray-200">{message.text}</div>
                  </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
              <h4 className="text-white font-medium mb-2">Workflow History</h4>
              <div className="text-gray-400 text-sm">
                {(workflows || []).length} workflows created • 
                {(nodes || []).length} total nodes • 
                {(edges || []).length} total connections
              </div>
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
  const [collaborators, setCollaborators] = useState(2); // Would come from collaboration state
  
  return (
    <div className="fixed bottom-4 left-4 flex items-center space-x-2" style={{ zIndex: 10000 }}>
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(collaborators, 3) }).map((_, index) => (
          <div 
            key={index}
            className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs"
            title={`Collaborator ${index + 1}`}
          >
            👤
          </div>
        ))}
        {collaborators > 3 && (
          <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs">
            +{collaborators - 3}
          </div>
        )}
      </div>
      <div className="bg-gray-900 px-3 py-1 rounded text-white text-sm">
        {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'} online
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

export default CollaborationHub;
