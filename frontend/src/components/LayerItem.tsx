import { useState, useEffect } from 'react';
import { RemotionLayer } from '../types/remotion';
import { TextInput, PromptInput, Slider, SettingsPanel } from '../nodes/shared';
import { surface, border, radius, sp, text } from '../nodes/nodeTokens';

interface LayerItemProps {
  layer: RemotionLayer;
  onUpdate: (id: string, updates: Partial<RemotionLayer>) => void;
  onDelete: (id: string) => void;
}

export function LayerItem({ layer, onUpdate, onDelete }: LayerItemProps) {
  const [prompt, setPrompt] = useState('');

  const [status, setStatus] = useState<string>(layer.status || 'idle');
  const [progress, setProgress] = useState<number>(layer.progress || 0);
  const [error, setError] = useState<string | undefined>(layer.error || undefined);

  const isGeneratable = layer.type !== 'text' && (!layer.src || layer.src.length === 0);
  const handleTextChange = (val: string) => {
    setPrompt(val);
    onUpdate(layer.id, { src: val, status: 'completed' });
  };
  
  useEffect(() => {
    if (layer.type === 'text' && layer.src && prompt !== layer.src) {
      setPrompt(layer.src);
    }
  }, [layer.type, layer.src, prompt]);

  useEffect(() => {
    setStatus(layer.status || 'idle');
    setProgress(layer.progress || 0);
    setError(layer.error || undefined);
  }, [layer.status, layer.progress, layer.error]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus('loading');
    setProgress(0);
    setError(undefined);
    onUpdate(layer.id, { status: 'loading', progress: 0, error: undefined });

    try {
      const isImage = (layer.jobType as any) === 'image' || layer.type === 'image' || (layer.jobType as any) === 'freepik-image';
      const isAudio = (layer.jobType as any) === 'audio' || layer.type === 'audio' || (layer.jobType as any) === 'music';
      const isVideo = !isImage && !isAudio;

      let submitUrl = '/api/vfx/ltx/generate';
      if (isImage) submitUrl = '/api/generate-image';
      else if (isAudio) submitUrl = '/api/music-generation';

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isImage ? { prompt, num_images: 1, aspect_ratio: '16:9' } : { prompt })
      });

      if (!response.ok) throw new Error(`Submit failed: ${response.statusText}`);

      const data = await response.json();
      
      const jobId = data.jobId || data.id || data.task_id;
      
      if (!jobId) {
        if (data.data && data.data[0] && data.data[0].url) {
          setStatus('completed');
          setProgress(100);
          onUpdate(layer.id, { status: 'completed', progress: 100, src: data.data[0].url });
          return;
        }
        throw new Error('No task ID returned');
      }

      let pollUrlTemplate = `/api/vfx/job/:id/status`;
      if (isImage) pollUrlTemplate = `/api/status/:id`;
      else if (isAudio) pollUrlTemplate = `/api/music-generation/:id`;

      const pollUrl = pollUrlTemplate.replace(':id', jobId);

      const pollInterval = window.setInterval(async () => {
        try {
          const pollRes = await fetch(pollUrl);
          if (!pollRes.ok) throw new Error(`Poll failed: ${pollRes.statusText}`);
          
          const pollData = await pollRes.json();
          
          let pStatus = pollData.status;
          let pProgress = pollData.progress;
          let pUrl = pollData.resultUrl || pollData.url || pollData.audio?.url || (pollData.generated && pollData.generated[0]) || (pollData.assets && pollData.assets.image);
          
          if (pProgress !== undefined) {
             setProgress(pProgress);
             onUpdate(layer.id, { progress: pProgress });
          } else {
             setProgress(50);
             onUpdate(layer.id, { progress: 50 });
          }
          
          if (pStatus === 'completed' || pStatus === 'COMPLETED') {
            window.clearInterval(pollInterval);
            setStatus('completed');
            setProgress(100);
            onUpdate(layer.id, { status: 'completed', progress: 100, src: pUrl });
          } else if (pStatus === 'failed' || pStatus === 'FAILED') {
            window.clearInterval(pollInterval);
            setStatus('failed');
            setError(pollData.error || 'Job failed');
            onUpdate(layer.id, { status: 'failed', error: pollData.error || 'Job failed' });
          }
        } catch (err: any) {
          window.clearInterval(pollInterval);
          setStatus('failed');
          setError(err.message);
          onUpdate(layer.id, { status: 'failed', error: err.message });
        }
      }, 3000);

    } catch (err: any) {
      setStatus('failed');
      setError(err.message);
      onUpdate(layer.id, { status: 'failed', error: err.message });
    }
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

      <SettingsPanel title="Transform" defaultExpanded={false}>
        <Slider 
          label="Opacity" 
          value={Math.round((layer.opacity ?? 1) * 100)} 
          onChange={(v) => onUpdate(layer.id, { opacity: v / 100 })} 
          min={0} 
          max={100} 
          unit="%" 
        />
        <Slider 
          label="Scale" 
          value={Math.round((layer.scale ?? 1) * 100)} 
          onChange={(v) => onUpdate(layer.id, { scale: v / 100 })} 
          min={0} 
          max={200} 
          unit="%" 
        />
        <Slider 
          label="X" 
          value={layer.x ?? 0} 
          onChange={(v) => onUpdate(layer.id, { x: v })} 
          min={-512} 
          max={512} 
        />
        <Slider 
          label="Y" 
          value={layer.y ?? 0} 
          onChange={(v) => onUpdate(layer.id, { y: v })} 
          min={-512} 
          max={512} 
        />
      </SettingsPanel>

      {layer.type === 'text' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <PromptInput 
            value={prompt} 
            onChange={handleTextChange} 
            placeholder="Enter text to display..." 
            rows={2}
          />
        </div>
      ) : isGeneratable && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp[2], marginTop: sp[1] }}>
          <PromptInput 
            value={prompt} 
            onChange={setPrompt} 
            placeholder="Enter prompt..." 
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            style={{
              background: status === 'loading' ? surface.raised : (layer.type === 'image' ? '#ec4899' : layer.type === 'audio' ? '#a855f7' : '#14b8a6'),
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
            {status === 'loading' ? 'Generating...' : layer.type === 'image' ? 'Generate Image' : layer.type === 'audio' ? 'Generate Audio' : 'Generate Video'}
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div style={{ marginTop: sp[1] }}>
          <div style={{ fontSize: 10, color: text.secondary, marginBottom: 4 }}>
            Progress: {progress}%
          </div>
          <div style={{ width: '100%', height: 4, background: surface.raised, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: '#3b82f6', 
              transition: 'width 0.3s ease-out' 
            }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: '#ef4444', fontSize: 11, marginTop: sp[1] }}>
          Error: {error}
        </div>
      )}
      
      {layer.src && status === 'completed' && (
        <div style={{ color: '#10b981', fontSize: 11, marginTop: sp[1] }}>
          {layer.type === 'image' ? 'Image' : layer.type === 'audio' ? 'Audio' : 'Video'} ready
        </div>
      )}
    </div>
  );
}
