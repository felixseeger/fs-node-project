import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

export type InfraStatus = 'online' | 'offline' | 'degraded' | 'maintenance';

export interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'error';
}

export interface InfrastructureStatusProps {
  name: string;
  status: InfraStatus;
  metrics?: MetricData[];
  lastUpdated?: Date | string;
  icon?: ReactNode;
}

const STATUS_CONFIG: Record<InfraStatus, { color: string; label: string }> = {
  online: { color: 'var(--be-ui-success)', label: 'ONLINE' },
  offline: { color: 'var(--be-ui-error)', label: 'OFFLINE' },
  degraded: { color: 'var(--be-ui-warning)', label: 'DEGRADED' },
  maintenance: { color: 'var(--be-color-text-muted)', label: 'MAINTENANCE' },
};

const InfrastructureStatus: FC<InfrastructureStatusProps> = ({
  name,
  status,
  metrics = [],
  lastUpdated,
  icon
}) => {
  const { color, label } = STATUS_CONFIG[status];

  return (
    <div style={{
      background: 'var(--be-glass-bg)',
      backdropFilter: 'blur(var(--be-glass-blur))',
      WebkitBackdropFilter: 'blur(var(--be-glass-blur))',
      borderRadius: 'var(--be-radius-lg)',
      border: '1px solid var(--be-glass-border)',
      padding: '16px',
      minWidth: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: 'var(--be-shadow-md)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {icon && <div style={{ color: 'var(--be-color-text-muted)' }}>{icon}</div>}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: 14, 
              fontWeight: 700, 
              color: 'var(--be-color-text)',
              letterSpacing: '-0.01em'
            }}>{name}</span>
            <span style={{ fontSize: 11, color: 'var(--be-color-text-muted)' }}>
              Backend Service
            </span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          padding: '4px 8px',
          borderRadius: 'var(--be-radius-pill)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--be-glass-border)'
        }}>
          <motion.div 
            animate={{ opacity: status === 'online' ? [0.4, 1, 0.4] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ 
              width: 6, height: 6, borderRadius: '50%', 
              background: color,
              boxShadow: `0 0 6px ${color}`
            }} 
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: color, letterSpacing: '0.05em' }}>
            {label}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 12,
          padding: '12px',
          background: 'var(--be-surface-sunken)',
          borderRadius: 'var(--be-radius-md)',
          border: '1px solid var(--be-glass-border)'
        }}>
          {metrics.map((metric, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, color: 'var(--be-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {metric.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: metric.status ? `var(--be-ui-${metric.status})` : 'var(--be-color-text)' 
                }}>
                  {metric.value}
                </span>
                {metric.unit && <span style={{ fontSize: 10, color: 'var(--be-color-text-muted)' }}>{metric.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastUpdated && (
        <div style={{ 
          fontSize: 10, 
          color: 'var(--be-text-muted)', 
          textAlign: 'right',
          fontStyle: 'italic'
        }}>
          Last synced: {typeof lastUpdated === 'string' ? lastUpdated : lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default InfrastructureStatus;
