/**
 * NodeProgress Component
 * Visual progress indicator for node execution
 */

import React from 'react';

/**
 * Progress bar with status indicator
 * @param {Object} props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} props.status - Current status: 'idle' | 'pending' | 'running' | 'completed' | 'failed'
 * @param {string} props.message - Optional status message
 * @param {boolean} props.compact - Compact mode for small spaces
 */
export default function NodeProgress({ progress = 0, status = 'idle', message, compact = false }) {
  // Status colors
  const statusColors = {
    idle: '#3a3a3a',
    pending: '#6b7280',
    running: '#3b82f6',
    completed: '#22c55e',
    failed: '#ef4444',
    cancelled: '#f59e0b',
  };

  // Status icons
  const statusIcons = {
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
        gap: 6,
        fontSize: 10,
        color: isActive ? color : '#999',
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
          <span style={{ fontSize: 9 }}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: '8px 12px',
      background: 'rgba(26, 26, 26, 0.95)',
      borderRadius: 6,
      border: `1px solid ${color}`,
      marginTop: 8,
    }}>
      {/* Status header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
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
            fontSize: 11,
            fontWeight: 600,
            color: color,
            textTransform: 'capitalize',
          }}>
            {status}
          </span>
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: color,
        }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4,
        background: '#1a1a1a',
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

      {/* Message */}
      {message && (
        <div style={{
          marginTop: 6,
          fontSize: 10,
          color: '#999',
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
}

/**
 * Compact progress indicator for node header
 */
export function NodeProgressBadge({ progress, status }) {
  const color = {
    idle: '#3a3a3a',
    pending: '#6b7280',
    running: '#3b82f6',
    completed: '#22c55e',
    failed: '#ef4444',
  }[status] || '#3a3a3a';

  if (status === 'idle' || status === 'completed') {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: 10,
      fontSize: 10,
      fontWeight: 600,
      color: color,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        animation: status === 'running' ? 'pulse 1s ease-in-out infinite' : 'none',
      }} />
      {Math.round(progress)}%
    </div>
  );
}
