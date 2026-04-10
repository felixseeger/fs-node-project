import React, { useState, useRef, FC, ChangeEvent, DragEvent } from 'react';

interface ReferenceSelectionProps {
  selectedImage?: string | null;
  onImageSelect?: (image: string | null) => void;
}

const ReferenceSelection: FC<ReferenceSelectionProps> = ({ selectedImage, onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect?.(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect?.(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    onImageSelect?.(null);
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
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#666',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Reference Image
        </span>
        <span style={{ color: '#ef4444', fontSize: 10 }}>*</span>
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
            marginLeft: 4,
          }}
          title="Select reference image"
        >
          &#43;
        </button>
      </div>

      {/* Image Box */}
      <div
        onClick={() => !selectedImage && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          width: 220,
          height: selectedImage ? 'auto' : 60,
          minHeight: 60,
          background: isDragging ? 'rgba(59, 130, 246, 0.1)' : '#141414',
          border: `1px dashed ${isDragging ? '#3b82f6' : selectedImage ? '#22c55e' : '#444'}`,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: selectedImage ? 'center' : 'flex-start',
          padding: selectedImage ? 8 : '0 12px',
          cursor: selectedImage ? 'default' : 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {selectedImage ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={selectedImage}
              alt="Reference"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 120,
                objectFit: 'cover',
                borderRadius: 6,
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Remove reference"
            >
              &times;
            </button>
          </div>
        ) : (
          <>
            {/* Checkbox placeholder */}
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
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#888',
                  marginBottom: 2,
                }}
              >
                No reference image selected
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#555',
                }}
              >
                Select an image and click to set
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferenceSelection;
