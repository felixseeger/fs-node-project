import { motion, AnimatePresence } from 'framer-motion';

export interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
  useShader?: boolean;
}

export function ChatToggle({ 
  isOpen, 
  onClick, 
  unreadCount = 0
}: ChatToggleProps) {
  
  // Note: Paper-design shaders omitted to fix module resolution, 
  // keeping the DOM element ready if we re-integrate it later.

  return (
    <>
      <style>{`
        .be-chat-toggle {
          position: absolute;
          right: var(--be-space-6);
          bottom: var(--be-space-6);
          z-index: 2000;
          width: 56px;
          height: 56px;
          padding: 0;
          border: none;
          border-radius: var(--be-radius-full);
          background: var(--be-surface-canvas);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          isolation: isolate;
          box-shadow: var(--be-shadow-md);
          }

          .be-chat-toggle:hover {
          transform: scale(1.1);
          }

          .be-chat-toggle:active {
          transform: scale(0.95);
          }

          .be-chat-toggle--open {
          background: var(--be-color-accent);
          box-shadow: var(--be-shadow-accent);
          }

        .be-chat-toggle__outline {
          position: absolute;
          inset: -3px;
          border-radius: var(--be-radius-full);
          z-index: 0;
        }

        .be-chat-toggle__outline::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: inherit;
          background: var(--be-gradient-ai);
          filter: grayscale(1);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          transition: filter 0.35s ease;
          opacity: 0.5;
        }

        .be-chat-toggle:hover .be-chat-toggle__outline::before,
        .be-chat-toggle--open .be-chat-toggle__outline::before {
          filter: grayscale(0);
          opacity: 1;
        }

        .be-chat-toggle__icon {
          position: relative;
          z-index: 3;
          color: var(--be-text-muted);
          transition: color 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .be-chat-toggle--open .be-chat-toggle__icon,
        .be-chat-toggle:hover .be-chat-toggle__icon {
          color: var(--be-text-primary);
        }

        .be-chat-toggle__badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 20px;
          height: 20px;
          padding: 0 var(--be-space-1);
          border-radius: var(--be-radius-pill);
          background: var(--be-ui-error);
          color: var(--be-text-primary);
          font-size: var(--be-font-size-xs);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--be-color-bg);
          z-index: 4;
        }
      `}</style>

      <button
        type="button"
        className={`be-chat-toggle ${isOpen ? 'be-chat-toggle--open' : ''}`}
        onClick={onClick}
        title={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        <span className="be-chat-toggle__outline" />

        <div className="be-chat-toggle__icon">
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.svg
                key="close-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute' }}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute' }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        {unreadCount > 0 && !isOpen && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="be-chat-toggle__badge"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>
    </>
  );
}

export default ChatToggle;
