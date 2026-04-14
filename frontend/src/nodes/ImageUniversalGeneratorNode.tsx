import { useState, useRef, useEffect, useCallback, type FC, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getFirebaseAuth } from '../config/firebase';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS,
  useNodeConnections, OutputHandle, OutputPreview,
  surface, border, radius, sp, font, text,
  NodeGenerateButton, NodeDownloadButton, NodeShell
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import useNodeProgress from '../hooks/useNodeProgress';
import {
  generateImage, pollStatus,
  improvePromptGenerate, pollImprovePromptStatus,
  imageToPromptGenerate, pollImageToPromptStatus,
  postToApi, pollGenericStatus
} from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import { normalizeImageSizeTier } from './universalImageSizes';
import { IMAGE_UNIVERSAL_MODEL_DEFS } from './imageUniversalGeneratorModels';
import EditableNodeTitle from './EditableNodeTitle';
import AnnotationModal from '../components/AnnotationModal';

const MODEL_DEFS = IMAGE_UNIVERSAL_MODEL_DEFS;

const ImageUniversalGeneratorNode: FC<NodeProps<Node<any>>> = ({ id, data, selected }) => {
  const { update, disconnectNode, connections } = useNodeConnections(id, data);
  const { start, complete, fail } = useNodeProgress({
    onProgress: (state: any) => {
      update({ executionProgress: state.progress, executionStatus: state.status, executionMessage: state.message });
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isImageToPrompting, setIsImageToPrompting] = useState(false);
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const lastTrigger = useRef<number | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const locked = data.locked || false;
  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '1:1';
  const models = data.models || ['Nano Banana 2'];

  const promptValue = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
  const image1Input = data.resolveInput?.(id, 'image-1-in');
  const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);

  const handleGenerate = useCallback(async () => {
    if (isGenerating || !promptValue) return;
    setIsGenerating(true);
    start('Generating...');
    update({ outputImage: null, outputError: null });
    
    try {
      const activeModel = models[0] === 'Auto' ? 'Nano Banana 2' : models[0];
      let result;
      let statusUrl;

      if (activeModel === 'luma-photon-1' || activeModel === 'luma-photon-flash-1') {
        const modelDef = (MODEL_DEFS as any)[activeModel];
        
        // Build Luma Photon payload
        const payload: any = {
          prompt: promptValue,
          model: activeModel.replace('luma-', ''), // photon-1 or photon-flash-1
          aspect_ratio: aspectRatio
        };

        // Handle References
        if (image1) {
          if (data.lumaRefType === 'character' && modelDef?.supportsCharacterRef) {
            payload.character_ref = {
              identity0: { images: [image1] }
            };
          } else if (data.lumaRefType === 'style' && modelDef?.supportsStyleRef) {
            payload.style_ref = [{ url: image1, weight: data.lumaRefWeight || 1.0 }];
          } else if (data.lumaRefType === 'modify') {
            payload.modify_image_ref = { url: image1, weight: data.lumaRefWeight || 1.0 };
          } else {
            // Default to image_ref
            payload.image_ref = [{ url: image1, weight: data.lumaRefWeight || 1.0 }];
          }
        }

        result = await postToApi('/api/luma/generate', payload);
        statusUrl = `/api/luma/status/${result.task_id}`;
      } else {
        // Generic handling for other models
        result = await generateImage({ prompt: promptValue, model: activeModel, n: numOutputs, aspect_ratio: aspectRatio });
      }

      // Poll for status if needed
      let finalData = result.data;
      if (statusUrl) {
        finalData = await pollGenericStatus(statusUrl, '', {
          successValue: 'COMPLETED',
          failureValue: 'FAILED',
          statusKey: 'status'
        });
      }

      const url = finalData?.generated?.[0] || finalData?.assets?.image || result.data?.[0]?.url;
      if (url) {
        update({ 
          outputImage: url,
          lastGenerationId: finalData?.task_id || finalData?.id 
        });
        complete('Done');
      } else {
        throw new Error('No image generated');
      }
    } catch (err: any) {
      console.error('[ImageNode] Generation failed:', err);
      update({ outputError: err.message });
      fail(err);
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, promptValue, models, numOutputs, aspectRatio, start, complete, fail, isGenerating, image1]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsNodeHovered(true)} onMouseLeave={() => setIsNodeHovered(false)}>
      <NodeShell
        label={data.label || 'Image Universal Gen'}
        dotColor={CATEGORY_COLORS.imageGeneration}
        selected={selected || false}
        onDisconnect={disconnectNode}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        downloadUrl={data.outputImage || undefined}
        data={data}
        capabilities={[NodeCapabilities.IMAGE_GENERATE, NodeCapabilities.OUTPUT_IMAGE]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Handles Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Handle type="target" position={Position.Left} id="image-1-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('image-in') }} />
              <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>image-in</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
              <OutputHandle label="" id="output" style={{ position: 'relative', right: -22, top: 0 }} />
            </div>
          </div>

          {/* Image Input Selection/Preview */}
          <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12 }}>
            {image1 ? (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: radius.sm, overflow: 'hidden' }}>
                <img src={image1} alt="Input" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => update({ image1Url: null })} 
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</button>
              </div>
            ) : (
              <div style={{ height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: text.muted, fontSize: 11, border: `1px dashed ${border.divider}`, borderRadius: radius.sm, gap: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span>Click or drop image</span>
              </div>
            )}
          </div>

          {/* Prompt Editor with Floating Menu Support */}
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
              placeholder="Describe your image..."
              rows={4}
              style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, fontSize: 13, outline: 'none', resize: 'none', minHeight: 60 }}
              className="nodrag nopan nowheel"
            />
          </div>

          <OutputPreview output={data.outputImage} isLoading={isGenerating} error={data.outputError} accentColor={CATEGORY_COLORS.imageGeneration} label="Generation Output" />
        </div>
      </NodeShell>
    </div>
  );
};

export default ImageUniversalGeneratorNode;
