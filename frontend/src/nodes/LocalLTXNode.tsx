import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle,
  NodeShell
} from './shared';
import axios from 'axios';

/**
 * LocalLTXNode interfaces with the LTX-Desktop CLI/Backend.
 * It allows triggering local video generations and polls for real-time status.
 */
const LocalLTXNode: FC<NodeProps<Node<any>>> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const lastTrigger = useRef<number | null>(null);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  const cleanupPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupPolling();
  }, []);

  const pollStatus = useCallback(async (jobId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/generation/status/${jobId}`);
      const job = response.data;

      if (job.status === 'completed') {
        cleanupPolling();
        setIsGenerating(false);
        setProgress(100);
        setStatusText('Done');
        // Update the node with the final video URL from the local server
        if (job.output_url) {
          update({ outputVideo: job.output_url, status: 'completed' });
        }
      } else if (job.status === 'failed') {
        cleanupPolling();
        setIsGenerating(false);
        setStatusText('Failed');
        update({ outputError: job.error || 'Generation failed', status: 'failed' });
      } else {
        // Update progress if available (0-100)
        if (job.progress !== undefined) {
          setProgress(job.progress);
          setStatusText(`Generating... ${job.progress}%`);
        } else {
          setStatusText('Processing...');
        }
      }
    } catch (err: any) {
      console.error('[LocalLTX] Polling error:', err);
      // Don't stop on single network error, but update UI
      setStatusText('Connection lost...');
    }
  }, [update]);

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setStatusText('Starting...');
    update({ outputVideo: null, outputError: null, status: 'starting' });

    try {
      const response = await axios.post('http://127.0.0.1:8000/generation/video', {
        prompt,
        width: data.width || 768,
        height: data.height || 512,
        num_frames: data.frames || 121,
      });

      if (response.data?.job_id) {
        const jobId = response.data.job_id;
        update({ outputJobId: jobId });
        
        // Start polling every 1.5 seconds
        cleanupPolling();
        pollTimer.current = setInterval(() => pollStatus(jobId), 1500);
      }
    } catch (err: any) {
      setIsGenerating(false);
      setStatusText('Error');
      update({ outputError: err.message, status: 'error' });
    }
  }, [id, data, update, isGenerating, pollStatus]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <NodeShell
      label={data.label || 'Local LTX Generator'}
      dotColor={CATEGORY_COLORS.videoGeneration}
      selected={selected || false}
      onDisconnect={disconnectNode}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      data={data}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Handle type="target" position={Position.Left} id="prompt-in" style={{ left: -22, background: getHandleColor('prompt-in') }} />
            <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>prompt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
            <OutputHandle label="" id="output" style={{ right: -22 }} />
          </div>
        </div>

        <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12 }}>
           <textarea
            value={data.inputPrompt || ''}
            onChange={e => update({ inputPrompt: e.target.value })}
            placeholder="Local LTX prompt..."
            rows={3}
            style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, fontSize: 13, outline: 'none', resize: 'none' }}
            className="nodrag nopan nowheel"
          />
        </div>

        {isGenerating && (
          <div style={{ width: '100%', height: 4, background: border.default, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress || 0}%`, height: '100%', background: CATEGORY_COLORS.videoGeneration, transition: 'width 0.3s ease' }} />
          </div>
        )}

        <div style={{ fontSize: 10, color: isGenerating ? text.primary : text.muted, textAlign: 'center', height: 14 }}>
          {statusText || (data.outputJobId ? `ID: ${data.outputJobId.slice(0, 8)}...` : 'Ready')}
        </div>

        <OutputPreview 
          output={data.outputVideo} 
          isLoading={isGenerating} 
          error={data.outputError} 
          type="video" 
          accentColor={CATEGORY_COLORS.videoGeneration} 
          label="Local Result" 
        />
      </div>
    </NodeShell>
  );
};

export default LocalLTXNode;
