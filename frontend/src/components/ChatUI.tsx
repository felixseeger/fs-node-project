import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useMemo, type FC, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Avatar } from 'blue-ether';
import DecodedText from './DecodedText';
import AssetPickerOverlay from './AssetPickerOverlay';
import CameraModal from './CameraModal';
import { type Asset, type CreateAssetPayload, type AssetOperationResult } from '../types/asset';
import { type ChatConversation } from '../types/chat';

import { sanitizeString, sanitizeData } from '../utils/sanitization';


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
  type?: 'aspect' | 'duration' | 'default';
  value?: string;
}

const DEFAULT_TAGS: Tag[] = [];

interface Message {
  id: number | string;
  type: 'assistant' | 'user';
  role?: string;
  content: string;
  timestamp: Date | any;
}

export interface ChatUIRef {
  submitGeneration: () => void;
  addMessage: (message: { type?: 'assistant' | 'user'; content: string }) => void;
  clearMessages: () => void;
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
  referenceImages?: string[];
  setReferenceImages?: (images: string[]) => void;
  canvasImages?: { id: string, url: string, label: string }[];
  assets?: any[];

  lastGeneratedWorkflow?: any;
  onSetNodes?: (nodes: any[]) => void;
  onSetEdges?: (edges: any[]) => void;
  onImportWorkflow?: (workflow: { name?: string; nodes: any[]; edges: any[] }) => void;
  onMergeWorkflow?: (workflow: { name?: string; nodes: any[]; edges: any[] }) => void;
  onNotify?: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  externalMessages?: Message[];
  onStartNewConversation?: () => void;
  onApplyActions?: (actions: any[]) => void;
  onCreateAsset?: (payload: CreateAssetPayload) => Promise<AssetOperationResult<Asset>>;
  selectedNodes?: any[];
  suggestions?: string[];
  onAddImageToCanvas?: (url: string) => void;
  activeChat?: ChatConversation;
  
  // Avatar support
  currentUserAvatar?: string;
  currentUserDisplayName?: string;
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
  referenceImages = [],
  setReferenceImages,
  canvasImages = [],
  assets = [],
  lastGeneratedWorkflow = null,
  onSetNodes,
  onSetEdges,
  onImportWorkflow,
  onMergeWorkflow,
  onNotify,
  externalMessages,
  onStartNewConversation,
  onApplyActions,
  selectedNodes = [],
  suggestions = [],
  activeChat,
  currentUserAvatar,
  currentUserDisplayName,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  // Optimized messages computation
  const messages = useMemo(() => {
    if (!externalMessages || externalMessages.length === 0) return localMessages;
    
    const externalContents = new Set(externalMessages.map(m => m.content));
    const uniqueLocal = localMessages.filter(m => !externalContents.has(m.content));
    
    return [...externalMessages, ...uniqueLocal].sort((a, b) => {
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  }, [externalMessages, localMessages]);

  // Memoized content parser
  const parseContent = useCallback((content: string) => {
    const parts: { type: 'text' | 'workflow' | 'canvas_actions' | 'code'; content?: string; data?: any }[] = [];
    const safeContent = typeof content === 'string' ? content : String(content);
    const jsonRegex = /```(?:json)?\n([\s\S]*?)\n```/g;
    let lastIndex = 0, match;
    
    try {
      while ((match = jsonRegex.exec(safeContent)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: safeContent.substring(lastIndex, match.index) });
        }
        try {
          const parsed = JSON.parse(match[1]);
          if (parsed.canvas_actions) {
            parts.push({ type: 'canvas_actions', data: parsed.canvas_actions });
          } else if (parsed.nodes || (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type)) {
            parts.push({ type: 'workflow', data: parsed });
          } else {
            parts.push({ type: 'code', content: match[0] });
          }
        } catch {
          parts.push({ type: 'code', content: match[0] });
        }
        lastIndex = jsonRegex.lastIndex;
      }
      if (lastIndex < safeContent.length) {
        parts.push({ type: 'text', content: safeContent.substring(lastIndex) });
      }
    } catch (e) {
      console.error('[ChatUI] Content rendering error:', e);
      parts.push({ type: 'text', content: safeContent });
    }

    if (parts.length === 0) parts.push({ type: 'text', content: safeContent });
    return parts;
  }, []);
  
