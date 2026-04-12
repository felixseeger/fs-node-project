import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  ChatWindow, 
  ChatMessage, 
  ChatInput, 
  ChatToggle, 
  ChatLoader,
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
      }, 2000);
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
          {isGenerating && <ChatLoader text="Thinking" speed={300} />}
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
