import React from 'react';
import { createPortal } from 'react-dom';

interface StorageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string;
}

export const StorageLimitModal: React.FC<StorageLimitModalProps> = ({ 
  isOpen, 
  onClose,
  title,
  message,
  details
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        padding: 32,
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: 24 }}>{title}</h2>
          <p style={{ color: 'var(--color-text-dim)', marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
            {message}
          </p>
          {details && (
            <p style={{ color: 'var(--color-text-dim)', marginTop: 8, fontSize: 14, lineHeight: 1.5, fontWeight: 'bold' }}>
              {details}
            </p>
          )}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '16px',
              background: 'var(--color-brand-blue)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              fontWeight: 600
            }}
          >
            Understood
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-dim)',
            cursor: 'pointer',
            fontSize: 20
          }}
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
};
