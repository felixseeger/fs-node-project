import React, { useCallback, useEffect, useRef, useState, FC, ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Position, Handle, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
// @ts-ignore
import { uploadImages } from '../utils/api';
import AnnotationModal from '../components/AnnotationModal';

function getImageSrc(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.url || value.src || value.image || value.outputImage || null;
  }
  return null;
}

/**
 * ImageNode - Media container node
 */
const ImageNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef<HTMLInputElement>(null);
  const images = (data.images as any[]) || [];
  const [isDragging, setIsDragging] = useState(false);
  const [annotationIndex, setAnnotationIndex] = useState<number | null>(null);

  useEffect(() => {
    if (annotationIndex !== null && (annotationIndex < 0 || annotationIndex >= images.length)) {
      setAnnotationIndex(null);
    }
  }, [annotationIndex, images.length]);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      try {
        const result = await uploadImages(fileArray);
        const uploaded = Array.isArray(result?.images)
          ? result.images
          : Array.isArray(result?.urls)
            ? result.urls
            : [];

        if (uploaded.length) {
          const normalized = uploaded.map(getImageSrc).filter(Boolean) as string[];
          const updated = [...images, ...normalized].slice(0, 3);
          if (typeof data.onUpdate === 'function') {
            data.onUpdate(id, { images: updated });
          }
        } else if (result?.error) {
          console.error("Upload error:", result.error);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    },
    [id, data, images]
  );

  const removeImage = useCallback(
    (idx: number) => {
      const updated = [...images];
      updated.splice(idx, 1);
      if (typeof data.onUpdate === 'function') {
        data.onUpdate(id, { images: updated });
      }
    },
    [id, data, images]
  );

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

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files);
      }
    },
    [handleUpload]
  );

  const containerStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px',
    minHeight: '120px',
    borderRadius: '12px',
    border: isDragging ? '2px dashed #ec4899' : '1px solid transparent',
    background: isDragging ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  return (
    <>
    <NodeShell data={data}
      label={(data.label as string) || 'Image'}
      dotColor="#ec4899"
      selected={selected}
      onDisconnect={disconnectNode}
      downloadUrl={images.length > 0 ? getImageSrc(images[0]) || undefined : undefined}
    >
      <div 
        style={{ display: 'flex', alignItems: 'stretch' }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 10,
          }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id="image-in"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('image-in'),
              border: 'none',
              position: 'relative',
              left: -12,
              transform: 'none',
            }}
          />
        </div>

        <div style={containerStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 8,
            }}
          >
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                <img
                  className="nodrag nopan"
                  src={getImageSrc(img) || ''}
                  alt=""
                  title="Click to annotate"
                  role="button"
                  tabIndex={0}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e: KeyboardEvent<HTMLImageElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setAnnotationIndex(i);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnnotationIndex(i);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #3a3a3a',
                    cursor: 'pointer',
                  }}
                />
                <button
                  className="nodrag nopan"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(i);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            
            {images.length < 3 && (
              <div
                onClick={() => fileRef.current?.click()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="nodrag nopan"
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: '#1a1a1a',
                  border: '1px dashed #444',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#666',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span style={{ fontSize: 9, marginTop: 4, fontWeight: 600 }}>{images.length === 0 ? 'UPLOAD' : 'ADD'}</span>
              </div>
            )}
          </div>
          
          {isDragging && (
            <div style={{
              position: 'absolute',
              inset: 4,
              background: 'rgba(236, 72, 153, 0.1)',
              border: '2px dashed #ec4899',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899',
              fontSize: 12,
              fontWeight: 600,
              pointerEvents: 'none',
              zIndex: 20
            }}>
              DROP TO UPLOAD
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleUpload(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 10,
          }}
        >
          <Handle
            type="source"
            position={Position.Right}
            id="image-out"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('image-out'),
              border: 'none',
              position: 'relative',
              right: -12,
              transform: 'none',
            }}
          />
        </div>
      </div>
    </NodeShell>

    {annotationIndex !== null && getImageSrc(images[annotationIndex]) && createPortal(
      <AnnotationModal
        imageUrl={getImageSrc(images[annotationIndex])!}
        onSave={(dataUrl: string) => {
          const next = [...images];
          next[annotationIndex] = dataUrl;
          if (typeof data.onUpdate === 'function') {
            data.onUpdate(id, { images: next });
          }
          setAnnotationIndex(null);
        }}
        onClose={() => setAnnotationIndex(null)}
      />,
      document.body
    )}
    </>
  );
};

export default ImageNode;
