import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  maxHeight?: number;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
  leftActions,
  rightActions,
  maxHeight = 150
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }, [value, maxHeight]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <motion.div 
      layout
      animate={{
        borderColor: isFocused ? 'var(--be-color-accent)' : 'var(--be-border-default)',
        boxShadow: isFocused 
          ? '0 0 0 1px var(--be-color-accent), var(--be-shadow-sm)' 
          : 'var(--be-shadow-sm)'
      }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--be-surface-sunken)',
        borderRadius: 'var(--be-radius-md)',
        border: '1px solid var(--be-border-default)',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          minHeight: 24,
          maxHeight: maxHeight,
          padding: 0,
          background: 'transparent',
          border: 'none',
          color: 'var(--be-text-primary)',
          fontSize: 'var(--be-font-size-md)',
          fontFamily: 'var(--be-font-sans)',
          resize: 'none',
          outline: 'none',
          lineHeight: 1.5,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {leftActions}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {rightActions}
          <AnimatePresence mode="popLayout">
            {value.trim() && !disabled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onClick={handleSend}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--be-radius-sm)',
                  background: 'var(--be-color-accent)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--be-font-size-sm)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                Send
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatInput;
