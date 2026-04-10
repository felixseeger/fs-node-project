import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback, FC, ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import DecodedText from './DecodedText';
import {
  exportWorkflowToFile,
  openFilePicker,
  importWorkflowFromFile,
  prepareWorkflowForExport,
  handleImportedWorkflow,
  generateTestWorkflow,
  testRoundTrip,
  getWorkflowSummary,
} from '../utils/workflowJSON';

// Extend window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const THINKING_PHRASES = [
  'Analyzing request...',
  'Structuring nodes...',
  'Wiring up models...',
  'Tuning parameters...',
  'Finalizing workflow...'
];

interface Tag {
  icon?: string;
  label: string;
}

const DEFAULT_TAGS: Tag[] = [
  { icon: 'loop', label: 'Portrait' },
  { icon: 'clock', label: '10s' },
];

interface Message {
  id: number | string;
  type: 'assistant' | 'user';
  role?: string;
  content: string;
  timestamp: Date;
}

export interface ChatUIRef {
  submitGeneration: () => void;
  addMessage: (message: { type?: 'assistant' | 'user'; content: string }) => void;
}

interface ChatUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (message: string) => Promise<void>;
  onGenerate?: (message: string) => Promise<void>;
  isGenerating?: boolean;
  isChatting?: boolean;
  tags?: Tag[];
  disabled?: boolean;
  referenceImage?: string | null;
  setReferenceImage?: (image: string | null) => void;
  lastGeneratedWorkflow?: any;
  onSetNodes?: (nodes: any[]) => void;
  onSetEdges?: (edges: any[]) => void;
  onNotify?: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
}

