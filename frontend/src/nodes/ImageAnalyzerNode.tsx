import React, { useCallback, useRef, useState, useEffect, FC, ChangeEvent, DragEvent } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
// @ts-ignore
import { analyzeImage, uploadImages } from '../utils/api';
// @ts-ignore
import { compressImageBase64 } from '../utils/imageUtils';

/**
 * ImageAnalyzerNode - Computer vision analysis node
 */
const ImageAnalyzerNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const [expandSystem, setExpandSystem] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const localImages = (data.localImages as string[]) || [];

  const handleImageUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      try {
        const result = await uploadImages(Array.from(files));
        const updated = [...localImages, ...result.images].slice(0, 4);
        update({ localImages: updated });
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    },
    [localImages, update]
  );

  const removeImage = useCallback(
    (idx: number) => {
      const updated = [...localImages];
      updated.splice(idx, 1);
      update({ localImages: updated });
    },
    [localImages, update]
  );

  const handleAnalyze = useCallback(async () => {
    // Gather images: local images + connected images
    const connectedImages = typeof data.resolveInput === 'function' ? data.resolveInput(id, 'image-in') : null;
    let allImages = [...localImages, ...(Array.isArray(connectedImages) ? connectedImages : [connectedImages].filter(Boolean))];
    if (allImages.length === 0) {
      if (typeof data.onAnalyzeComplete === 'function') {
        data.onAnalyzeComplete(id);
      }
      return;
    }

    const prompt = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'prompt-in') : null) || data.localPrompt || '';
    const systemDirections = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'system-in') : null) || data.systemDirections || '';

    setIsAnalyzing(true);
    update({ analysisResult: '' });

    try {
      allImages = await Promise.all(allImages.map(img => compressImageBase64(img)));
      const result = await analyzeImage({ images: allImages, prompt, systemDirections });
      if (result.error) {
        update({ analysisResult: `Error: ${result.error}` });
      } else {
        update({ analysisResult: result.analysis || 'No analysis returned.' });
      }
    } catch (err: any) {
      update({ analysisResult: `Error: ${err.message}` });
    } finally {
      setIsAnalyzing(false);
      // Signal completion to global workflow
      if (typeof data.onAnalyzeComplete === 'function') {
        data.onAnalyzeComplete(id);
      }
    }
  }, [id, data, localImages, update]);

  // Listen for external trigger from global Generate button
  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerAnalyze && data.triggerAnalyze !== lastTrigger.current) {
      lastTrigger.current = data.triggerAnalyze;
      handleAnalyze();
    }
  }, [data.triggerAnalyze, handleAnalyze]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && localImages.length < 4) {
      handleImageUpload(files);
    }
  }, [handleImageUpload, localImages.length]);

  const sectionHeader = (label: string, handleId: string, handleType: 'target' | 'source', color: string, onAdd?: () => void) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle
          type={handleType}
          position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: color, border: 'none',
            position: 'relative',
            left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto',
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'transparent', border: '1px solid #3a3a3a',
            color: '#999', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1,
          }}
        >
          +
        </button>
      )}
    </div>
  );

  const maxSlots = 4;
  const emptySlots = Math.max(0, maxSlots - localImages.length);

  return (
    <NodeShell data={data}
      label={(data.label as string) || 'Claude Sonnet Vision'}
      dotColor="#f97316"
      selected={selected}
      onDisconnect={disconnectNode}
    >

      {/* ── Image Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle
          type="source"
          position={Position.Right}
          id="image-out"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('image-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>

      {/* ── Images Section ── */}
      {sectionHeader('Images', 'image-in', 'target', getHandleColor('image-in'),
        () => (data.onAddToInput as Function)?.('image_urls', id, 'image-in')
      )}
      <div 
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
          marginBottom: 8,
          padding: isDragging ? 8 : 0,
          border: isDragging ? '2px dashed #3b82f6' : 'none',
          borderRadius: 6,
          background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          transition: 'all 0.2s ease',
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {localImages.map((img, i) => (
          <div key={i} style={{
            position: 'relative', aspectRatio: '1',
            borderRadius: 6, overflow: 'hidden',
          }}>
            <img src={img} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
            <button
              onClick={() => removeImage(i)}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="nodrag nopan"
              style={{
                position: 'absolute', top: 2, right: 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#ef4444', border: 'none',
                color: '#fff', fontSize: 10, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0,
              }}
            >
              x
            </button>
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <button
            key={`empty-${i}`}
            onClick={() => fileRef.current?.click()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="nodrag nopan"
            style={{
              aspectRatio: '1', borderRadius: 6,
              background: isDragging ? 'rgba(59, 130, 246, 0.2)' : '#1a1a1a', 
              border: isDragging ? '2px dashed #3b82f6' : '1px solid #3a3a3a',
              color: isDragging ? '#3b82f6' : '#555', 
              fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isDragging ? '↓' : '+'}
          </button>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleImageUpload(e.target.files);
          e.target.value = '';
        }}
      />

      {/* ── Prompt Section ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'),
        () => (data.onAddToInput as Function)?.('prompt', id, 'prompt-in')
      )}
      <textarea
        className="nodrag nopan"
        value={(data.localPrompt as string) || ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => update({ localPrompt: e.target.value })}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="Enter prompt here..."
        rows={3}
        style={{
          width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
          borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
          resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          marginBottom: 4,
        }}
      />

      {/* ── System Prompt Section ── */}
      {sectionHeader('System Prompt', 'system-in', 'target', getHandleColor('system-in'),
        () => (data.onAddToInput as Function)?.('text', id, 'system-in')
      )}
      <div style={{ position: 'relative' }}>
        <textarea
          className="nodrag nopan"
          value={(data.systemDirections as string) || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => update({ systemDirections: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Enter system prompt..."
          rows={expandSystem ? 8 : 3}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'none', outline: 'none', boxSizing: 'border-box',
            overflow: expandSystem ? 'auto' : 'hidden',
          }}
        />
        <button
          onClick={() => setExpandSystem(!expandSystem)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="nodrag nopan"
          style={{
            display: 'inline-block', marginTop: 4,
            padding: '3px 10px', fontSize: 10, fontWeight: 600,
            background: '#333', border: '1px solid #3a3a3a',
            borderRadius: 4, color: '#ccc', cursor: 'pointer',
          }}
        >
          {expandSystem ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* ── Analyze Button ── */}
      <button
        onClick={handleAnalyze}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="nodrag nopan"
        disabled={isAnalyzing}
        style={{
          width: '100%', padding: '8px', fontSize: 12, fontWeight: 600,
          background: isAnalyzing ? '#333' : '#3b82f6',
          border: 'none', borderRadius: 6, color: '#fff',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          marginTop: 10, marginBottom: 4,
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>

      {/* ── Output Section ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 8, marginBottom: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('analysis-out'), flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Output</span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="analysis-out"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('analysis-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, padding: 8,
        fontSize: 11, color: '#e0e0e0', minHeight: 40,
        maxHeight: 150, overflowY: 'auto',
        whiteSpace: 'pre-wrap', lineHeight: 1.5,
        border: '1px solid #3a3a3a',
      }}>
        {isAnalyzing
          ? <span style={{ color: '#3b82f6' }}>Analyzing...</span>
          : ((data.analysisResult as string) || <span style={{ color: '#555' }}>Analysis output will appear here...</span>)
        }
      </div>

    </NodeShell>
  );
};

export default ImageAnalyzerNode;
