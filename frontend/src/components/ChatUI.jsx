import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const THINKING_PHRASES = [
  'Analyzing request...',
  'Structuring nodes...',
  'Wiring up models...',
  'Tuning parameters...',
  'Finalizing workflow...'
];

const ChatUI = forwardRef(({
  isOpen,
  onClose,
  onSendMessage,
  onGenerate,
  isGenerating,
  tags = [],
  disabled = false,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hi! I\'m here to help you build your AI workflow. Describe what you\'d like to create, and I\'ll guide you through it.',
      timestamp: new Date(),
    },
  ]);
  const [activeTags, setActiveTags] = useState(new Set(['Portrait', '10s']));
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Cycle thinking phrases
  useEffect(() => {
    let interval;
    if (isGenerating) {
      setThinkingIndex(0);
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  useImperativeHandle(ref, () => ({
    submitGeneration: () => {
      handleGenerate();
    }
  }));

  const handleSend = () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  const handleGenerate = () => {
    if (isGenerating || disabled) return;
    // Pass the current input value to generate workflow from
    const messageToGenerate = inputValue.trim();
    if (messageToGenerate) {
      // Add user message to chat first
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: messageToGenerate,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setInputValue('');

      // Call onGenerate with the message
      onGenerate?.(messageToGenerate);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 720,
        height: 480,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a1a',
        borderRadius: 12,
        border: '1px solid #333',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: msg.type === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.type === 'user' ? '#3b82f6' : '#2a2a2a',
              color: msg.type === 'user' ? '#fff' : '#e0e0e0',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {msg.content}
          </div>
        ))}

        {/* Thinking Indicator */}
        {isGenerating && (
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
              {THINKING_PHRASES[thinkingIndex]}
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
        <div
          style={{
            position: 'relative',
            background: '#141414',
            borderRadius: 10,
            border: '1px solid #333',
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create..."
            disabled={isGenerating}
            style={{
              width: '100%',
              minHeight: 44,
              maxHeight: 120,
              padding: '12px 44px 12px 14px',
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
            onClick={handleSend}
            disabled={!inputValue.trim() || isGenerating}
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              width: 28,
              height: 28,
              borderRadius: 6,
              background: inputValue.trim() && !isGenerating ? '#3b82f6' : '#333',
              border: 'none',
              color: '#fff',
              cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              transition: 'background 0.2s',
            }}
          >
            &#9654;
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
          {['Portrait', '10s'].map((tag) => (
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
