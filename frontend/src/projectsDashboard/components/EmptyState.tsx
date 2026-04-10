import type { FC } from 'react';
import { DecodeTextButton } from 'blue-ether';
import type { EmptyStateProps } from '../types';
import { Icons } from '../icons';

export const EmptyState: FC<EmptyStateProps> = ({ title, hint, message, actionLabel, onAction, compact }) => {
  const displayHint = hint ?? message;
  return (
    <div
      style={{
        gridColumn: compact ? undefined : '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: compact ? 'stretch' : 'center',
        justifyContent: 'center',
        padding: compact ? '12px 8px' : '48px 24px',
        textAlign: compact ? 'left' : 'center',
        fontFamily: 'var(--font-body)',
        gap: compact ? 6 : 8,
        minHeight: compact ? undefined : 280,
      }}
    >
      {!compact && <div style={{ fontSize: 40, marginBottom: 8, lineHeight: 1 }}>⚡</div>}
      {title && (
        <div
          style={{
            fontSize: compact ? 12 : 16,
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: compact ? 0 : 4,
          }}
        >
          {title}
        </div>
      )}
      {displayHint && (
        <div
          style={{
            fontSize: compact ? 11 : 13,
            color: 'var(--color-text-muted)',
            maxWidth: compact ? undefined : 360,
            lineHeight: 1.45,
          }}
        >
          {displayHint}
        </div>
      )}
      {!compact && actionLabel && onAction && (
        <DecodeTextButton
          variant="primary"
          startIcon={Icons.Plus}
          onClick={onAction}
          style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8 }}
        >
          {actionLabel}
        </DecodeTextButton>
      )}
    </div>
  );
};
