import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LogEntry {
  id: string | number;
  timestamp: Date | string;
  level: LogLevel;
  message: string;
}

export interface LogTerminalProps {
  logs: LogEntry[];
  title?: string;
  maxHeight?: number | string;
  autoScroll?: boolean;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'var(--be-terminal-text)',
  warn: 'var(--be-ui-warning)',
  error: 'var(--be-ui-error)',
  success: 'var(--be-ui-success)',
  debug: 'var(--be-code-comment)',
};

export default function LogTerminal({
  logs,
  title = "EXECUTION LOGS",
  maxHeight = 300,
  autoScroll = true
}: LogTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--be-terminal-bg)',
      borderRadius: 'var(--be-radius-md)',
      border: '1px solid var(--be-color-border)',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
      fontFamily: 'var(--be-font-mono)',
      fontSize: 'var(--be-font-size-xs)',
    }}>
      {/* Terminal Header */}
      <div style={{
        padding: '6px 12px',
        background: 'var(--be-terminal-header)',
        borderBottom: '1px solid var(--be-color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <span style={{ 
          fontSize: 10, 
          color: 'var(--be-color-text-muted)', 
          letterSpacing: '0.1em',
          fontWeight: 600
        }}>{title}</span>
        <div style={{ width: 36 }} />
      </div>

      {/* Log Stream */}
      <div 
        ref={scrollRef}
        style={{
          padding: '12px',
          height: maxHeight,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          scrollBehavior: 'smooth'
        }}
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--be-code-comment)', fontStyle: 'italic' }}>
              Waiting for process output...
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', gap: 12, lineBreak: 'anywhere' }}
              >
                <span style={{ color: 'var(--be-code-comment)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  [{typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </span>
                <span style={{ color: LEVEL_COLORS[log.level], fontWeight: log.level === 'error' ? 700 : 400 }}>
                  <span style={{ opacity: 0.7, marginRight: 8 }}>{log.level.toUpperCase().padEnd(7)}</span>
                  {log.message}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer / Status */}
      <div style={{
        padding: '4px 12px',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid var(--be-color-border)',
        fontSize: 9,
        color: 'var(--be-code-comment)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>UTF-8</span>
        <span>LINE: {logs.length}</span>
      </div>
    </div>
  );
}
