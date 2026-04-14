import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, sp, font, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle,
  NodeGenerateButton, NodeDownloadButton, NodeShell
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import {
  kling3Generate, pollKling3Status,
  pixVerseV5Generate, pollPixVerseV5Status,
  ltxVideoDirectGenerate, pollLtxDirectStatus,
  postToApi, pollGenericStatus
} from '../utils/api';
import { VIDEO_UNIVERSAL_MODEL_DEFS } from './videoUniversalGeneratorModels';
import { uploadAssetToStorage } from '../services/storageService';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const MODEL_DEFS = VIDEO_UNIVERSAL_MODEL_DEFS;

/**
 * Extract Luma Generation ID from URL or data
 */
const extractLumaId = (input: any): string | null => {
  if (typeof input === 'string') {
    // Attempt to extract UUID from storage URL or similar
    const match = input.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : null;
  }
  return input?.id || null;
};

const VideoUniversalGeneratorNode: FC<NodeProps<Node<any>>> = ({ id, data, selected }) => {
  const { update, disconnectNode, connections } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const lastTrigger = useRef<number | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const locked = data.locked || false;
  const aspectRatio = data.aspectRatio || '16:9';
  const models = data.models || ['kling3'];

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    let startFrameUrl = data.resolveInput?.(id, 'start-frame-in') || data.startFrameUrl;
    const endFrameUrl = data.resolveInput?.(id, 'end-frame-in') || data.endFrameUrl;

    if (!prompt && !startFrameUrl && !isGenerating) return;
    if (isGenerating) return;

    setIsGenerating(true);
    update({ outputVideo: null, outputVideos: [], outputError: null });

    try {
      if (startFrameUrl?.startsWith('data:image')) startFrameUrl = await uploadAssetToStorage(startFrameUrl, `workflows/node_${id}`);
      
      const activeModel = models[0] === 'Auto' ? 'kling3' : models[0];
      let result;
      let statusUrl;
      
      if (activeModel === 'kling3') {
        result = await kling3Generate('pro', { prompt, aspect_ratio: aspectRatio, image: startFrameUrl });
      } else if (activeModel === 'pixverse') {
        result = await pixVerseV5Generate({ prompt, aspect_ratio: aspectRatio, start_image: startFrameUrl });
      } else if (activeModel === 'ltx-video' || activeModel === 'ltx-2-pro') {
        result = await ltxVideoDirectGenerate('fast', { 
          prompt, 
          aspectRatio: aspectRatio, 
          imagePath: startFrameUrl 
        });
      } else if (activeModel === 'luma-ray-2' || activeModel === 'luma-ray-flash-2') {
        const modelDef = (MODEL_DEFS as any)[activeModel];
        
        // Build Luma-specific payload
        const payload: any = {
          prompt,
          model: activeModel.replace('luma-', ''), // ray-2 or ray-flash-2
          aspect_ratio: aspectRatio,
          resolution: data.resolution || '720p',
          loop: data.loop || false
        };

        // Handle Image to Video / Interpolation
        if (startFrameUrl) {
          payload.keyframes = {
            frame0: { type: 'image', url: startFrameUrl }
          };
          if (endFrameUrl) {
            payload.keyframes.frame1 = { type: 'image', url: endFrameUrl };
          }
        }

        // Handle Video Input (Extension / Restyle)
        const videoInput = connections.resolve.video('video-in');
        if (videoInput) {
          if (modelDef?.supportsModifyVideo && data.lumaMode) {
            // Modify Video (Restyle)
            payload.media = { url: videoInput };
            if (startFrameUrl) payload.first_frame = { url: startFrameUrl };
            payload.mode = data.lumaMode;
          } else {
            // Video Extension
            const lumaId = extractLumaId(videoInput);
            if (lumaId) {
              payload.keyframes = {
                frame0: { type: 'generation', id: lumaId }
              };
            }
          }
        }

        result = await postToApi('/api/luma/generate', payload);
        statusUrl = `/api/luma/status/${result.task_id}`;
      } else {
        throw new Error(`Model ${activeModel} logic not fully implemented in universal node wrapper`);
      }

      // Poll for status if not already completed
      let finalData = result.data;
      if (statusUrl) {
        finalData = await pollGenericStatus(statusUrl, '', {
          successValue: 'COMPLETED',
          failureValue: 'FAILED',
          statusKey: 'status'
        });
      }

      const url = finalData?.generated?.[0] || finalData?.assets?.video || result.data?.[0]?.url;
      if (url) {
        update({ 
          outputVideo: url,
          lastGenerationId: finalData?.task_id || finalData?.id
        });
      } else {
        throw new Error('No video generated');
      }
    } catch (err: any) {
      console.error('[VideoNode] Generation failed:', err);
      update({ outputError: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, aspectRatio, isGenerating, models, connections]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsNodeHovered(true)} onMouseLeave={() => setIsNodeHovered(false)}>
      <NodeShell
        label={data.label || 'Video Universal Generator'}
        dotColor={CATEGORY_COLORS.videoGeneration}
        selected={selected || false}
        onDisconnect={disconnectNode}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        downloadUrl={data.outputVideo || undefined}
        downloadType="video"
        data={data}
        capabilities={[NodeCapabilities.VIDEO_GENERATE, NodeCapabilities.OUTPUT_VIDEO]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Handles Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Handle type="target" position={Position.Left} id="start-frame-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('image-in') }} />
                <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>start-frame</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
                <OutputHandle label="" id="output" style={{ position: 'relative', right: -22, top: 0 }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Handle type="target" position={Position.Left} id="end-frame-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('image-in') }} />
                <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>end-frame</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Handle type="target" position={Position.Left} id="video-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('video-in') }} />
                <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>video-in</span>
              </div>
            </div>
          </div>

          {/* Prompt Section */}
          <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12, position: 'relative' }}>
            <AnimatePresence>
              {(isNodeHovered || isGenerating) && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 10, zIndex: 100 }}
                >
                  <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: `1.5px solid ${border.active}80`, borderRadius: radius.md, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>RUN NODE</span>
                    <NodeGenerateButton onGenerate={handleGenerate} isGenerating={isGenerating} size="sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Handle type="target" position={Position.Left} id="prompt-in" style={{ position: 'absolute', left: -22, top: '50%', background: getHandleColor('prompt-in') }} />
            <textarea
              ref={promptRef}
              value={data.inputPrompt || ''}
              onChange={e => update({ inputPrompt: e.target.value })}
              placeholder="Describe your video..."
              rows={4}
              style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, fontSize: 13, outline: 'none', resize: 'none', minHeight: 60 }}
              className="nodrag nopan nowheel"
            />
          </div>

          <OutputPreview output={data.outputVideo} isLoading={isGenerating} error={data.outputError} type="video" accentColor={CATEGORY_COLORS.videoGeneration} label="Generation Output" />
        </div>
      </NodeShell>
    </div>
  );
};

export default VideoUniversalGeneratorNode;
