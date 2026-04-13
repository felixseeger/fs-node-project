import { useState, useEffect } from 'react';
import { RemotionLayer } from '../types/remotion';
import { useAsyncPolling } from '../hooks/useAsyncPolling';
import { TextInput } from '../nodes/shared';
import { surface, border, radius, sp, text } from '../nodes/nodeTokens';

interface LayerItemProps {
  layer: RemotionLayer;
  onUpdate: (id: string, updates: Partial<RemotionLayer>) => void;
  onDelete: (id: string) => void;
}

export function LayerItem({ layer, onUpdate, onDelete }: LayerItemProps) {
  const [prompt, setPrompt] = useState('');

  const { status, progress, resultUrl, error, execute } = useAsyncPolling(
    '/api/vfx/ltx/generate',
    '/api/vfx/ltx/poll/:id'
  );

  useEffect(() => {
    if (status !== 'idle') {
      onUpdate(layer.id, {
        status,
        progress,
        ...(resultUrl ? { src: resultUrl } : {}),
        error: error || undefined,
      });
    }
  }, [status, progress, resultUrl, error, layer.id, onUpdate]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    execute({ prompt });
  };

  return (
    <div style={{
      background: surface.sunken,
      border: `1px solid ${border.subtle}`,
      borderRadius: radius.md,
      padding: sp[3],
      marginBottom: sp[2],
      display: 'flex',
      flexDirection: 'column',
      gap: sp[2]
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: text.primary }}>
          Layer: {layer.id.substring(0, 8)} ({layer.type})
        </span>
        <button 
          onClick={() => onDelete(layer.id)}
          style={{
            background: 'transparent',
            color: text.muted,
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            padding: '4px 8px',
            borderRadius: radius.sm,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background = '#ef444420';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = text.muted;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Delete
        </button>
      </div>

      {layer.jobType === 'ltx' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <TextInput 
            value={prompt} 
            onChange={setPrompt} 
            placeholder="Enter prompt for LTX video..." 
          />
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            style={{
              background: status === 'loading' ? surface.raised : '#3b82f6',
              color: status === 'loading' ? text.muted : '#fff',
              border: 'none',
              borderRadius: radius.md,
              padding: '6px 12px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontSize: 11,
              fontWeight: 600,
              alignSelf: 'flex-start',
              transition: 'background 0.2s'
            }}
          >
            {status === 'loading' ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
      )}

      {layer.status === 'loading' && (
        <div style={{ marginTop: sp[1] }}>
          <div style={{ fontSize: 10, color: text.secondary, marginBottom: 4 }}>
            Progress: {layer.progress}%
          </div>
          <div style={{ width: '100%', height: 4, background: surface.raised, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              width: `${layer.progress}%`, 
              height: '100%', 
              background: '#3b82f6', 
              transition: 'width 0.3s ease-out' 
            }} />
          </div>
        </div>
      )}

      {layer.error && (
        <div style={{ color: '#ef4444', fontSize: 11, marginTop: sp[1] }}>
          Error: {layer.error}
        </div>
      )}
      
      {layer.src && layer.status === 'completed' && (
        <div style={{ color: '#10b981', fontSize: 11, marginTop: sp[1] }}>
          Video ready
        </div>
      )}
    </div>
  );
}
