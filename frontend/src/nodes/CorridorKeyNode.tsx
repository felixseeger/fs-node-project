import { useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNodeConnections, NodeShell, PillGroup, Slider } from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import { getHandleColor } from '../utils/handleTypes';
import { useAsyncPolling } from '../hooks/useAsyncPolling';
import { VideoPreview } from '../components/VideoPreview';

export default function CorridorKeyNode({ id, data, selected }: any) {
  const { resolve, update } = useNodeConnections(id, data);
  const { status, progress, resultUrl, error, execute } = useAsyncPolling(
    '/api/vfx/corridorkey/extract',
    '/api/vfx/job/:id/status'
  );

  const incomingVideo = resolve.video('video_in');
  const sourceVideo = Array.isArray(incomingVideo) ? incomingVideo[0] : incomingVideo;

  const handleGenerate = async () => {
    if (!sourceVideo) return;
    
    await execute({
      videoUrl: sourceVideo,
      profile: data.profile || 'optimized',
      despill: data.despill !== undefined ? data.despill : 5
    });
  };

  // Update output when resultUrl changes
  useEffect(() => {
    if (resultUrl) {
      update({ outputVideo: resultUrl });
    }
  }, [resultUrl, update]);

  const capabilities = [NodeCapabilities.VIDEO_EDIT];

  return (
    <NodeShell
      label="CorridorKey AI"
      selected={selected}
      // @ts-ignore
      capabilities={capabilities}
      dotColor="#10b981"
      isGenerating={status === 'loading'}
      hasError={status === 'failed'}
      onGenerate={handleGenerate}
    >
      <div style={{ padding: '8px 0' }}>
        <PillGroup
          label="Optimization Profile"
          options={[
            { value: 'optimized', label: 'Optimized' },
            { value: 'performance', label: 'Performance' }
          ]}
          value={data.profile || 'optimized'}
          onChange={(val) => update({ profile: val })}
          accentColor="#10b981"
        />

        <Slider 
          label="Despill"
          value={data.despill !== undefined ? data.despill : 5}
          min={0}
          max={10}
          step={1}
          onChange={(val) => update({ despill: val })}
          accentColor="#10b981"
        />
        
        <button
          onClick={handleGenerate}
          disabled={status === 'loading' || !sourceVideo}
          className="nodrag nopan"
          style={{
            width: '100%', padding: '8px 16px', background: '#10b981',
            color: '#fff', border: 'none', borderRadius: 6, 
            cursor: (status === 'loading' || !sourceVideo) ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: 12, marginBottom: 16, marginTop: 8,
            opacity: (!sourceVideo && status !== 'loading') ? 0.5 : 1
          }}
        >
          {status === 'loading' ? 'Processing...' : 'Remove Background'}
        </button>

        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: 8, display: 'block' }}>
            Output Preview
          </span>
          <VideoPreview 
            status={status}
            progress={progress}
            resultUrl={resultUrl}
            error={error}
          />
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="video_in" style={{ background: getHandleColor('video') }} />
      <Handle type="source" position={Position.Right} id="video_out" style={{ background: getHandleColor('video') }} />
    </NodeShell>
  );
}
