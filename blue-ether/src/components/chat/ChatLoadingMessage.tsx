import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Avatar';
import DecodedText from './DecodedText';

const WITTY_PHRASES = [
  "Reticulating splines...",
  "Convincing the AI to work...",
  "Downloading more RAM...",
  "Consulting the digital oracle...",
  "Bribing the algorithms...",
  "Summoning the machine spirits...",
  "Aligning semantic vectors...",
  "Waking up the hamsters...",
  "Synthesizing brilliance...",
  "Polishing pixels..."
];

export interface ChatLoadingMessageProps {
  showAvatar?: boolean;
}

export function ChatLoadingMessage({ showAvatar = true }: ChatLoadingMessageProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % WITTY_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: "bottom left" }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        marginBottom: 12
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: '90%'
      }}>
        {showAvatar && (
          <Avatar 
            size="sm" 
            name="AI" 
            crt={true}
            className="chat-message-avatar"
          />
        )}
        <div style={{
          padding: '10px 14px',
          borderRadius: '16px 16px 16px 4px',
          background: 'var(--be-surface-raised)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--be-color-accent)',
          color: 'var(--be-color-accent)',
          fontSize: 'var(--be-font-size-sm)',
          lineHeight: 1.5,
          wordBreak: 'break-word',
          boxShadow: '0 0 12px var(--be-color-accent-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transformOrigin: "bottom left"
        }}>
          <motion.svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </motion.svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <DecodedText 
                text={WITTY_PHRASES[phraseIndex]} 
                active={true} 
                speed={40} 
                scrambleCount={3} 
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatLoadingMessage;
