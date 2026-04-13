import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  ChatWindow, 
  ChatMessage, 
  ChatInput, 
  ChatToggle, 
  ChatLoadingMessage,
} from './index';
import type { ChatMessageData } from './index';

const meta: Meta<typeof ChatWindow> = {
  title: 'Design System/Chat',
  component: ChatWindow,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const FullInterface: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<ChatMessageData[]>([
      { id: 1, type: 'assistant', content: 'Hello! How can I help you build your workflow today?', timestamp: new Date() },
      { id: 2, type: 'user', content: 'I want to create an image generator.', timestamp: new Date() },
      { id: 3, type: 'assistant', content: 'Sure! I can help with that. What kind of images do you want to generate?', timestamp: new Date() },
    ]);

    const handleSendMessage = (content: string) => {
      const newUserMsg: ChatMessageData = {
        id: Date.now(),
        type: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newUserMsg]);
      setIsGenerating(true);

      setTimeout(() => {
        const newAiMsg: ChatMessageData = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Processing your request...',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newAiMsg]);
        setIsGenerating(false);
      }, 5000); // 5 seconds to easily see the witty phrases
    };

    return (
      <div style={{ position: 'relative', width: 800, height: 600 }}>
        <ChatWindow 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Workflow Assistant"
          footer={
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isGenerating}
            />
          }
        >
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isGenerating && <ChatLoadingMessage />}
        </ChatWindow>
        
        <ChatToggle 
          isOpen={isOpen} 
          onClick={() => setIsOpen(!isOpen)} 
          unreadCount={isOpen ? 0 : 2} 
          useShader={false}
        />
      </div>
    );
  }
};

export const WithAssets: StoryObj = {
  render: () => {
    const messages: ChatMessageData[] = [
      { id: 1, type: 'assistant', content: 'Here are the assets I generated for your "Cosmic" theme.', timestamp: "12:45" },
      { id: 2, type: 'user', content: 'These look great! Can we use the second one as a base?', timestamp: "12:46" },
      { id: 3, type: 'assistant', content: 'Of course. I have attached the high-res source for you.', timestamp: "12:47" },
    ];

    const ImagePreview = ({ label }: { label: string }) => (
      <div style={{ 
        width: 120, 
        height: 120, 
        background: '#334155', 
        borderRadius: 8, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: 600,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {label}
      </div>
    );

    return (
      <div style={{ width: 400, height: 600, background: 'var(--be-terminal-bg)', borderRadius: 12, padding: 16 }}>
        <ChatMessage message={messages[0]}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            <ImagePreview label="COSMIC_01" />
            <ImagePreview label="COSMIC_02" />
            <ImagePreview label="COSMIC_03" />
          </div>
        </ChatMessage>
        <ChatMessage message={messages[1]} />
        <ChatMessage message={messages[2]}>
          <div style={{ marginTop: 8 }}>
            <div style={{ 
              padding: 8, 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: 6, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ width: 32, height: 32, background: '#4285F4', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>cosmic_nebula_4k.png</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>4.2 MB • Image</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </div>
          </div>
        </ChatMessage>
      </div>
    );
  }
};
