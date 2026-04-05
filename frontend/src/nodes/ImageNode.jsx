import { useCallback, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { uploadImages } from '../utils/api';

export default function ImageNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef();
  const images = data.images || [];

  const handleUpload = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      const newImages = [];
      let processed = 0;

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target.result);
          processed++;
          if (processed === fileArray.length) {
            const updated = [...images, ...newImages].slice(0, 3);
            data.onUpdate?.(id, { images: updated });
          }
        };
        reader.readAsDataURL(file);
      });
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

  return (
    <NodeShell
      label={data.label || 'Image'}
      dotColor="#ec4899"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 60 }}>
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

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 4,
              marginBottom: 4,
            }}
          >
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt=""
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
                <button
                  className="nodrag nopan"
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    fontSize: 8,
                    cursor: 'pointer',
                    lineHeight: '14px',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
          <button
            className="nodrag nopan"
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%',
              padding: '4px',
              fontSize: 10,
              background: '#1a1a1a',
              border: '1px dashed #3a3a3a',
              borderRadius: 4,
              color: '#999',
              cursor: 'pointer',
            }}
          >
            + Upload Images (max 3)
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 60 }}>
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

      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <button
          className="nodrag nopan"
          onClick={() => data.onAddToInput?.('image_urls', id, 'image-in')}
          style={{
            flex: 1,
            padding: '3px 0',
            fontSize: 9,
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: 4,
            color: '#999',
            cursor: 'pointer',
          }}
        >
          Add to Input
        </button>
        <button
          className="nodrag nopan"
          onClick={() => data.onUnlink?.(id, 'image-in')}
          style={{
            flex: 1,
            padding: '3px 0',
            fontSize: 9,
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: 4,
            color: '#999',
            cursor: 'pointer',
          }}
        >
          Unlink
        </button>
      </div>
    </NodeShell>
  );
}
