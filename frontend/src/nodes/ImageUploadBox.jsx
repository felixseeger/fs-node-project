import { useRef, useState, useCallback } from 'react';
import { uploadImages } from '../utils/api';

/**
 * Reusable image upload box for nodes.
 * Shows uploaded image preview with remove button, or a click-to-upload placeholder.
 * Handles drag & drop, file validation, and upload errors.
 *
 * Props:
 *  - image: string | null — current image data URL
 *  - onImageChange: (imageUrl: string | null) => void
 *  - maxSizeMB: number (default 20)
 *  - accept: string (default "image/*")
 *  - placeholder: string
 *  - minHeight: number (default 60)
 */
export default function ImageUploadBox({
  image,
  onImageChange,
  maxSizeMB = 20,
  accept = 'image/*',
  placeholder = 'Click or drop image here',
  minHeight = 60,
}) {
  const fileRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadImages([file]);
      const imageList = result.urls || result.images;
      if (imageList?.length > 0) {
        onImageChange(imageList[0]);
      } else {
        setError('Upload failed — no image returned');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [maxSizeMB, onImageChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
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

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  if (image) {
    return (
      <div style={{
        position: 'relative',
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        overflow: 'hidden',
      }}>
        <img
          src={image}
          alt="uploaded"
          style={{ width: '100%', display: 'block', borderRadius: 6 }}
        />
        <button
          onClick={() => onImageChange(null)}
          title="Remove image"
          style={{
            position: 'absolute', top: 4, right: 4,
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(239,68,68,0.9)', border: 'none',
            color: '#fff', fontSize: 11, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          x
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => fileRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="nodrag nopan"
        style={{
          background: isDragging ? 'rgba(59,130,246,0.15)' : '#1a1a1a',
          borderRadius: 6,
          border: `2px ${isDragging ? 'solid' : 'dashed'} ${isDragging ? '#3b82f6' : '#3a3a3a'}`,
          minHeight,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          padding: 12,
          gap: 6,
          pointerEvents: 'auto',
        }}
      >
        {isUploading ? (
          <>
            <div style={{
              width: 24, height: 24, border: '2px solid #3a3a3a',
              borderTop: '2px solid #3b82f6', borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 11, color: '#888' }}>Uploading...</span>
          </>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: isDragging ? 0.8 : 0.5, transition: 'opacity 0.15s' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={isDragging ? '#3b82f6' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke={isDragging ? '#3b82f6' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke={isDragging ? '#3b82f6' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontSize: 11, 
              color: isDragging ? '#3b82f6' : '#888', 
              textAlign: 'center',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: '100%',
              fontWeight: isDragging ? 500 : 400,
              transition: 'color 0.15s',
            }}>
              {isDragging ? 'Drop image here' : placeholder}
            </span>
          </>
        )}
      </div>
      {error && (
        <div style={{
          fontSize: 10, color: '#ef4444', marginTop: 4,
          padding: '2px 6px', background: 'rgba(239,68,68,0.1)',
          borderRadius: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {error}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
  );
}
