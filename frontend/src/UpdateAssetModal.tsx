import React, { useState, useRef, useEffect, FC } from 'react';
import { createPortal } from 'react-dom';

interface UpdateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData?: {
    id: string;
    label?: string;
    name?: string;
    images?: string[];
  };
  onUpdate?: (id: string, patch: any) => void;
  onCreateAsset?: (data: any) => void;
}

export const UpdateAssetModal: FC<UpdateAssetModalProps> = ({ 
  isOpen, 
  onClose, 
  nodeData, 
  onUpdate, 
  onCreateAsset 
}) => {
  const [name, setName] = useState('Unnamed Element');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or nodeData changes
  useEffect(() => {
    if (isOpen) {
      setName(nodeData?.label || nodeData?.name || 'Unnamed Element');
      setImages(nodeData?.images || []);
    }
  }, [isOpen, nodeData]);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages: string[] = [];
    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (onUpdate && nodeData?.id) {
      onUpdate(nodeData.id, { label: name, name: name, images });
    } else if (onCreateAsset) {
      onCreateAsset({ name, images });
    }
    onClose();
  };

  // Render placeholders up to a minimum of 4
  const maxSlots = Math.max(4, images.length + 1);
  const placeholders = Math.max(0, maxSlots - images.length - 1);

  const modalContent = (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '540px',
          background: '#202123',
          borderRadius: '16px',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#EAEAEA', margin: 0 }}>Update element</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              padding: 4,
              borderRadius: 4
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#EAEAEA'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#888'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Name Input */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', marginTop: '8px' }}>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: '#343541',
                border: '1px solid #4A4A4A',
                borderRadius: '9999px',
                padding: '8px 16px',
                color: '#EAEAEA',
                fontSize: '14px',
                textAlign: 'center',
                width: 'auto',
                minWidth: '200px',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = '#888'}
              onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = '#4A4A4A'}
            />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Upload Button */}
            <button 
              onClick={handleUploadClick}
              style={{
                background: '#343541',
                border: '1px solid transparent',
                borderRadius: '12px',
                aspectRatio: '1/1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#EAEAEA',
                transition: 'border-color 0.2s',
                padding: 0
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#888'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span style={{ fontSize: '12px' }}>Upload from device</span>
            </button>

            {/* Images */}
            {images.map((src, index) => (
              <div key={index} style={{
                position: 'relative',
                borderRadius: '12px',
                aspectRatio: '1/1',
                overflow: 'hidden',
                background: '#2A2A2A',
                border: '1px solid #4A4A4A'
              }}>
                <img src={src} alt={`Asset ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Remove"
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.6)'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}

            {/* Placeholders */}
            {Array.from({ length: placeholders }).map((_, index) => (
              <div key={`placeholder-${index}`} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                aspectRatio: '1/1',
              }} />
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            borderTop: '1px solid #333',
            paddingTop: '24px'
          }}>
            {/* Options */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid #AEAEB2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                cursor: 'pointer'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EAEAEA' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#EAEAEA', fontSize: '14px', fontWeight: '500' }}>Add images to make a reusable visual element</span>
                <span style={{ color: '#8E8E93', fontSize: '12px', maxWidth: '320px', lineHeight: 1.4 }}>
                  For best results, use multiple images of the same subject with varied angles, lighting, framing, and context.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSave}
              style={{
                background: '#343541',
                color: '#EAEAEA',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
                marginLeft: '16px'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#4A4B53'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#343541'}
            >
              Update Element
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default UpdateAssetModal;
