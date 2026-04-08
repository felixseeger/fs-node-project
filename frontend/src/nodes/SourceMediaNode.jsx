import React, { useRef, useCallback, useState } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS } from './nodeTokens';

/**
 * Source Media Node allows uploading images, videos, and audio locally.
 * Outputs different data types via multiple handles based on the file uploaded.
 */
export default function SourceMediaNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Store uploaded media inside the node data
  const mediaFiles = data.mediaFiles || [];

  const processFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    console.log('SourceMediaNode: Processing', fileArray.length, 'files');

    // Read all files in parallel with proper Promise handling
    const readPromises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Determine type based on file.type
          let mediaType = 'unknown';
          if (file.type.startsWith('image/')) mediaType = 'image';
          else if (file.type.startsWith('video/')) mediaType = 'video';
          else if (file.type.startsWith('audio/')) mediaType = 'audio';

          resolve({
            url: event.target.result,
            type: mediaType,
            name: file.name
          });
        };
        reader.onerror = (err) => {
          console.error('SourceMediaNode: FileReader error for', file.name, err);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(readPromises);
    const newMedia = results.filter(Boolean); // Remove nulls from errors

    if (newMedia.length > 0 && data.onUpdate) {
      data.onUpdate(id, { mediaFiles: [...mediaFiles, ...newMedia] });
    }
  }, [id, data, mediaFiles]);

  const handleUpload = useCallback((files) => {
    processFiles(files);
    // Reset the file input so the same file can be selected again
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }, [processFiles]);

  const removeMedia = useCallback(
    (idx) => {
      const updated = [...mediaFiles];
      updated.splice(idx, 1);
      data.onUpdate?.(id, { mediaFiles: updated });
    },
    [id, data, mediaFiles]
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
    // Only set to false if we're leaving the element (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    console.log('SourceMediaNode: Dropped', files?.length, 'files');
    if (files?.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  // Group media by type to expose outputs properly.
  const hasImages = mediaFiles.some(m => m.type === 'image');
  const hasVideos = mediaFiles.some(m => m.type === 'video');
  const hasAudio = mediaFiles.some(m => m.type === 'audio');

  return (
    <NodeShell data={data}
      label={data.label || 'Source Media'}
      dotColor={CATEGORY_COLORS.input}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ paddingBottom: 8 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleUpload(e.target.files);
          }}
        />

        {mediaFiles.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginBottom: 10,
              maxHeight: 180,
              overflowY: 'auto'
            }}
            className="nowheel nodrag"
          >
            {mediaFiles.map((media, i) => (
              <div key={i} style={{ 
                position: 'relative', 
                background: '#1a1a1a', 
                borderRadius: 6, 
                padding: '4px',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {media.type === 'image' && (
                  <img src={media.url} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                )}
                {media.type === 'video' && (
                  <video src={media.url} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', background: '#000' }} />
                )}
                {media.type === 'audio' && (
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#bbb' }}>
                    AUDIO
                  </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 10, color: '#e0e0e0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{media.name}</div>
                  <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase' }}>{media.type}</div>
                </div>
                <button
                  className="nodrag nopan"
                  onClick={() => removeMedia(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: 14,
                    cursor: 'pointer',
                    padding: '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="nodrag nopan"
          onClick={() => fileRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: 11,
            fontWeight: 500,
            background: isDragging ? '#1e40af' : '#2563eb',
            border: isDragging ? '2px dashed #60a5fa' : 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {isDragging ? 'Drop files here' : (mediaFiles.length > 0 ? '+ Add More Media' : 'Upload Media Files')}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {hasImages && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', height: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#888', marginRight: 4 }}>Images Only</span>
            <Handle
              type="source"
              position={Position.Right}
              id="image-out"
              style={{
                borderRadius: '50%',
                background: getHandleColor('image-out'),
                border: 'none',
              }}
            />
          </div>
        )}
        {hasVideos && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', height: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#888', marginRight: 4 }}>Video Out</span>
            <Handle
              type="source"
              position={Position.Right}
              id="video-out"
              style={{
                borderRadius: '50%',
                background: getHandleColor('video-out'),
                border: 'none',
              }}
            />
          </div>
        )}
        {hasAudio && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', height: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#888', marginRight: 4 }}>Audio Out</span>
            <Handle
              type="source"
              position={Position.Right}
              id="audio-out"
              style={{
                borderRadius: '50%',
                background: getHandleColor('audio-out'),
                border: 'none',
              }}
            />
          </div>
        )}
        {mediaFiles.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', height: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#888', marginRight: 4 }}>All Media</span>
            <Handle
              type="source"
              position={Position.Right}
              id="output"
              style={{
                borderRadius: '50%',
                background: getHandleColor('output'),
                border: 'none',
              }}
            />
          </div>
        )}
      </div>

    </NodeShell>
  );
}
