import React, { type FC, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Icon, { type IconName } from './Icon';

export interface NavbarProps {
  logo?: ReactNode;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glass?: boolean;
}

export const Navbar: FC<NavbarProps> = ({
  logo,
  leftContent,
  centerContent,
  rightContent,
  className = '',
  style = {},
  glass = true,
}) => {
  return (
    <nav
      className={`be-navbar ${className}`}
      style={{
        height: 'var(--be-space-8, 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--be-space-4)',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 1000,
        ...(glass ? {
          background: 'var(--be-glass-bg)',
          backdropFilter: 'blur(var(--be-glass-blur))',
          WebkitBackdropFilter: 'blur(var(--be-glass-blur))',
          borderBottom: '1px solid var(--be-glass-border)',
        } : {
          background: 'var(--be-color-bg)',
          borderBottom: '1px solid var(--be-color-border)',
        }),
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-4)' }}>
        {logo && <div className="be-navbar-logo">{logo}</div>}
        {leftContent && <div className="be-navbar-left">{leftContent}</div>}
      </div>

      {centerContent && (
        <div 
          style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--be-space-4)',
          }}
          className="be-navbar-center"
        >
          {centerContent}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--be-space-4)' }}>
        {rightContent && <div className="be-navbar-right">{rightContent}</div>}
      </div>
    </nav>
  );
};

export interface NavLinkProps {
  label: string;
  icon?: IconName;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const NavLink: FC<NavLinkProps> = ({
  label,
  icon,
  active = false,
  onClick,
  href,
  className = '',
}) => {
  const content = (
    <motion.div
      whileHover={{ color: 'var(--be-color-text)' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--be-space-2)',
        fontSize: 'var(--be-font-size-md)',
        fontWeight: 500,
        color: active ? 'var(--be-color-text)' : 'var(--be-color-text-muted)',
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        padding: 'var(--be-space-1) var(--be-space-2)',
        borderRadius: 'var(--be-radius-sm)',
        textDecoration: 'none',
      }}
    >
      {icon && <Icon name={icon} size={16} crt={active} />}
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="nav-active-indicator"
          style={{
            position: 'absolute',
            bottom: -12,
            left: 0,
            right: 0,
            height: 2,
            background: 'var(--be-color-accent)',
            boxShadow: 'var(--be-shadow-accent)',
          }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className={`be-nav-link ${className}`} onClick={onClick} style={{ textDecoration: 'none' }}>
        {content}
      </a>
    );
  }

  return (
    <div className={`be-nav-link ${className}`} onClick={onClick}>
      {content}
    </div>
  );
};

export default Navbar;
