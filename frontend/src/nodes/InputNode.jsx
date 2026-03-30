import { useCallback, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { uploadImages } from '../utils/api';

const FIELD_CONFIG = {
  image_urls: { label: 'Images', dataType: 'image', color: '#ec4899' },
  prompt: { label: 'Prompt', dataType: 'text', color: '#f97316' },
  aspect_ratio: { label: 'Aspect Ratio', dataType: 'aspect_ratio', color: '#f59e0b' },
  resolution: { label: 'Resolution', dataType: 'resolution', color: '#22c55e' },
  num_images: { label: 'Num Images', dataType: 'num_images', color: '#8b5cf6' },
  text: { label: 'Text', dataType: 'text', color: '#f97316' },
};

const ASPECT_OPTIONS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const RESOLUTION_OPTIONS = ['1K', '2K', '4K'];

export default function InputNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef();
  const fields = data.initialFields || ['prompt'];
  const values = data.fieldValues || {};
  const images = data.imagesByField || {};

  const updateField = useCallback(
    (field, value) => {
      data.onUpdate?.(id, {
        fieldValues: { ...values, [field]: value },
      });
    },
    [id, data, values]
  );

  const handleImageUpload = useCallback(
    async (field, files) => {
      const result = await uploadImages(Array.from(files));
      const current = images[field] || [];
      const updated = [...current, ...result.images].slice(0, 15);
      data.onUpdate?.(id, {
        imagesByField: { ...images, [field]: updated },
        fieldValues: { ...values, [field]: updated },
      });
    },
    [id, data, images, values]
  );

  const removeImage = useCallback(
    (field, idx) => {
      const current = [...(images[field] || [])];
      current.splice(idx, 1);
      data.onUpdate?.(id, {
        imagesByField: { ...images, [field]: current },
        fieldValues: { ...values, [field]: current },
      });
    },
    [id, data, images, values]
  );

  // Deduplicate field names with _2, _3 suffixes
  const fieldCounts = {};
  const resolvedFields = fields.map((f) => {
    fieldCounts[f] = (fieldCounts[f] || 0) + 1;
    const handleId = fieldCounts[f] > 1 ? `${f}_${fieldCounts[f]}` : f;
    return { type: f, handleId };
  });

  return (
    <NodeShell
      label={data.label || 'Request - Inputs'}
      dotColor="#3b82f6"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      {resolvedFields.map(({ type, handleId }) => {
        const cfg = FIELD_CONFIG[type] || FIELD_CONFIG.text;
        return (
          <div key={handleId} style={{ marginBottom: 8, position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 10, color: '#999' }}>
                {data.fieldLabels?.[handleId] || cfg.label}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={handleId}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: cfg.color,
                  border: 'none',
                  position: 'relative',
                  top: 'auto',
                  right: -12,
                  transform: 'none',
                }}
              />
            </div>

            {type === 'prompt' || type === 'text' ? (
              <textarea
                value={values[handleId] || ''}
                onChange={(e) => updateField(handleId, e.target.value)}
                placeholder={`Enter ${cfg.label.toLowerCase()}...`}
                rows={3}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid #3a3a3a',
                  borderRadius: 4,
                  color: '#e0e0e0',
                  fontSize: 12,
                  padding: 6,
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            ) : type === 'aspect_ratio' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ASPECT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField(handleId, opt)}
                    style={{
                      padding: '2px 8px',
                      fontSize: 10,
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        (values[handleId] || '1:1') === opt ? cfg.color : '#1a1a1a',
                      color: (values[handleId] || '1:1') === opt ? '#000' : '#999',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : type === 'resolution' ? (
              <div style={{ display: 'flex', gap: 4 }}>
                {RESOLUTION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField(handleId, opt)}
                    style={{
                      padding: '2px 8px',
                      fontSize: 10,
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        (values[handleId] || '1K') === opt ? cfg.color : '#1a1a1a',
                      color: (values[handleId] || '1K') === opt ? '#000' : '#999',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : type === 'num_images' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={values[handleId] || 1}
                  onChange={(e) => updateField(handleId, Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 11, color: '#e0e0e0', minWidth: 12 }}>
                  {values[handleId] || 1}
                </span>
              </div>
            ) : type === 'image_urls' ? (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  {(images[handleId] || []).map((img, i) => (
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
                        onClick={() => removeImage(handleId, i)}
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
                  onChange={(e) => handleImageUpload(handleId, e.target.files)}
                />
                <button
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
                  + Upload Images
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </NodeShell>
  );
}
