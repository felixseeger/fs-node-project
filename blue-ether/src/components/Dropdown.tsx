import React, { useState, useRef, useEffect, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon, { type IconName } from './Icon';

export interface DropdownItem {
  id: string;
  label?: string;
  icon?: IconName;
  type?: 'divider';
  shortcut?: string;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onItemClick?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  align?: 'left' | 'right';
}

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  items,
  onItemClick,
  className = '',
  style = {},
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`be-dropdown ${className}`} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              [align]: 0,
              marginTop: 'var(--be-space-2)',
              minWidth: 180,
              background: 'var(--be-color-surface)',
              border: '1px solid var(--be-color-border)',
              borderRadius: 'var(--be-radius-lg)',
              padding: 'var(--be-space-1)',
              boxShadow: 'var(--be-shadow-lg)',
              zIndex: 1100,
              backdropFilter: 'blur(var(--be-glass-blur))',
            }}
          >
            {items.map((item) => (
              item.type === 'divider' ? (
                <div
                  key={item.id}
                  style={{
                    height: 1,
                    background: 'var(--be-color-border)',
                    margin: 'var(--be-space-1) var(--be-space-2)',
                  }}
                />
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    onItemClick?.(item.id);
                    setIsOpen(false);
                  }}
                  className={`be-dropdown-item ${item.danger ? 'danger' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: 'var(--be-space-2) var(--be-space-3)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--be-radius-md)',
                    color: item.danger ? 'var(--be-text-error)' : 'var(--be-color-text-muted)',
                    fontSize: 'var(--be-font-size-md)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-3)' }}>
                    {item.icon && <Icon name={item.icon} size={16} style={{ opacity: 0.7 }} />}
                    <span>{item.label}</span>
                  </span>
                  {item.shortcut && (
                    <span style={{ fontSize: 'var(--be-font-size-xs)', opacity: 0.5, marginLeft: 'var(--be-space-4)' }}>
                      {item.shortcut}
                    </span>
                  )}
                </button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
