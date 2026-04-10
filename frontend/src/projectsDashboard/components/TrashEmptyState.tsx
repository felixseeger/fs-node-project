import type { FC } from 'react';
import { Icons } from '../icons';

export const TrashEmptyState: FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: 'var(--color-surface)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <span style={{ width: 20, height: 20 }}>{Icons.Grid}</span>
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 8px 0',
        }}
      >
        Nothing in the trash
      </h3>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-text-muted)',
          margin: '0 0 32px 0',
        }}
      >
        Recently deleted boards will appear here. Items are permanently deleted after 30 days.
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: '12px 24px',
          color: 'var(--color-text)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-hover)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
        }}
      >
        Back to my boards
      </button>
    </div>
  );
};
