import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import DecodedText from './DecodedText';


const THINKING_PHRASES = [
  'Analyzing request...',
  'Structuring nodes...',
  'Wiring up models...',
  'Tuning parameters...',
  'Finalizing workflow...'
];

const DEFAULT_TAGS = ['Portrait', '10s'];

const ChatUI = forwardRef(({
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
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm here to help you build your AI workflow. Describe what you'd like to create, and I'll guide you through it.",
      timestamp: new Date(),
    },
  ]);
  const [activeTags, setActiveTags] = useState(() => new Set(tags));

  const [thinkingIndex, setThinkingIndex] = useState(0);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-scroll to bottom of messages (scrollIntoView may be absent in test env)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Cycle thinking phrases
  useEffect(() => {
    let interval;
    if (isGenerating || isChatting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThinkingIndex(0);
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating, isChatting]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isGenerating || isChatting) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  }, [inputValue, isGenerating, isChatting, onSendMessage]);

  const handleGenerate = useCallback(() => {
    if (isGenerating || disabled) return;
    const messageToGenerate = inputValue.trim();
    if (!messageToGenerate) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToGenerate,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    onGenerate?.(messageToGenerate);
  }, [inputValue, isGenerating, disabled, onGenerate]);

  useImperativeHandle(ref, () => ({
    submitGeneration: () => {
      handleGenerate();
    },
    addMessage: (message) => {
      const msg = {
        id: Date.now(),
        type: message.type || 'assistant',
        content: message.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
    }
  }), [handleGenerate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage?.(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-testid="chat-ui"
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        bottom: 112,
        width: 320,
        zIndex: 2100,

        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a1a',
        borderRadius: 12,
        border: '1px solid #333',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #333',
          background: '#1f1f1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#e0e0e0',
            }}
          >
            AI Assistant
          </span>
        </div>

        {/* Close Button */}
        <button
          data-testid="chat-close"
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#e0e0e0';
            e.target.style.background = '#333';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#888';
            e.target.style.background = 'transparent';
          }}
          title="Close chat"
        >
          &#10005;
        </button>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((msg, idx) => {
          const messageRole = msg.role ?? msg.type ?? 'assistant';
          const isUser = messageRole === 'user';

          return (
          <div
            key={msg.id ?? `${messageRole}-${idx}`}
            style={{
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: isUser ? '#3b82f6' : '#2a2a2a',
              color: isUser ? '#fff' : '#e0e0e0',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {!isUser && idx === messages.length - 1 ? (
              <DecodedText text={msg.content} active={true} />
            ) : (
              msg.content
            )}
          </div>
        )})}

        {/* Thinking Indicator */}
        {(isGenerating || isChatting) && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '12px 12px 12px 4px',
              background: 'linear-gradient(145deg, #2a2a2a 0%, #222 100%)',
              color: '#a0a0a0',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid #333',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite', color: '#a78bfa' }}>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <span style={{ animation: 'pulseOpacity 2s ease-in-out infinite' }}>
              <DecodedText
                text={isGenerating ? THINKING_PHRASES[thinkingIndex] : "Thinking..."}
                active={true}
                speed={70}
              />
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: 12,
          borderTop: '1px solid #333',
          background: '#1f1f1f',
        }}
      >
        {/* Text Input */}
        {/* Reference Image Preview */}
        {referenceImage && (
          <div style={{
            padding: '8px 12px',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#222',
            borderRadius: 8,
            border: '1px solid #333',
            position: 'relative',
          }}>
            <div style={{ position: 'relative', width: 40, height: 40 }}>
              <img
                src={referenceImage}
                alt="Ref"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#aaa' }}>Reference Image</div>
              <div style={{ fontSize: 10, color: '#666' }}>Attached to prompt</div>
            </div>
            <button
              onClick={() => setReferenceImage?.(null)}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#333',
                border: 'none',
                color: '#fff',
                fontSize: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>
          </div>
        )}

        <div
          style={{
            position: 'relative',
            background: '#141414',
            borderRadius: 10,
            border: '1px solid #333',
          }}
        >
          <textarea
            data-testid="chat-input"
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating || isChatting ? "AI is thinking..." : "Describe what you want to create..."}
            disabled={isGenerating || isChatting || disabled}
            style={{
              width: '100%',
              minHeight: 44,
              maxHeight: 120,
              padding: '12px 80px 12px 14px',
              background: 'transparent',
              border: 'none',
              borderRadius: 10,
              color: '#e0e0e0',
              fontSize: 13,
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            data-testid="chat-send"
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isGenerating || isChatting || disabled}
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: inputValue.trim() && !isGenerating && !isChatting ? '#3b82f6' : '#333',
              border: 'none',
              color: '#fff',
              cursor: inputValue.trim() && !isGenerating && !isChatting ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              transition: 'background 0.2s',
            }}
          >
            &#9654;
          </button>

          {/* Image button */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={handleImageClick}
            disabled={isGenerating || isChatting || disabled}
            style={{
              position: 'absolute',
              right: 44,
              bottom: 8,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: referenceImage ? 'rgba(34, 197, 94, 0.2)' : '#2a2a2a',
              border: `1px solid ${referenceImage ? '#22c55e' : '#333'}`,
              color: referenceImage ? '#22c55e' : '#888',
              cursor: isGenerating || isChatting || disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            title="Add reference image"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        </div>

        {/* Generate workflow — primary action for AI graph generation */}
        <div style={{ marginTop: 10 }}>
          <button
            data-testid="chat-generate"
            type="button"
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isGenerating || disabled}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #2563eb',
              background: inputValue.trim() && !isGenerating && !disabled ? '#2563eb' : '#2a2a2a',
              color: inputValue.trim() && !isGenerating && !disabled ? '#fff' : '#666',
              fontSize: 13,
              fontWeight: 600,
              cursor: inputValue.trim() && !isGenerating && !disabled ? 'pointer' : 'not-allowed',
            }}
          >
            {isGenerating ? 'Generating workflow…' : 'Generate workflow'}
          </button>
        </div>

        {/* Tags Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            flexWrap: 'wrap',
          }}
        >
          {/* History icon */}
          <button
            type="button"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: '#2a2a2a',
              border: '1px solid #333',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
            }}
            title="History"
          >
            &#8634;
          </button>

          {/* Tags */}
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '4px 10px',
                borderRadius: 12,
                background: activeTags.has(tag) ? '#3b82f6' : '#2a2a2a',
                border: `1px solid ${activeTags.has(tag) ? '#3b82f6' : '#333'}`,
                color: activeTags.has(tag) ? '#fff' : '#888',
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tag}
            </button>
          ))}

          {/* Clear tags button */}
          {activeTags.size > 0 && (
            <button
              onClick={() => setActiveTags(new Set())}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
              title="Clear all tags"
            >
              &times;
            </button>
          )}

          <button
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isGenerating || isChatting || disabled}
            style={{
              marginLeft: 'auto',
              height: 28,
              padding: '0 12px',
              borderRadius: 8,
              background: inputValue.trim() && !isGenerating && !isChatting && !disabled ? '#22c55e' : '#2a2a2a',
              border: `1px solid ${inputValue.trim() && !isGenerating && !isChatting && !disabled ? '#22c55e' : '#333'}`,
              color: inputValue.trim() && !isGenerating && !isChatting && !disabled ? '#04130a' : '#666',
              cursor: inputValue.trim() && !isGenerating && !isChatting && !disabled ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.02em',
              transition: 'all 0.2s',
            }}
            title="Generate a workflow from this prompt"
          >
            Generate
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
});

export default ChatUI;
