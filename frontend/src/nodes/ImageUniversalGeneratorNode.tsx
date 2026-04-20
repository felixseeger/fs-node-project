import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS,
  useNodeConnections, OutputHandle, OutputPreview,
  surface, border, radius, text,
  NodeShell
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import useNodeProgress from '../hooks/useNodeProgress';
import {
  generateImage,
  postToApi, pollGenericStatus
} from '../utils/api';
import { IMAGE_UNIVERSAL_MODEL_DEFS } from './imageUniversalGeneratorModels';
import ImageUploadBox from './ImageUploadBox';

const MODEL_DEFS = IMAGE_UNIVERSAL_MODEL_DEFS;

const ImageUniversalGeneratorNode: FC<NodeProps<Node<any>>> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const { start, complete, fail, progress, status, message } = useNodeProgress({});

  useEffect(() => {
    setTimeout(() => {
      update({ executionProgress: progress, executionStatus: status, executionMessage: message });
    }, 0);
  }, [progress, status, message, update]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(data.inputPrompt || '');
  const [showRefDropdown, setShowRefDropdown] = useState(false);
  const [refImageCounter, setRefImageCounter] = useState(1);
  const lastTrigger = useRef<number | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalPrompt(data.inputPrompt || '');
  }, [data.inputPrompt]);

  const numOutputs = data.numOutputs || 1;
  const aspectRatio = data.aspectRatio || '1:1';
  const models = data.models || ['Nano Banana 2'];

  const promptValue = data.resolveInput?.(id, 'prompt-in') || localPrompt || '';
  const image1Input = data.resolveInput?.(id, 'image-1-in');
  const image1 = Array.isArray(image1Input) ? image1Input[0] : (image1Input || data.image1Url);

  const handleGenerate = useCallback(async () => {
    if (isGenerating || !localPrompt) return;
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
        result = await generateImage({ prompt: promptValue, model: activeModel, n: numOutputs, aspect_ratio: aspectRatio, image: image1 || undefined });
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const isDropdown = dropdownRef.current?.contains(e.target as Node);
      const isButton = buttonRef.current?.contains(e.target as Node);
      if (!isDropdown && !isButton) {
        setShowRefDropdown(false);
      }
    };

    if (showRefDropdown) {
      document.addEventListener('click', handleOutsideClick, true);
      return () => document.removeEventListener('click', handleOutsideClick, true);
    }
  }, [showRefDropdown]);

  return (
    <div>
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
            <ImageUploadBox
              image={image1 || null}
              onImageChange={(img) => update({ image1Url: img })}
              placeholder="Click or drop image"
              minHeight={80}
            />
          </div>

          {/* Prompt Editor with @ Button Support */}
          <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12, position: 'relative' }}>
            <Handle type="target" position={Position.Left} id="prompt-in" style={{ position: 'absolute', left: -22, top: '50%', background: getHandleColor('prompt-in') }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <textarea
                ref={promptRef}
                value={localPrompt}
                onChange={e => setLocalPrompt(e.target.value)}
                onBlur={e => update({ inputPrompt: e.target.value })}
                placeholder="Describe your image... Use @ to reference the image"
                rows={4}
                style={{ flex: 1, background: 'transparent', border: 'none', color: text.primary, fontSize: 13, outline: 'none', resize: 'none', minHeight: 60 }}
                className="nodrag nopan nowheel"
              />
              <div style={{ position: 'relative' }}>
                <button
                  ref={buttonRef}
                  onClick={() => setShowRefDropdown(!showRefDropdown)}
                  disabled={!image1}
                  style={{
                    padding: '8px 12px',
                    background: image1 ? CATEGORY_COLORS.imageGeneration : '#444',
                    color: 'white',
                    border: 'none',
                    borderRadius: radius.sm,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: image1 ? 'pointer' : 'not-allowed',
                    opacity: image1 ? 1 : 0.5,
                    whiteSpace: 'nowrap',
                    transition: 'all 160ms ease',
                  }}
                  title="Add image reference to prompt"
                >
                  @
                </button>
                {showRefDropdown && image1 && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      right: 0,
                      marginBottom: 4,
                      background: surface.deep,
                      border: `1px solid ${border.default}`,
                      borderRadius: radius.md,
                      zIndex: 1000,
                      minWidth: 140,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div
                      onClick={() => {
                        const refLabel = `img_${refImageCounter}`;
                        const newPrompt = localPrompt + (localPrompt.endsWith(' ') ? '' : ' ') + refLabel;
                        setLocalPrompt(newPrompt);
                        update({ inputPrompt: newPrompt });
                        setRefImageCounter(refImageCounter + 1);
                        setShowRefDropdown(false);
                        promptRef.current?.focus();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'background 160ms ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <img
                        src={image1}
                        alt="ref"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                          objectFit: 'cover',
                        }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: text.primary }}>
                          img_{refImageCounter}
                        </span>
                        <span style={{ fontSize: 9, color: text.muted }}>
                          Reference
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <OutputPreview output={data.outputImage} isLoading={isGenerating} error={data.outputError} accentColor={CATEGORY_COLORS.imageGeneration} label="Generation Output" aspectRatio={aspectRatio} />
        </div>
      </NodeShell>
    </div>
  );
};

export default ImageUniversalGeneratorNode;
