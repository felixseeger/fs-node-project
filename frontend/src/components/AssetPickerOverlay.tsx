import React, { type FC } from 'react';
import { type Asset } from '../types/asset';

interface AssetPickerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectImage: (imageUrl: string) => void;
}

const AssetPickerOverlay: FC<AssetPickerOverlayProps> = ({ isOpen, onClose, assets, onSelectImage }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="nodrag nopan nowheel"
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: 12,
        width: 300,
        maxHeight: 400,
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 3000,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#eee' }}>Pick from Library</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {assets.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#666', fontSize: 12 }}>
            No assets found in your library.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {assets.map((asset) => (
              <div key={asset.id}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 6, fontWeight: 500 }}>{asset.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {asset.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        onSelectImage(img);
                        onClose();
                      }}
                      style={{ 
                        aspectRatio: '1/1', 
                        borderRadius: 4, 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        border: '1px solid #333',
                        background: '#000'
                      }}
                      title="Click to add as reference"
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: '10px 12px', borderTop: '1px solid #333', background: '#141414', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <div style={{ fontSize: 10, color: '#555', textAlign: 'center' }}>
          Select an image to use it as context for AI
        </div>
      </div>
    </div>
  );
};

export default AssetPickerOverlay;
