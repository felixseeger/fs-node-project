code = """import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeShell from './NodeShell';
import { sp, colors, font } from './nodeTokens';

const Icons = {
  Upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  Plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

export default function AssetNode({ id, data, selected }) {
  const fileInputRef = useRef(null);
  const images = data.images || [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = [];
    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        processed++;
        if (processed === files.length) {
          data.onUpdate?.(id, { images: [...images, ...newImages] });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <NodeShell label={data.label || 'Asset'} dotColor={colors.blue} selected={selected}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {images.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[2] }}>
            {images.map((src, i) => (
              <div key={i} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Asset ${i}`} />
              </div>
            ))}
            <button 
              onClick={handleUploadClick}
              style={{ 
                width: 80, height: 80, borderRadius: 8, border: '1px dashed #444', 
                background: '#222', color: '#888', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0
              }}
            >
              <span style={{ width: 24, height: 24 }}>{Icons.Plus}</span>
            </button>
          </div>
        ) : (
          <div 
            onClick={handleUploadClick}
            style={{
              padding: sp[4],
              border: '1px dashed #444',
              borderRadius: 8,
              background: '#222',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sp[2],
              cursor: 'pointer',
              color: '#888'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#666'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#444'}
          >
            <span style={{ width: 24, height: 24 }}>{Icons.Upload}</span>
            <span style={{ ...font.sm, fontWeight: 500 }}>Upload Media</span>
          </div>
        )}

      </div>
      <Handle type="source" position={Position.Right} style={{ top: 40 }} />
    </NodeShell>
  );
}
"""
with open("frontend/src/nodes/AssetNode.jsx", "w") as f:
    f.write(code)
