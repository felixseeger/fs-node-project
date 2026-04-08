import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import DecodedText from './DecodedText';

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
  isGenerating = false,
  isChatting = false,
  messages = [],
  disabled = false,
  referenceImage = null,
  setReferenceImage,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTags, setActiveTags] = useState(new Set(['Portrait', '10s']));
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleGenerate = () => {
    if (isGenerating || disabled) return;
    const messageToGenerate = inputValue.trim();
    if (messageToGenerate) {
      setInputValue('');
      onGenerate?.(messageToGenerate);
    }
  };

  useImperativeHandle(ref, () => ({
    submitGeneration: () => {
      handleGenerate();
    }
  }));

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleSend = () => {
    if (!inputValue.trim() || isGenerating || isChatting) return;

    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e) => {
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
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 720,
        height: 480,
        zIndex: 2100,
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
        {messages.map((msg, idx) => (
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
            {msg.type === 'assistant' && idx === messages.length - 1 ? (
              <DecodedText text={msg.content} active={true} />
            ) : (
              msg.content
            )}
          </div>
        ))}

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
