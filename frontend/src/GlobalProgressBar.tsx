type ProgressNodeData = {
  isLoading?: boolean;
  executionStatus?: string;
  outputError?: string | null;
  executionError?: string | null;
  executionProgress?: number;
  executionMessage?: string;
  label?: string;
  onUpdate?: (id: string, patch: Record<string, unknown>) => void;
};

export type GlobalProgressBarNode = {
  id: string;
  type: string;
  data?: ProgressNodeData;
};

export type GlobalProgressBarProps = {
  nodes: GlobalProgressBarNode[];
};

export default function GlobalProgressBar({ nodes }: GlobalProgressBarProps) {
  const activeNodes = nodes.filter(
    (n) =>
      n.data?.isLoading ||
      n.data?.executionStatus === 'running' ||
      n.data?.executionStatus === 'failed' ||
      n.data?.outputError,
  );

  if (activeNodes.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 40,
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {activeNodes.map((node) => {
        const progress = node.data?.executionProgress ?? 0;
        const message = node.data?.executionMessage ?? 'Processing...';
        const label = node.data?.label ?? node.type;
        const error =
          node.data?.outputError ||
          node.data?.executionError ||
          (node.data?.executionStatus === 'failed' ? message : null);
        const isIndeterminate = progress === 0 && !error;

        const handleDismiss = () => {
          node.data?.onUpdate?.(node.id, {
            outputError: null,
            executionError: null,
            executionStatus: 'idle',
            isLoading: false,
          });
        };

        return (
          <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#e0e0e0',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                {!error && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderTop: '2px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                )}
                {label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: '60%' }}>
                <span
                  style={{
                    color: error ? '#ef4444' : '#9ca3af',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {error ? `Error: ${error}` : message}{' '}
                  {progress > 0 && !error ? `(${Math.round(progress)}%)` : ''}
                </span>
                {error ? (
                  <button
                    type="button"
                    onClick={handleDismiss}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    &times;
                  </button>
                ) : null}
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: 4,
                background: '#333',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {isIndeterminate ? (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, #3b82f6 0%, #1e3a8a 50%, #3b82f6 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear',
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '100%',
                    width: `${error ? 100 : progress}%`,
                    background: error ? '#ef4444' : '#3b82f6',
                    transition: 'width 0.3s ease',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
