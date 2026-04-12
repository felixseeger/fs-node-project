import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ChatWindowProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  height?: number | string;
}

export function ChatWindow({
  title = "AI Assistant",
  isOpen,
  onClose,
  children,
  headerActions,
  footer,
  width = 360,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children, isOpen]);

  // Mobile layout fills screen. Desktop relies on bottom/right docking
  const positionStyles = isMobile ? {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  } : {
    top: 'var(--be-space-lg)',
    right: 'var(--be-space-lg)',
    bottom: 112,
    width: width,
    borderRadius: 'var(--be-radius-lg)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 50 : 30, scale: isMobile ? 1 : 0.9, originY: 1, originX: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isMobile ? 50 : 20, scale: isMobile ? 1 : 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30, 
            mass: 0.8 
          }}
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--be-surface-canvas)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isMobile ? 'none' : '1px solid var(--be-border-default)',
            overflow: 'hidden',
            boxShadow: 'var(--be-shadow-lg)',
            zIndex: 2100,
            isolation: 'isolate',
            ...positionStyles
          } as any}
        >
          {/* Header */}
          <div style={{
            padding: 'var(--be-space-sm) var(--be-space-md)',
            borderBottom: '1px solid var(--be-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--be-surface-raised)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-sm)' }}>
              <div style={{ 
                width: 8, height: 8, borderRadius: 'var(--be-radius-full)', 
                background: 'var(--be-ui-success)',
                boxShadow: 'var(--be-shadow-success)'
              }} />
              <span style={{ 
                fontSize: 'var(--be-font-size-md)', 
                fontWeight: 600, 
                color: 'var(--be-text-primary)' 
              }}>{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-xs)' }}>
              {headerActions}
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'var(--be-surface-sunken)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{ 
                  width: 28, height: 28, borderRadius: 'var(--be-radius-sm)', 
                  background: 'transparent', border: 'none', 
                  color: 'var(--be-text-muted)', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--be-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--be-text-muted)'}
                title="Close chat"
              >
                ✕
              </motion.button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--be-space-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--be-space-xs)'
            }}
          >
            {children}
          </div>

          {/* Footer / Input Area */}
          {footer && (
            <div style={{ 
              padding: 'var(--be-space-3) var(--be-space-md) var(--be-space-md)', 
              borderTop: '1px solid var(--be-border-subtle)',
              background: 'var(--be-surface-sunken)',
              // Add env(safe-area-inset-bottom) for modern mobile browsers
              paddingBottom: 'calc(var(--be-space-md) + env(safe-area-inset-bottom, 0px))'
            }}>
              {footer}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatWindow;
