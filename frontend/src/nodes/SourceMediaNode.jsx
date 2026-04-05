import React, { useRef, useCallback } from 'react';
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
  
  // Store uploaded media inside the node data
  const mediaFiles = data.mediaFiles || [];

  const handleUpload = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      const newMedia = [];
      let processed = 0;

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Determine type based on file.type
          let mediaType = 'unknown';
          if (file.type.startsWith('image/')) mediaType = 'image';
          else if (file.type.startsWith('video/')) mediaType = 'video';
          else if (file.type.startsWith('audio/')) mediaType = 'audio';

          newMedia.push({
            url: event.target.result,
            type: mediaType,
            name: file.name
          });
          
          processed++;
          if (processed === fileArray.length) {
            const updated = [...mediaFiles, ...newMedia];
            data.onUpdate?.(id, { mediaFiles: updated });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [id, data, mediaFiles]
  );

  const removeMedia = useCallback(
    (idx) => {
      const updated = [...mediaFiles];
      updated.splice(idx, 1);
      data.onUpdate?.(id, { mediaFiles: updated });
    },
    [id, data, mediaFiles]
  );

  // Group media by type to expose outputs properly.
  // Although handles can pass whatever object the user wants, usually they just map 1:1.
  const hasImages = mediaFiles.some(m => m.type === 'image');
  const hasVideos = mediaFiles.some(m => m.type === 'video');
  const hasAudio = mediaFiles.some(m => m.type === 'audio');

  return (
    <NodeShell
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
            e.target.value = '';
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
          style={{
            width: '100%',
            padding: '8px',
            fontSize: 11,
            fontWeight: 500,
            background: '#2563eb',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {mediaFiles.length > 0 ? '+ Add More Media' : 'Upload Media Files'}
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
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getHandleColor('image-out'),
                border: 'none',
                right: -12,
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
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getHandleColor('video-out'),
                border: 'none',
                right: -12,
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
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getHandleColor('audio-out'),
                border: 'none',
                right: -12,
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
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getHandleColor('output'),
                border: 'none',
                right: -12,
              }}
            />
          </div>
        )}
      </div>

    </NodeShell>
  );
}
