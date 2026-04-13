import React, { type FC, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'pill' | 'underline';
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className = '',
  style = {},
  variant = 'pill',
}) => {
  return (
    <div
      className={`be-tabs ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: variant === 'pill' ? 'var(--be-surface-sunken)' : 'transparent',
        borderRadius: variant === 'pill' ? 'var(--be-radius-md)' : 0,
        padding: variant === 'pill' ? 'var(--be-space-1)' : 0,
        borderBottom: variant === 'underline' ? '1px solid var(--be-color-border)' : 'none',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              position: 'relative',
              padding: 'var(--be-space-2) var(--be-space-4)',
              fontSize: 'var(--be-font-size-md)',
              fontWeight: 600,
              color: isActive ? 'var(--be-color-text)' : 'var(--be-color-text-muted)',
              background: 'transparent',
              border: 'none',
              borderRadius: variant === 'pill' ? 'var(--be-radius-sm)' : 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--be-space-2)',
              transition: 'color 0.2s ease',
              outline: 'none',
            }}
          >
            {tab.icon}
            <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
            
            {isActive && variant === 'pill' && (
              <motion.div
                layoutId="active-tab-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--be-glass-bg-hover)',
                  borderRadius: 'var(--be-radius-sm)',
                  border: '1px solid var(--be-glass-border)',
                  boxShadow: 'var(--be-shadow-sm)',
                }}
              />
            )}

            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="active-tab-underline"
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'var(--be-color-accent)',
                  boxShadow: 'var(--be-shadow-accent)',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