const ChatUI = forwardRef<ChatUIRef, ChatUIProps>(({
  isOpen,
  onClose,
  onSendMessage,
  onGenerate,
  isGenerating = false,
  isChatting = false,
  tags = DEFAULT_TAGS,
  disabled = false,
  referenceImage = null,
  setReferenceImage,
  lastGeneratedWorkflow = null,
  onSetNodes,
  onSetEdges,
  onNotify,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm here to help you build your AI workflow. Describe what you'd like to create, and I'll guide you through it.",
      timestamp: new Date(),
    },
  ]);
  const [activeTags, setActiveTags] = useState<Set<string>>(() => new Set(tags.map(t => t.label)));
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [showImportExport, setShowImportExport] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, isChatting]);

  useEffect(() => {
    let interval: any;
    if (isGenerating || isChatting) {
      setThinkingIndex(0);
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating, isChatting]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onstart = () => {
      setIsListening(true);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    recognitionInstance.onerror = (event: any) => {
      setIsListening(false);
      console.error('Voice recognition error:', event.error);
    };
    
    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + ' ' + transcript);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const handleVoiceInput = useCallback(() => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const toggleTag = (label: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleGenerate = useCallback(() => {
    if (!inputValue.trim() || isGenerating || isChatting || disabled) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    onGenerate?.(currentInput);
  }, [inputValue, isGenerating, isChatting, disabled, onGenerate]);

  useImperativeHandle(ref, () => ({
    submitGeneration: handleGenerate,
    addMessage: (message) => {
      const msg: Message = {
        id: Date.now(),
        type: message.type || 'assistant',
        content: message.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
    }
  }), [handleGenerate]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleExportWorkflow = () => {
    if (!lastGeneratedWorkflow) {
      onNotify?.('No workflow to export. Generate a workflow first!', 'info');
      return;
    }
    try {
      const workflow = prepareWorkflowForExport(lastGeneratedWorkflow);
      if (!workflow) { onNotify?.('Failed to prepare workflow for export', 'error'); return; }
      exportWorkflowToFile(workflow);
      onNotify?.(`Exported: ${getWorkflowSummary(workflow)}`, 'success');
    } catch (err) {
      console.error('[ChatUI] Export error:', err);
      onNotify?.('Failed to export workflow', 'error');
    }
  };

  const handleImportWorkflow = async () => {
    try {
      const file = await openFilePicker();
      if (!file) return;
      const workflow = await importWorkflowFromFile(file);
      handleImportedWorkflow(workflow, {
        onSetNodes, onSetEdges,
        onNotify: (msg, type) => {
          onNotify?.(msg, type as any);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'assistant',
            content: `${type === 'success' ? '✅' : '❌'} ${msg}`,
            timestamp: new Date(),
          }]);
        },
      });
    } catch (err) {
      console.error('[ChatUI] Import error:', err);
      onNotify?.('Failed to import workflow', 'error');
    }
  };

  const handleTestRoundTrip = () => {
    try {
      const result = testRoundTrip(generateTestWorkflow());
      if (result.success) {
        onNotify?.('Round-trip test passed! ✅', 'success');
      } else {
        onNotify?.(`Round-trip test failed: ${result.errors.join(', ')}`, 'error');
      }
    } catch (err) {
      onNotify?.('Round-trip test failed', 'error');
    }
  };

  const handleImageClick = () => imageInputRef.current?.click();
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setReferenceImage?.(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessageContent = (content: string, isActive: boolean) => {
    const parts: { type: 'text' | 'workflow' | 'code'; content?: string; data?: any }[] = [];
    const jsonRegex = /```(?:json)?\n([\s\S]*?)\n```/g;
    let lastIndex = 0, match;
    while ((match = jsonRegex.exec(content)) !== null) {
      if (match.index > lastIndex) parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.nodes || (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type))
          parts.push({ type: 'workflow', data: parsed });
        else parts.push({ type: 'code', content: match[0] });
      } catch { parts.push({ type: 'code', content: match[0] }); }
      lastIndex = jsonRegex.lastIndex;
    }
    if (lastIndex < content.length) parts.push({ type: 'text', content: content.substring(lastIndex) });
    if (parts.length === 0) parts.push({ type: 'text', content });

    return parts.map((part, i) => {
      if (part.type === 'text')
        return isActive ? <DecodedText key={i} text={part.content} active /> : <span key={i}>{part.content}</span>;
      if (part.type === 'workflow')
        return (
          <div key={i} style={{ marginTop: 12, marginBottom: 12, padding: 12, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>✨ AI Generated Workflow</div>
            <button onClick={() => {
              const nodes = part.data.nodes || part.data;
              const edges = part.data.edges || [];
              onSetNodes?.(nodes); onSetEdges?.(edges);
              onNotify?.(`Imported ${nodes.length} nodes to canvas`, 'success');
            }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Import Workflow to Canvas
            </button>
          </div>
        );
      return <pre key={i} style={{ background: '#111', padding: 8, borderRadius: 4, overflowX: 'auto', fontSize: 11, marginTop: 8, marginBottom: 8 }}><code>{part.content}</code></pre>;
    });
  };

  if (!isOpen) return null;

  return (
    <div data-testid="chat-ui" style={{
      position: 'absolute', top: 24, right: 24, bottom: 112, width: 340, zIndex: 2100,
      display: 'flex', flexDirection: 'column',
      background: '#121212', borderRadius: 14, border: '1px solid #2a2a2a',
      overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>AI Assistant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setShowImportExport(!showImportExport)}
            style={{ width: 28, height: 28, borderRadius: 8, background: showImportExport ? '#2a2a2a' : 'transparent', border: 'none', color: showImportExport ? '#aaa' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}
            title="Import/Export">💾</button>
          <button onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
            title="Close">✕</button>
        </div>
      </div>

      {showImportExport && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', gap: 6 }}>
          <button onClick={handleExportWorkflow} disabled={!lastGeneratedWorkflow}
            style={{ padding: '5px 10px', borderRadius: 6, background: lastGeneratedWorkflow ? '#22c55e' : '#2a2a2a', border: 'none', color: lastGeneratedWorkflow ? '#fff' : '#555', fontSize: 11, fontWeight: 500, cursor: lastGeneratedWorkflow ? 'pointer' : 'default' }}>📤 Export</button>
          <button onClick={handleImportWorkflow}
            style={{ padding: '5px 10px', borderRadius: 6, background: '#3b82f6', border: 'none', color: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>📥 Import</button>
          <button onClick={handleTestRoundTrip}
            style={{ padding: '5px 10px', borderRadius: 6, background: '#8b5cf6', border: 'none', color: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>🧪 Test</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, idx) => {
          const isUser = (msg.role ?? msg.type) === 'user';
          return (
            <div key={msg.id} style={{
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              padding: '10px 14px',
              borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: isUser ? '#1e1e1e' : '#1a1a1a',
              border: isUser ? '1px solid #2a2a2a' : '1px solid #222',
              color: '#d4d4d4', fontSize: 13, lineHeight: 1.55,
            }}>
              {isUser ? msg.content : renderMessageContent(msg.content, idx === messages.length - 1)}
            </div>
          );
        })}

        {(isGenerating || isChatting) && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 14px', borderRadius: '12px 12px 12px 4px', background: '#1a1a1a', border: '1px solid #222', color: '#888', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" style={{ animation: 'chatui-spin 2s linear infinite' }}>
              <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            <DecodedText text={isGenerating ? THINKING_PHRASES[thinkingIndex] : 'Thinking...'} active speed={70} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #2a2a2a', background: '#121212' }}>
        {referenceImage && (
          <div style={{ padding: '6px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, background: '#1a1a1a', borderRadius: 8, border: '1px solid #2a2a2a' }}>
            <img src={referenceImage} alt="Ref" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
            <span style={{ flex: 1, fontSize: 11, color: '#666' }}>Reference attached</span>
            <button onClick={() => setReferenceImage?.(null)}
              style={{ width: 18, height: 18, borderRadius: '50%', background: '#2a2a2a', border: 'none', color: '#888', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        )}

        <div style={{
          background: '#1a1a1a',
          borderRadius: 12,
          border: '1px solid #2a2a2a',
          padding: '14px 14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create…"
            disabled={isGenerating || isChatting || disabled}
            style={{
              width: '100%', minHeight: 40, maxHeight: 120,
              padding: 0, background: 'transparent', border: 'none',
              color: '#e0e0e0', fontSize: 13, fontFamily: 'inherit',
              resize: 'none', outline: 'none', lineHeight: 1.55,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <button onClick={handleImageClick} disabled={isGenerating || disabled}
              style={{ width: 28, height: 28, borderRadius: 8, background: referenceImage ? 'rgba(34,197,94,0.15)' : 'transparent', border: referenceImage ? '1px solid #22c55e44' : '1px solid #2a2a2a', color: referenceImage ? '#22c55e' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              title="Attach reference image">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>

            <button onClick={handleVoiceInput} disabled={isGenerating || disabled}
              style={{ 
                width: 28, height: 28, borderRadius: 8, 
                background: isListening ? 'rgba(236, 72, 153, 0.15)' : 'transparent', 
                border: isListening ? '1px solid #ec489944' : '1px solid #2a2a2a', 
                color: isListening ? '#ec4899' : '#555', 
                cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                flexShrink: 0, 
                position: 'relative'
              }}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <path d="M12 19v4"/>
                <path d="M8 23h8"/>
              </svg>
              {isListening && (
                <div style={{ 
                  position: 'absolute', top: -4, right: -4, 
                  width: 8, height: 8, 
                  background: '#ef4444', 
                  borderRadius: '50%', 
                  animation: 'chatui-pulse 1.5s ease-in-out infinite'
                }} />
              )}
            </button>

            {tags.map((tag) => {
              const label = tag.label;
              const isActive = activeTags.has(label);
              const iconType = tag.icon || 'clock';
              return (
                <button key={label} onClick={() => toggleTag(label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 8,
                    background: isActive ? '#2a2a2a' : 'transparent',
                    border: `1px solid ${isActive ? '#3a3a3a' : '#2a2a2a'}`,
                    color: isActive ? '#ccc' : '#555',
                    fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  {iconType === 'clock' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                  {iconType === 'loop' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                  )}
                  {iconType === 'portrait' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  )}
                  {label}
                </button>
              );
            })}

            <div style={{ flex: 1 }} />

            <button
              data-testid="chat-generate"
              onClick={handleGenerate}
              disabled={!inputValue.trim() || isGenerating || isChatting || disabled}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: inputValue.trim() && !isGenerating && !disabled
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : '#2a2a2a',
                border: 'none',
                color: inputValue.trim() && !isGenerating && !disabled ? '#fff' : '#444',
                cursor: inputValue.trim() && !isGenerating && !disabled ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}
              title="Generate workflow">
              {isGenerating ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'chatui-spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes chatui-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes chatui-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
});

export default ChatUI;
