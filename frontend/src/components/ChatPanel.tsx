import React, { useState, useCallback, useEffect, useRef, FC, KeyboardEvent, ChangeEvent } from 'react';
// @ts-ignore
import { generateWorkflowFromPrompt, validateWorkflow } from '../utils/workflowAI';
import { useInfiniteCanvas } from './InfiniteCanvas';

interface WorkflowPreview {
  nodes: any[];
  edges: any[];
  isValid: boolean;
  validationErrors: string[];
}

interface Message {
  id: string;
  sender: 'system' | 'user' | 'ai';
  content: string;
  timestamp: string;
  workflowPreview?: WorkflowPreview;
  isError?: boolean;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowGenerated?: (workflow: any) => void;
}

/**
 * ChatPanel - Accessible chat interface for workflow generation
 */
const ChatPanel: FC<ChatPanelProps> = ({ isOpen, onClose, onWorkflowGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'system',
      content: 'Welcome to the AI Workflow Generator! Describe what you want to create and I\'ll generate a workflow for you.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { centerCanvas } = useInfiniteCanvas();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsGenerating(true);

    try {
      const workflow = await generateWorkflowFromPrompt({
        prompt: currentInput,
        providerPreferences: ['freepik', 'anthropic'],
        constraints: { maxNodes: 8 },
      });

      const validation = validateWorkflow(workflow);
      setCurrentWorkflow(workflow);

      const aiResponse: Message = {
        id: `resp-${Date.now()}`,
        sender: 'ai',
        content: `I've generated a workflow for you! It contains ${workflow.nodes.length} nodes and ${workflow.edges.length} connections. ${validation.valid ? '✅ Workflow is valid and ready to use.' : '⚠️ Workflow has validation issues.'}`,
        timestamp: new Date().toISOString(),
        workflowPreview: {
          nodes: workflow.nodes.slice(0, 3),
          edges: workflow.edges.slice(0, 2),
          isValid: validation.valid,
          validationErrors: validation.errors,
        },
      };

      setMessages(prev => [...prev, aiResponse]);

      if (onWorkflowGenerated) {
        onWorkflowGenerated(workflow);
      }
      centerCanvas();

    } catch (error: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        content: `❌ Sorry, I encountered an error while generating your workflow: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  }, [inputValue, isGenerating, onWorkflowGenerated, centerCanvas]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleRegenerate = useCallback(() => {
    if (messages.length > 1) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        setInputValue(lastUserMessage.content);
      }
    }
  }, [messages]);

  const handleClearChat = useCallback(() => {
    setMessages([{
      id: 'welcome',
      sender: 'system',
      content: 'Chat cleared. Describe what you want to create and I\'ll generate a workflow for you.',
      timestamp: new Date().toISOString(),
    }]);
    setCurrentWorkflow(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="chat-panel"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '350px',
        background: '#1a1a1a',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
      role="region"
      aria-label="AI Workflow Generation Chat"
    >
      {/* Chat header */}
      <div
        style={{
          padding: '15px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#2a2a2a',
        }}
      >
        <h3 style={{ margin: 0, color: 'white', fontSize: '16px' }}>🤖 AI Workflow Generator</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
          aria-label="Close chat panel"
        >
          ×
        </button>
      </div>

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <div
              style={{
                background: message.sender === 'user' ? '#3b82f6' : 
                          message.isError ? '#ef4444' : '#374151',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '15px',
                wordBreak: 'break-word',
                position: 'relative',
              }}
            >
              {message.content}

              {/* Workflow preview */}
              {message.workflowPreview && (
                <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <strong>Workflow Preview:</strong>
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {message.workflowPreview.nodes.length} nodes | {message.workflowPreview.edges.length} edges
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '5px', color: message.workflowPreview.isValid ? '#10b981' : '#f59e0b' }}>
                    {message.workflowPreview.isValid ? '✅ Valid workflow' : '⚠️ Needs review'}
                  </div>
                </div>
              )}

              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '15px', borderTop: '1px solid #333', background: '#2a2a2a' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating || messages.length <= 1}
            style={{
              background: messages.length > 1 ? '#3b82f6' : '#4b5563',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: messages.length > 1 ? 'pointer' : 'not-allowed',
              fontSize: '12px',
            }}
            title="Regenerate last workflow"
          >
            🔄 Regenerate
          </button>
          <button
            onClick={handleClearChat}
            disabled={isGenerating}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Clear chat history"
          >
            🗑️ Clear
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the workflow you want to create..."
            disabled={isGenerating}
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              background: '#1a1a1a',
              color: 'white',
              resize: 'none',
              height: '60px',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
            aria-label="Type your workflow description"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
            style={{
              background: inputValue.trim() ? '#10b981' : '#4b5563',
              color: 'white',
              border: 'none',
              padding: '0 20px',
              borderRadius: '8px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Send message"
          >
            {isGenerating ? '…' : '→'}
          </button>
        </div>

        <div id="chat-input-help" style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>
          Press Enter to send | Shift+Enter for new line
        </div>
      </div>

      {/* Status indicator */}
      {isGenerating && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1s infinite' }} />
          Generating your workflow...
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;
