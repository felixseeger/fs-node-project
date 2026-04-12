import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../Avatar';

export const ASCII_ANIMATIONS = {
  robot: [
    "d[ o_0 ]b",
    "d[ -_- ]b",
    "d[ 0_o ]b",
    "d[ O_O ]b",
  ],
  scanner: [
    "[ ¬ _ ¬ ]",
    "[ º _ º ]",
    "[ ⌐ _ ⌐ ]",
    "[ º _ º ]",
  ],
  magic: [
    "(∩^o^)⊃━☆    ",
    "(∩^o^)⊃━☆ﾟ   ",
    "(∩^o^)⊃━☆ﾟ.* ",
    "(∩^o^)⊃━☆ﾟ.*･",
  ],
  thinking: [
    "(￣ー￣)",
    "(￣。￣)",
    "(￣ー￣)",
    "(￣□￣)",
  ],
  focus: [
    " (•_•) ",
    " ( •_•)>",
    " (⌐■_■) ",
    " (⌐■_■) ",
  ]
};

export interface ChatLoaderProps {
  /** The ASCII animation sequence to play */
  variant?: keyof typeof ASCII_ANIMATIONS;
  /** The text to display alongside the animation */
  text?: string;
  /** Speed of the ASCII animation frame switch in ms */
  speed?: number;
  /** Whether to show the standard avatar circle next to the loader */
  showAvatar?: boolean;
}

export function ChatLoader({ 
  variant = 'robot', 
  text = "Thinking", 
  speed = 300,
  showAvatar = true
}: ChatLoaderProps) {
  const [frame, setFrame] = useState(0);
  const frames = ASCII_ANIMATIONS[variant] || ASCII_ANIMATIONS.robot;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, speed);
    return () => clearInterval(interval);
  }, [frames, speed]);

  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
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
        gap: 'var(--be-space-xs)',
        width: '100%',
        marginBottom: 'var(--be-space-3)'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 'var(--be-space-sm)',
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
          padding: 'var(--be-space-sm) var(--be-space-3)',
          borderRadius: 'var(--be-radius-pill) var(--be-radius-pill) var(--be-radius-pill) var(--be-radius-sm)',
          background: 'var(--be-surface-sunken)',
          border: '1px solid var(--be-border-default)',
          color: 'var(--be-text-muted)',
          fontSize: 'var(--be-font-size-sm)',
          lineHeight: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--be-space-3)',
          boxShadow: 'var(--be-shadow-sm)',
        }}>
          <motion.span 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: speed / 1000, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              fontFamily: 'var(--be-font-mono, monospace)', 
              fontSize: 'var(--be-font-size-md)', 
              fontWeight: 600,
              color: 'var(--be-color-accent)',
              minWidth: '6em',
              textAlign: 'center',
              whiteSpace: 'pre'
            }}
          >
            {frames[frame]}
          </motion.span>
          <span style={{
             transition: 'opacity 0.2s',
             opacity: 0.9,
             minWidth: '10em'
          }}>
            {text}{dots}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatLoader;
