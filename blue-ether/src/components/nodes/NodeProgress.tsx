import type { FC } from 'react';

export interface NodeProgressProps {
  progress?: number;
  status?: 'idle' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  compact?: boolean;
}

export const NodeProgress: FC<NodeProgressProps> = ({ 
  progress = 0, 
  status = 'idle', 
  message, 
  compact = false 
}) => {
  const statusColors: Record<string, string> = {
    idle: 'var(--be-text-muted)',
    pending: 'var(--be-text-secondary)',
    running: 'var(--be-color-accent)',
    completed: 'var(--be-text-success)',
    failed: 'var(--be-text-error)',
    cancelled: 'var(--be-category-imageGeneration)', // Amber
  };

  const statusIcons: Record<string, string> = {
    idle: '○',
    pending: '◐',
    running: '◑',
    completed: '✓',
    failed: '✕',
    cancelled: '⊘',
  };

  const color = statusColors[status] || statusColors.idle;
  const icon = statusIcons[status] || statusIcons.idle;
  const isActive = status === 'running' || status === 'pending';

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--be-space-xs)',
        fontSize: 'var(--be-font-size-xs)',
        color: isActive ? color : 'var(--be-text-muted)',
      }}>
        <span style={{
          width: 12,
          height: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isActive ? 'spin 1s linear infinite' : 'none',
        }}>
          {icon}
        </span>
        {isActive && (
          <span style={{ fontSize: 'var(--be-font-size-xs)' }}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: 'var(--be-space-sm) var(--be-space-md)',
      background: 'var(--be-surface-sunken)',
      borderRadius: 'var(--be-radius-md)',
      border: `1px solid ${color}`,
      marginTop: 'var(--be-space-sm)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--be-space-sm)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--be-space-sm)',
        }}>
          <span style={{
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            animation: isActive ? 'spin 1s linear infinite' : 'none',
          }}>
            {icon}
          </span>
          <span style={{
            fontSize: 'var(--be-font-size-xs)',
            fontWeight: 600,
            color: color,
            textTransform: 'capitalize',
          }}>
            {status}
          </span>
        </div>
        <span style={{
          fontSize: 'var(--be-font-size-xs)',
          fontWeight: 600,
          color: color,
        }}>
          {Math.round(progress)}%
        </span>
      </div>

      <div style={{
        height: 4,
        background: 'var(--be-surface-deep)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.3s ease',
          boxShadow: isActive ? `0 0 8px ${color}` : 'none',
        }} />
        {isActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
            animation: 'shimmer 1.5s infinite',
          }} />
        )}
      </div>

      {message && (
        <div style={{
          marginTop: 'var(--be-space-sm)',
          fontSize: 'var(--be-font-size-xs)',
          color: 'var(--be-text-muted)',
          lineHeight: 1.4,
        }}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export interface NodeProgressBadgeProps {
  progress?: number;
  status?: string;
}

export const NodeProgressBadge: FC<NodeProgressBadgeProps> = ({ progress = 0, status = 'idle' }) => {
  const statusColors: Record<string, string> = {
    idle: 'var(--be-text-muted)',
    pending: 'var(--be-text-secondary)',
    running: 'var(--be-color-accent)',
    completed: 'var(--be-text-success)',
    failed: 'var(--be-text-error)',
  };

  const color = statusColors[status] || 'var(--be-text-muted)';

  if (status === 'idle' || status === 'completed') {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--be-space-xs)',
      padding: '2px var(--be-space-sm)',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: 'var(--be-radius-pill)',
      fontSize: 'var(--be-font-size-xs)',
      fontWeight: 600,
      color: color,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: 'var(--be-radius-full)',
        background: color,
        animation: status === 'running' ? 'pulse 1s ease-in-out infinite' : 'none',
      }} />
      {Math.round(progress)}%
    </div>
  );
};

export default NodeProgress;
