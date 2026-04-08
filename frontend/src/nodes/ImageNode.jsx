import { useCallback, useRef, useState } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { uploadImages } from '../utils/api';

export default function ImageNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef();
  const images = data.images || [];
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = useCallback(
    async (files) => {
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      try {
        const result = await uploadImages(fileArray);
        if (result.images) {
          const updated = [...images, ...result.images].slice(0, 3);
          data.onUpdate?.(id, { images: updated });
        } else if (result.error) {
          console.error("Upload error:", result.error);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    },
    [id, data, images]
  );

  const removeImage = useCallback(
    (idx) => {
      const updated = [...images];
      updated.splice(idx, 1);
      data.onUpdate?.(id, { images: updated });
    },
    [id, data, images]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
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

  const containerStyle = {
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
    <NodeShell data={data}
      label={data.label || 'Image'}
      dotColor="#ec4899"
      selected={selected}
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
                  src={img}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #3a3a3a',
                  }}
                />
                <button
                  className="nodrag nopan"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(i);
                  }}
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
            onChange={(e) => {
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
  );
}

