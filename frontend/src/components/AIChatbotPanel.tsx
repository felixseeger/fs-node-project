import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from 'blue-ether';
import { useUserChats, useChatMessages } from '../hooks/useChat';
import { useUser } from '../hooks/useUser';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function formatRelativeTime(date: Date | number) {
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}

interface AIChatbotPanelProps {
  currentUserId: string;
}

export default function AIChatbotPanel({ currentUserId }: AIChatbotPanelProps) {
  const { chats, loading: loadingChats, createChat } = useUserChats(currentUserId);
  const { profile } = useUser(currentUserId);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  
  // Set first chat as active by default if none selected
  useEffect(() => {
    if (chats.length > 0 && !activeChatId && !loadingChats) {
      setActiveChatId(chats[0].id || null);
    }
  }, [chats, activeChatId, loadingChats]);

  const handleCreateNewChat = async () => {
    try {
      const newChatId = await createChat('New Conversation');
      setActiveChatId(newChatId);
    } catch (e) {
      console.error('Failed to create new chat', e);
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      maxWidth: '900px',
      height: '600px',
      background: 'rgba(10, 10, 20, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sidebar: Chat Sessions */}
      <div style={{
        width: '280px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={handleCreateNewChat}
            style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + New Chat
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loadingChats ? (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading chats...</div>
          ) : chats.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No conversations yet.</div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id || null)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: activeChatId === chat.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: `1px solid ${activeChatId === chat.id ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {chat.updatedAt ? formatRelativeTime(chat.updatedAt) : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {activeChatId ? (
          <ActiveChatArea 
            chatId={activeChatId} 
            userAvatar={profile?.photoURL || profile?.avatarUri}
            userDisplayName={profile?.displayName}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            Select or create a chat to begin.
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for the active chat messages
function ActiveChatArea({ 
  chatId, 
  userAvatar, 
  userDisplayName 
}: { 
  chatId: string;
  userAvatar?: string;
  userDisplayName?: string;
}) {
  const { messages, loading, sendMessage } = useChatMessages(chatId);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const currentText = inputText;
    setInputText('');
    setIsSending(true);

    try {
      // Send user message
      await sendMessage('user', currentText);
      
      // Simulate AI response (In production, your backend or edge function should handle this)
      // Here we just mock a delayed response for the UI prototype.
      setTimeout(async () => {
        await sendMessage('assistant', `I am an AI assistant. I received your message: "${currentText}". How else can I help you build workflows today?`);
        setIsSending(false);
      }, 1500);

    } catch (err) {
      console.error('Failed to send message:', err);
      setIsSending(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#64748b', 
            marginTop: 'auto', 
            marginBottom: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Avatar 
              src="/gemini_avatar_improved.png" 
              name="AI Assistant" 
              size="lg" 
              crt 
            />
            <div>Hi! I'm your Colab Hub AI Assistant. How can I help you?</div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  gap: '12px',
                  alignItems: 'flex-end'
                }}
              >
                <div style={{ flexShrink: 0, marginBottom: '2px' }}>
                  {isUser ? (
                    <Avatar 
                      src={userAvatar} 
                      name={userDisplayName || 'User'} 
                      size="sm" 
                      crt 
                    />
                  ) : (
                    <Avatar 
                      src="/gemini_avatar_improved.png" 
                      name="AI Assistant" 
                      size="sm" 
                      crt 
                    />
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: isUser ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#64748b', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {msg.role}
                  </div>
                  <div style={{
                    background: isUser ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                    color: isUser ? 'white' : '#cbd5e1',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    borderBottomRightRadius: isUser ? '4px' : '12px',
                    borderBottomLeftRadius: !isUser ? '4px' : '12px',
                    lineHeight: '1.5',
                    border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isSending && (
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '52px' }}>
            <span style={{ animation: 'pulse 1.5s infinite' }}>●</span>
            AI is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question or request a template..."
            disabled={isSending}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              outline: 'none',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            style={{
              background: inputText.trim() && !isSending ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: inputText.trim() && !isSending ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '0 20px',
              fontWeight: 600,
              cursor: inputText.trim() && !isSending ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
