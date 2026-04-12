import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../Avatar';
import type { ChatMessageData } from './types';

export interface ChatMessageProps {
  message: ChatMessageData;
  children?: ReactNode;
  showAvatar?: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, children, showAvatar = true }) => {
  const isUser = message.type === 'user';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: isUser ? "bottom right" : "bottom left" }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 1,
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 'var(--be-space-xs)',
        width: '100%',
        marginBottom: 'var(--be-space-3)',
        position: 'relative'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 'var(--be-space-sm)',
        maxWidth: '90%'
      }}>
        {showAvatar && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          >
            <Avatar 
              size="sm" 
              name={isUser ? "User" : "AI"} 
              crt={!isUser}
              className="chat-message-avatar"
            />
          </motion.div>
        )}
        <motion.div 
          whileHover={{ y: -1 }}
          style={{
            padding: 'var(--be-space-sm) var(--be-space-3)',
            borderRadius: isUser ? 'var(--be-radius-pill) var(--be-radius-pill) var(--be-radius-sm) var(--be-radius-pill)' : 'var(--be-radius-pill) var(--be-radius-pill) var(--be-radius-pill) var(--be-radius-sm)',
            background: isUser ? 'var(--be-color-accent)' : 'var(--be-surface-raised)',
            border: '1px solid var(--be-border-subtle)',
            color: 'var(--be-text-primary)',
            fontSize: 'var(--be-font-size-sm)',
            lineHeight: 1.5,
            wordBreak: 'break-word',
            boxShadow: 'var(--be-shadow-sm)',
            transformOrigin: isUser ? "bottom right" : "bottom left"
          }}
        >
          {children || message.content}
        </motion.div>
      </div>
      {message.timestamp && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            fontSize: 'var(--be-font-size-xs)', 
            color: 'var(--be-text-muted)',
            margin: isUser ? '0 48px 0 0' : '0 0 0 48px'
          }}
        >
          {typeof message.timestamp === 'string' 
            ? message.timestamp 
            : message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.span>
      )}
    </motion.div>
  );
};

export default ChatMessage;
