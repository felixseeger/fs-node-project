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
  placeholder = 'Click or drag to upload image',
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
      if (result.images?.length > 0) {
        onImageChange(result.images[0]);
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: isDragging ? 'rgba(59,130,246,0.08)' : '#1a1a1a',
          borderRadius: 6,
          border: `1px ${isDragging ? 'solid' : 'dashed'} ${isDragging ? '#3b82f6' : '#3a3a3a'}`,
          minHeight,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          padding: 12,
          gap: 4,
        }}
      >
        {isUploading ? (
          <>
            <div style={{
              width: 20, height: 20, border: '2px solid #3a3a3a',
              borderTop: '2px solid #3b82f6', borderRadius: '50%',
              animation: 'node-spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#888' }}>Uploading...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.4 }}>
              <path d="M10 4V16M4 10H16" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{
              fontSize: 10, color: '#555', textAlign: 'center',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}>
              {placeholder}
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
      {/* spinner animation defined globally in index.css as node-spin */}
    </>
  );
}
