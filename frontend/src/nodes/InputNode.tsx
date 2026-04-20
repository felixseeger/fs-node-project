import React, { useCallback, useRef, useState, useEffect, type FC, type ChangeEvent, type DragEvent } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
// @ts-ignore
import { uploadImages } from '../utils/api';

interface FieldConfigEntry {
  label: string;
  dataType: string;
  color: string;
}

const FIELD_CONFIG: Record<string, FieldConfigEntry> = {
  image_urls: { label: 'Images', dataType: 'image', color: '#ec4899' },
  prompt: { label: 'Prompt', dataType: 'text', color: '#f97316' },
  aspect_ratio: { label: 'Aspect Ratio', dataType: 'aspect_ratio', color: '#f59e0b' },
  resolution: { label: 'Resolution', dataType: 'resolution', color: '#22c55e' },
  num_images: { label: 'Num Images', dataType: 'num_images', color: '#8b5cf6' },
  text: { label: 'Text', dataType: 'text', color: '#f97316' },
};

const ASPECT_OPTIONS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const RESOLUTION_OPTIONS = ['1K', '2K', '4K'];

/**
 * InputNode - Generic entry point for workflow data
 */
const InputNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  useEffect(() => {
    const fields = (data.initialFields as string[]) || ['prompt'];
    const newLocalValues: Record<string, string> = {};
    fields.forEach((field, idx) => {
      const counts: Record<string, number> = {};
      fields.slice(0, idx + 1).forEach(f => {
        counts[f] = (counts[f] || 0) + 1;
      });
      const handleId = counts[field] > 1 ? `${field}_${counts[field]}` : field;
      if (field === 'prompt' || field === 'text') {
        newLocalValues[handleId] = values[handleId] || '';
      }
    });
    setLocalValues(newLocalValues);
  }, [data.initialFields, values]);
  
  const fields = (data.initialFields as string[]) || ['prompt'];
  const values = (data.fieldValues as Record<string, any>) || {};
  const images = (data.imagesByField as Record<string, string[]>) || {};

  const updateField = useCallback(
    (field: string, value: any) => {
      update({
        fieldValues: { ...values, [field]: value },
      });
      if (typeof data.onUpdate === 'function') {
        data.onUpdate(id, {
          fieldValues: { ...values, [field]: value },
        });
      }
    },
    [id, data, values, update]
  );

  const handleImageUpload = useCallback(
    async (field: string, files: FileList | null) => {
      if (!files) return;
      setUploadError(null);
      try {
        const result = await uploadImages(Array.from(files));
        const uploaded = Array.isArray(result?.images)
          ? result.images
          : Array.isArray(result?.urls)
            ? result.urls
            : [];

        if (uploaded.length) {
          const current = images[field] || [];
          const updated = [...current, ...uploaded].slice(0, 15);
          update({
            imagesByField: { ...images, [field]: updated },
            fieldValues: { ...values, [field]: updated },
          });
          if (typeof data.onUpdate === 'function') {
            data.onUpdate(id, {
              imagesByField: { ...images, [field]: updated },
              fieldValues: { ...values, [field]: updated },
            });
          }
        } else {
          setUploadError("No images were returned from the server");
        }
      } catch (error: any) {
        console.error('Image upload failed:', error);
        setUploadError(error.message || "Failed to upload images");
      }
    },
    [id, data, images, values, update]
  );

  const removeImage = useCallback(
    (field: string, idx: number) => {
      const current = [...(images[field] || [])];
      current.splice(idx, 1);
      update({
        imagesByField: { ...images, [field]: current },
        fieldValues: { ...values, [field]: current },
      });
      if (typeof data.onUpdate === 'function') {
        data.onUpdate(id, {
          imagesByField: { ...images, [field]: current },
          fieldValues: { ...values, [field]: current },
        });
      }
    },
    [id, data, images, values, update]
  );

  // Deduplicate field names with _2, _3 suffixes
  const fieldCounts: Record<string, number> = {};
  const resolvedFields = fields.map((f) => {
    fieldCounts[f] = (fieldCounts[f] || 0) + 1;
    const handleId = fieldCounts[f] > 1 ? `${f}_${fieldCounts[f]}` : f;
    return { type: f, handleId };
  });

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

  const createDropHandler = useCallback((field: string) => (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(field, files);
    }
  }, [handleImageUpload]);

  return (
    <NodeShell data={data}
      label={(data.label as string) || 'Request - Inputs'}
      dotColor="#3b82f6"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      {resolvedFields.map(({ type, handleId }) => {
        const cfg = FIELD_CONFIG[type] || FIELD_CONFIG.text;
        const isImageField = type === 'image_urls';
        const dropHandler = createDropHandler(handleId);

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
                {(data.fieldLabels as Record<string, string>)?.[handleId] || cfg.label}
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
                className="nodrag nopan"
                value={localValues[handleId] || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLocalValues(prev => ({ ...prev, [handleId]: e.target.value }))}
                onBlur={(e) => {
                  updateField(handleId, e.currentTarget.value);
                  e.currentTarget.style.borderColor = '#3a3a3a';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                }}
              />
            ) : type === 'aspect_ratio' ? (
              <div className="nodrag nopan" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }} onMouseDown={e => e.stopPropagation()}>
                {ASPECT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField(handleId, opt)}
                    onMouseDown={e => e.stopPropagation()}
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
              <div className="nodrag nopan" style={{ display: 'flex', gap: 4 }} onMouseDown={e => e.stopPropagation()}>
                {RESOLUTION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField(handleId, opt)}
                    onMouseDown={e => e.stopPropagation()}
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
              <div className="nodrag nopan" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onMouseDown={e => e.stopPropagation()}>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={values[handleId] || 1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(handleId, Number(e.target.value))}
                  onMouseDown={e => e.stopPropagation()}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 11, color: '#e0e0e0', minWidth: 12 }}>
                  {values[handleId] || 1}
                </span>
              </div>
            ) : type === 'image_urls' ? (
              <div
                onDragOver={isImageField ? handleDragOver : undefined}
                onDragEnter={isImageField ? handleDragEnter : undefined}
                onDragLeave={isImageField ? handleDragLeave : undefined}
                onDrop={isImageField ? dropHandler : undefined}
                style={{
                  padding: isDragging ? 8 : 0,
                  border: isDragging ? '2px dashed #ec4899' : 'none',
                  borderRadius: 6,
                  background: isDragging ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleImageUpload(handleId, e.target.files)}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '4px',
                    fontSize: 10,
                    background: isDragging ? 'rgba(236, 72, 153, 0.2)' : '#1a1a1a',
                    border: isDragging ? '2px dashed #ec4899' : '1px dashed #3a3a3a',
                    borderRadius: 4,
                    color: isDragging ? '#ec4899' : '#999',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isDragging ? 'Drop images here' : '+ Upload Images'}
                </button>
                {uploadError && (
                  <div style={{
                    fontSize: '9px',
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    marginTop: '4px',
                    wordBreak: 'break-word'
                  }}>
                    {uploadError}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </NodeShell>
  );
};

export default InputNode;
