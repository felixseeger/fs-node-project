import React, { type FC, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Icon, { type IconName } from './Icon';

export interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
}

export const Sidebar: FC<SidebarProps> = ({
  isOpen,
  /* onToggle, */
  header,
  children,
  footer,
  className = '',
  style = {},
  width = 240,
}) => {
  return (
    <motion.aside
      className={`be-sidebar ${className}`}
      initial={false}
      animate={{ width: isOpen ? width : 64 }}
      style={{
        height: '100%',
        background: 'var(--be-color-surface)',
        borderRight: '1px solid var(--be-color-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 900,
        ...style,
      }}
    >
      {header && (
        <div style={{ padding: 'var(--be-space-4)', borderBottom: '1px solid var(--be-color-border)', flexShrink: 0 }}>
          {header}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 'var(--be-space-2)' }}>
        {children}
      </div>

      {footer && (
        <div style={{ padding: 'var(--be-space-4)', borderTop: '1px solid var(--be-color-border)', flexShrink: 0 }}>
          {footer}
        </div>
      )}
    </motion.aside>
  );
};

export interface SidebarItemProps {
  label: string;
  icon: IconName;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: string | number;
}

export const SidebarItem: FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  onClick,
  collapsed = false,
  badge,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ background: 'var(--be-glass-bg-hover)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--be-space-3)',
        padding: 'var(--be-space-2) var(--be-space-3)',
        borderRadius: 'var(--be-radius-md)',
        cursor: 'pointer',
        background: active ? 'var(--be-color-accent-muted)' : 'transparent',
        color: active ? 'var(--be-color-accent)' : 'var(--be-color-text-muted)',
        marginBottom: 'var(--be-space-1)',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      <Icon name={icon} size={20} crt={active} />
      
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            fontSize: 'var(--be-font-size-md)',
            fontWeight: active ? 600 : 500,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </motion.span>
      )}

      {!collapsed && badge !== undefined && (
        <div
          style={{
            marginLeft: 'auto',
            background: active ? 'var(--be-color-accent)' : 'var(--be-surface-raised)',
            color: active ? '#fff' : 'var(--be-color-text)',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 10,
            minWidth: 16,
            textAlign: 'center',
          }}
        >
          {badge}
        </div>
      )}

      {active && (
        <motion.div
          layoutId="sidebar-active-pill"
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: 3,
            background: 'var(--be-color-accent)',
            borderRadius: '0 4px 4px 0',
            boxShadow: 'var(--be-shadow-accent)',
          }}
        />
      )}
    </motion.div>
  );
};

export default Sidebar;
