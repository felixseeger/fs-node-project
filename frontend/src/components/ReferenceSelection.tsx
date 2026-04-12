import React, { useState, useRef, type FC, type ChangeEvent, type DragEvent } from 'react';

interface ReferenceSelectionProps {
  selectedImages?: string[];
  onImagesChange?: (images: string[]) => void;
}

const ReferenceSelection: FC<ReferenceSelectionProps> = ({ selectedImages = [], onImagesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: string[] = [];
    let processedCount = 0;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
          }
          processedCount++;
          if (processedCount === files.length) {
            onImagesChange?.([...selectedImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedCount++;
      }
    });
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (index: number) => {
    const updated = selectedImages.filter((_, i) => i !== index);
    onImagesChange?.(updated);
  };

  const handleClear = () => {
    onImagesChange?.([]);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 24,
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          marginBottom: 8,
          width: 220,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#666',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Reference Images ({selectedImages.length})
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '1px solid #444',
              background: 'transparent',
              color: '#888',
              fontSize: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            title="Add reference image"
          >
            &#43;
          </button>
        </div>
        {selectedImages.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: 9,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Image Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          width: 220,
          background: isDragging ? 'rgba(59, 130, 246, 0.1)' : '#141414',
          border: `1px dashed ${isDragging ? '#3b82f6' : selectedImages.length > 0 ? '#22c55e' : '#444'}`,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
          cursor: 'default',
          transition: 'all 0.2s',
          position: 'relative',
          maxHeight: 300,
          overflowY: 'auto'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {selectedImages.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {selectedImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', background: '#0a0a0a', borderRadius: 6, overflow: 'hidden' }}>
                <img
                  src={img}
                  alt={`Ref ${idx}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                aspectRatio: '1/1',
                borderRadius: 6,
                border: '1px dashed #444',
                background: '#0a0a0a',
                color: '#444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}
            >
              +
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              height: 44, 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: '#888'
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: '2px solid #444',
                marginRight: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#444', fontSize: 10 }}>&#10003;</span>
            </div>
            <div style={{ fontSize: 12 }}>
              Drag or click to add context images
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceSelection;