  const displaySuggestions = useMemo(() => {
    if (suggestions && suggestions.length > 0) return suggestions;
    if (messages.length > 1) {
      return [
        "How does this workflow work?",
        "Can you add an upscaler?",
        "What other nodes are available?",
        "How do I run this?"
      ];
    }
    return [];
  }, [suggestions, messages.length]);

  const [activeTags, setActiveTags] = useState<Set<string>>(() => new Set(tags.map(t => t.label)));
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // No dropdowns to handle outside clicks for now
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const notifyUser = useCallback((msg: string, type: 'info' | 'success' | 'error' | 'warning') => {
    if (onNotify) {
      onNotify(msg, type);
    } else if (type === 'error' || type === 'warning') {
      setLocalError(msg);
      setTimeout(() => setLocalError(null), 5000);
    }
  }, [onNotify]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { /* may already be stopped */ }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Clean up voice recognition on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

  const submitText = useCallback((text: string, forceGenerate = false) => {
    const trimmedInput = text.trim();
    if (!trimmedInput || isGenerating || disabled) return;

    if (trimmedInput.length > 4000) {
      notifyUser('Message is too long. Please shorten it to under 4000 characters.', 'warning');
      return;
    }

    // Apply tags if any
    const activeModifiers = Array.from(activeTags).map(t => `[${t}]`).join(' ');
    const fullPrompt = activeModifiers ? `${activeModifiers} ${trimmedInput}` : trimmedInput;

    const userMessage: Message = {
      id: `local-${Date.now()}`,
      type: 'user',
      content: fullPrompt,
      timestamp: new Date(),
    };
    
    setLocalMessages((prev) => [...prev, userMessage]);
    
    setInputValue('');
    
    if (forceGenerate && onGenerate) {
      onGenerate(fullPrompt);
    } else if (onSendMessage) {
      onSendMessage(fullPrompt);
    } else if (onGenerate) {
      onGenerate(fullPrompt);
    }
  }, [activeTags, isGenerating, disabled, onGenerate, onSendMessage, onNotify, externalMessages]);

  const handleVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notifyUser('Voice recognition is not supported in your browser.', 'warning');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        recognitionRef.current = null;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          notifyUser('Microphone access denied. Please allow microphone permissions.', 'error');
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
          console.error('Voice recognition error:', event.error);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          let newText = '';
          setInputValue((prev) => {
            const space = prev && !prev.endsWith(' ') ? ' ' : '';
            newText = prev + space + transcript;
            return newText;
          });

          // Auto-submit the voice command after a brief delay so the UI can update
          setTimeout(() => {
             if (newText.trim()) {
               submitText(newText, true);
             }
          }, 200);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsListening(false);
      recognitionRef.current = null;
      notifyUser('Failed to start voice recognition. Please check microphone permissions.', 'error');
    }
  }, [isListening, notifyUser, stopListening, submitText]);

  const toggleTag = (tag: Tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      const isAlreadyActive = next.has(tag.label);

      // If we are turning it on, make it mutually exclusive per type
      if (!isAlreadyActive && tag.type) {
        // Find any existing tags of the same type and remove them
        const tagsOfSameType = tags.filter(t => t.type === tag.type).map(t => t.label);
        for (const existingLabel of tagsOfSameType) {
          next.delete(existingLabel);
        }
      }

      if (isAlreadyActive) {
        next.delete(tag.label);
      } else {
        next.add(tag.label);
      }
      return next;
    });
  };

  const handleGenerate = useCallback(() => {
    submitText(inputValue, true);
  }, [inputValue, submitText]);

  const handleSendMessage = useCallback(() => {
    submitText(inputValue, false);
  }, [inputValue, submitText]);

  useImperativeHandle(ref, () => ({
    submitGeneration: handleGenerate,
    addMessage: (message) => {
      const msg: Message = {
        id: `ref-${Date.now()}`,
        type: message.type || 'assistant',
        content: message.content,
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, msg]);
    },
    clearMessages: () => {
      setLocalMessages([]);
    }
  }), [handleGenerate]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // On mobile devices, we might want Enter to just add a new line by default,
      // but usually in chat interfaces Enter sends. 
      // We check if we're on a likely touch device.
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };






  const handleImageClick = () => imageInputRef.current?.click();
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notifyUser('Selected file is not an image.', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      notifyUser('Image is too large. Max size is 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setReferenceImages?.([...referenceImages, ev.target.result as string]);
      }
    };
    reader.onerror = () => {
      notifyUser('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be selected again if needed
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div data-testid="chat-ui" className="nodrag nopan nowheel" 
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      style={{
      position: 'absolute', top: 24, right: 24, bottom: 112, width: 380, zIndex: 2100,
      display: 'flex', flexDirection: 'column',
      background: '#121212', borderRadius: 14, border: 'none',
      overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>AI Assistant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button 
            onClick={onClose}
            className="nodrag nopan"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
            title="Close"
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {selectedNodes.some(n => n.type === 'assetNode') && (
          <div style={{ padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>i</div>
            <span style={{ fontSize: 11, color: '#93c5fd' }}>
              Asset selected: <strong>{selectedNodes.find(n => n.type === 'assetNode')?.data?.label || 'Asset'}</strong>
            </span>
          </div>
        )}
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px', color: '#888', textAlign: 'center' }}>
            <div style={{ background: '#222', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#e5e5e5', fontWeight: 600 }}>Welcome to the AI Workflow Builder</h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Describe what you'd like to create, and I'll generate a complete node-based workflow for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300, marginTop: 8 }}>
              <button
                onClick={() => submitText('Create an image beauty-retouche workflow', true)}
                style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#d4d4d4', fontSize: 13, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.borderColor = '#444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </span>
                <span>Image Beauty-Retouche</span>
              </button>
              <button
                onClick={() => submitText('Build a video color-correction workflow', true)}
                style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#d4d4d4', fontSize: 13, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.borderColor = '#444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                </span>
                <span>Video Color-Correction Workflow</span>
              </button>            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessageItem 
            key={msg.id}
            message={msg}
            isActive={idx === messages.length - 1}
            currentUserAvatar={currentUserAvatar}
            currentUserDisplayName={currentUserDisplayName}
            onImportWorkflow={onImportWorkflow}
            onMergeWorkflow={onMergeWorkflow}
            onSetNodes={onSetNodes}
            onSetEdges={onSetEdges}
            onApplyActions={onApplyActions}
            onNotify={onNotify}
          />
        ))}

        {(isGenerating || isChatting) && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 4 }}>
            <div style={{ flexShrink: 0, marginBottom: 2 }}>
              <Avatar 
                src="/gemini_avatar_improved.png" 
                name="AI Assistant" 
                size="sm" 
                crt 
              />
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: '#1a1a1a', border: 'none', color: '#888', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" style={{ animation: 'chatui-spin 2s linear infinite' }}>
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
              <DecodedText text={isGenerating ? THINKING_PHRASES[thinkingIndex] : 'Thinking...'} active speed={70} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #2a2a2a', background: '#121212' }}>
        {localError && (
          <div style={{ padding: '8px 12px', marginBottom: 8, background: '#7f1d1d', borderRadius: 8, border: '1px solid #dc2626', color: '#fca5a5', fontSize: 12, wordWrap: 'break-word' }}>
            {localError}
          </div>
        )}

        {referenceImages.length > 0 && (
          <div style={{ padding: '8px 12px', marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 8, background: '#1a1a1a', borderRadius: 10, border: 'none' }}>
            {referenceImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: 36, height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid #333' }}>
                <img src={img} alt={`Ref ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setReferenceImages?.(referenceImages.filter((_, i) => i !== idx))}
                  className="nodrag nopan"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >✕</button>
              </div>
            ))}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
               <span style={{ fontSize: 10, color: '#555' }}>{referenceImages.length} context items</span>
            </div>
          </div>
        )}

        {displaySuggestions && displaySuggestions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {displaySuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => submitText(s, true)}
                disabled={isGenerating || isChatting || disabled}
                className="nodrag nopan"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 20, 
                  padding: '5px 12px', 
                  color: '#bbb', 
                  fontSize: 12, 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div style={{
          background: '#1a1a1a',
          borderRadius: 12,
          border: 'none',
          padding: '14px 14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transition: 'border-color 0.2s, box-shadow 0.2s, opacity 0.2s',
          opacity: isGenerating || isChatting || disabled ? 0.7 : 1,
        }}>
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            className="nodrag nopan nowheel"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={(e) => {
              if (e.currentTarget.parentElement && !isGenerating && !isChatting && !disabled) {
                e.currentTarget.parentElement.style.borderColor = '#4a4a4a';
                e.currentTarget.parentElement.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.05)';
              }
            }}
            onBlur={(e) => {
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.borderColor = '#2a2a2a';
                e.currentTarget.parentElement.style.boxShadow = 'none';
              }
            }}
            placeholder={isGenerating || isChatting ? "AI is generating..." : "Describe what you want to create…"}
            disabled={isGenerating || isChatting || disabled}
            maxLength={4000}
            aria-label="Chat input message"
            style={{
              width: '100%', minHeight: 40, maxHeight: 120,
              padding: 0, background: 'transparent', border: 'none',
              color: '#e0e0e0', fontSize: 13, fontFamily: 'inherit',
              resize: 'none', outline: 'none', lineHeight: 1.55,
              cursor: isGenerating || isChatting || disabled ? 'not-allowed' : 'text',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input 
              ref={imageInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
              aria-hidden="true"
            />
            <button onClick={handleImageClick} disabled={isGenerating || disabled}
             className="nodrag nopan"
             onMouseDown={(e) => e.stopPropagation()}
             onPointerDown={(e) => e.stopPropagation()}
             aria-label="Attach context image"
             style={{ width: 28, height: 28, borderRadius: 8, background: referenceImages.length > 0 ? 'rgba(34,197,94,0.15)' : 'transparent', border: 'none', color: referenceImages.length > 0 ? '#22c55e' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
             title="Attach context image">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
             </svg>
            </button>

            <button onClick={() => setIsCameraOpen(true)} disabled={isGenerating || disabled}
             className="nodrag nopan"
             onMouseDown={(e) => e.stopPropagation()}
             onPointerDown={(e) => e.stopPropagation()}
             aria-label="Take picture"
             style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
             title="Take picture">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
               <circle cx="12" cy="13" r="4" />
             </svg>
            </button>

            <div style={{ position: 'relative' }}>
             <button onClick={() => setIsAssetPickerOpen(!isAssetPickerOpen)} disabled={isGenerating || disabled}
               className="nodrag nopan"
               onMouseDown={(e) => e.stopPropagation()}
               onPointerDown={(e) => e.stopPropagation()}
               aria-label="Pick from assets"
               style={{ width: 28, height: 28, borderRadius: 8, background: isAssetPickerOpen ? 'rgba(59,130,246,0.15)' : 'transparent', border: 'none', color: isAssetPickerOpen ? '#3b82f6' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
               title="Pick from assets">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="4" y1="9" x2="20" y2="9"></line>
                 <line x1="4" y1="15" x2="20" y2="15"></line>
                 <line x1="10" y1="3" x2="8" y2="21"></line>
                 <line x1="16" y1="3" x2="14" y2="21"></line>
               </svg>
             </button>
             <AssetPickerOverlay 
               isOpen={isAssetPickerOpen} 
               onClose={() => setIsAssetPickerOpen(false)} 
               assets={assets}
               canvasImages={canvasImages}
               onSelectImage={(url) => setReferenceImages?.([...referenceImages, url])}
             />
            </div>

            {/* Tags (if any) */}
            {tags.map((tag) => {
              const label = tag.label;
              const isActive = activeTags.has(label);
              const iconType = tag.icon || 'clock';
              return (
                <button 
                  key={label} 
                  className="nodrag nopan"
                  onClick={() => toggleTag(tag)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-pressed={isActive}
                  aria-label={`Toggle tag ${label}`}
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
                  {label}
                </button>
              );
            })}

            <div style={{ flex: 1 }} />

            <button
              onClick={() => submitText(inputValue, false)}
              disabled={!inputValue.trim() || isGenerating || isChatting || disabled}
              className="nodrag nopan"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: inputValue.trim() && !isGenerating && !disabled
                  ? '#e0e0e0' : '#2a2a2a',
                border: 'none',
                color: inputValue.trim() && !isGenerating && !disabled ? '#000' : '#555',
                cursor: inputValue.trim() && !isGenerating && !disabled ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
              }}
              title="Send message"
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
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

        @keyframes chatui-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={(dataUrl) => {
          setReferenceImages?.([...referenceImages, dataUrl]);
          notifyUser('Image added as context', 'success');
        }} 
      />
    </div>
  );
});

// --- OPTIMIZED SUB-COMPONENTS ---

interface MessageContentProps {
  content: string;
  isActive: boolean;
  onImportWorkflow?: (workflow: any) => void;
  onMergeWorkflow?: (workflow: any) => void;
  onSetNodes?: (nodes: any[]) => void;
  onSetEdges?: (edges: any[]) => void;
  onApplyActions?: (actions: any[]) => void;
  onNotify?: (message: string, type: any) => void;
}

const MessageContent: FC<MessageContentProps> = React.memo(({ 
  content, 
  isActive, 
  onImportWorkflow, 
  onMergeWorkflow, 
  onSetNodes, 
  onSetEdges, 
  onApplyActions, 
  onNotify 
}) => {
  const parts = useMemo(() => {
    const res: { type: 'text' | 'workflow' | 'canvas_actions' | 'code'; content?: string; data?: any }[] = [];
    const safeContent = typeof content === 'string' ? content : String(content);
    const jsonRegex = /```(?:json)?\n([\s\S]*?)\n```/g;
    let lastIndex = 0, match;
    
    try {
      while ((match = jsonRegex.exec(safeContent)) !== null) {
        if (match.index > lastIndex) {
          res.push({ type: 'text', content: safeContent.substring(lastIndex, match.index) });
        }
        try {
          const parsed = JSON.parse(match[1]);
          if (parsed.canvas_actions) {
            res.push({ type: 'canvas_actions', data: parsed.canvas_actions });
          } else if (parsed.nodes || (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type)) {
            res.push({ type: 'workflow', data: parsed });
          } else {
            res.push({ type: 'code', content: match[0] });
          }
        } catch {
          res.push({ type: 'code', content: match[0] });
        }
        lastIndex = jsonRegex.lastIndex;
      }
      if (lastIndex < safeContent.length) {
        res.push({ type: 'text', content: safeContent.substring(lastIndex) });
      }
    } catch (e) {
      console.error('[ChatUI] Content rendering error:', e);
      res.push({ type: 'text', content: safeContent });
    }
    if (res.length === 0) res.push({ type: 'text', content: safeContent });
    return res;
  }, [content]);

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return isActive ? (
            <DecodedText key={i} text={part.content || ''} active />
          ) : (
            <span key={i} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{part.content}</span>
          );
        }
        
        if (part.type === 'workflow') {
          return (
            <div key={i} style={{ marginTop: 12, marginBottom: 12, padding: 12, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                AI Generated Workflow
              </div>
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <button 
                  aria-label="Import generated workflow"
                  className="nodrag nopan"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    try {
                      const nodes = part.data.nodes || part.data;
                      const edges = part.data.edges || [];
                      const name = part.data.name || 'AI Generated Workflow';
                      if (Array.isArray(nodes)) {
                        if (onImportWorkflow) {
                          onImportWorkflow({ name, nodes, edges });
                        } else {
                          onSetNodes?.(nodes); 
                          onSetEdges?.(edges);
                        }
                        onNotify?.(`Imported ${nodes.length} nodes as new workflow`, 'success');
                      } else {
                        onNotify?.('Invalid workflow data in message', 'error');
                      }
                    } catch (e) {
                      onNotify?.('Failed to import workflow from message', 'error');
                    }
                  }} 
                  style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Create New Workflow
                </button>
                <button 
                  aria-label="Merge into current canvas"
                  className="nodrag nopan"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    try {
                      const nodes = part.data.nodes || part.data;
                      const edges = part.data.edges || [];
                      const name = part.data.name || 'AI Generated Workflow';
                      if (Array.isArray(nodes)) {
                        if (onMergeWorkflow) {
                          onMergeWorkflow({ name, nodes, edges });
                        }
                        onNotify?.(`Merged ${nodes.length} nodes into canvas`, 'success');
                      } else {
                        onNotify?.('Invalid workflow data in message', 'error');
                      }
                    } catch (e) {
                      onNotify?.('Failed to merge workflow from message', 'error');
                    }
                  }} 
                  style={{ background: '#2a2a2a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  Add to Current Canvas
                </button>
              </div>
            </div>
          );
        }

        if (part.type === 'canvas_actions') {
          return (
            <div key={i} style={{ marginTop: 12, marginBottom: 12, padding: 12, background: 'rgba(56, 189, 248, 0.05)', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: 11, color: '#38bdf8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Auto-applied Canvas Edits ({part.data?.length || 0})
              </div>
              
              <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: 11, color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {part.data?.map((action: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#38bdf8' }} />
                    <span style={{ color: '#7dd3fc', fontWeight: 600, fontSize: 10 }}>{action.action}</span>
                    <span style={{ opacity: 0.8 }}>{action.id || action.type || 'item'}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <pre key={i} style={{ 
            background: '#111', padding: 8, borderRadius: 4, 
            overflowX: 'auto', fontSize: 11, marginTop: 8, marginBottom: 8,
            border: '1px solid #222'
          }}>
            <code>{part.content}</code>
          </pre>
        );
      })}
    </>
  );
});

interface ChatMessageItemProps {
  message: Message;
  isActive: boolean;
  currentUserAvatar?: string;
  currentUserDisplayName?: string;
  onImportWorkflow?: (workflow: any) => void;
  onMergeWorkflow?: (workflow: any) => void;
  onSetNodes?: (nodes: any[]) => void;
  onSetEdges?: (edges: any[]) => void;
  onApplyActions?: (actions: any[]) => void;
  onNotify?: (message: string, type: any) => void;
}

const ChatMessageItem: FC<ChatMessageItemProps> = React.memo(({ 
  message, 
  isActive, 
  currentUserAvatar, 
  currentUserDisplayName,
  onImportWorkflow,
  onMergeWorkflow,
  onSetNodes,
  onSetEdges,
  onApplyActions,
  onNotify
}) => {
  const isUser = (message.role ?? message.type) === 'user';
  
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '92%',
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10,
      alignItems: 'flex-end',
      marginBottom: 4
    }}>
      <div style={{ flexShrink: 0, marginBottom: 2 }}>
        {isUser ? (
          <Avatar 
            src={currentUserAvatar} 
            name={currentUserDisplayName || 'User'} 
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
        padding: '10px 14px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#2a2a2a' : '#1a1a1a',
        border: isUser ? '1px solid #3a3a3a' : '1px solid #2a2a2a',
        color: isUser ? '#fff' : '#d4d4d4', 
        fontSize: 13, 
        lineHeight: 1.55,
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {isUser ? (
          message.content
        ) : (
          <MessageContent 
            content={message.content} 
            isActive={isActive}
            onImportWorkflow={onImportWorkflow}
            onMergeWorkflow={onMergeWorkflow}
            onSetNodes={onSetNodes}
            onSetEdges={onSetEdges}
            onApplyActions={onApplyActions}
            onNotify={onNotify}
          />
        )}
      </div>
    </div>
  );
});

export default ChatUI;
