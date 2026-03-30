import React from 'react';

const Icons = {
  Close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
};

export default function AssetModal({ isOpen, onClose, onUpload }) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: 500,
          background: '#1e1e1e',
          borderRadius: 12,
          border: '1px solid #333',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e0', margin: 0 }}>Create New Element</h2>
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
          >
            <span style={{ width: 16, height: 16 }}>{Icons.Close}</span>
          </button>
        </div>

        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', width: 240, height: 160, marginBottom: 32 }}>
            <div style={{ 
              position: 'absolute', top: 20, left: 10, width: 100, height: 120, 
              background: '#2a2a2a', borderRadius: 8, transform: 'rotate(-10deg)',
              border: '2px solid #333', overflow: 'hidden'
            }}>
              <img src="/ref/intro_img.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
            </div>
            <div style={{ 
              position: 'absolute', top: 20, right: 10, width: 100, height: 120, 
              background: '#2a2a2a', borderRadius: 8, transform: 'rotate(10deg)',
              border: '2px solid #333', overflow: 'hidden'
            }}>
              <img src="/ref/hero.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
            </div>
            <div style={{ 
              position: 'absolute', top: 0, left: 60, width: 120, height: 160, 
              background: '#333', borderRadius: 8, zIndex: 2,
              border: '2px solid #444', overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
            }}>
              <img src="/ref/intro_img.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 8px 0', textAlign: 'center' }}>
            Add images to make a reusable visual Element
          </h3>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 32px 0', textAlign: 'center', maxWidth: 360, lineHeight: 1.4 }}>
            For best results, use multiple images of the same subject from different angles
          </p>

          <button style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 24,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          onClick={() => {
            if(onUpload) onUpload('assetNode', {});
            onClose();
          }}
          >
            <span style={{ width: 18, height: 18 }}>{Icons.Upload}</span>
            Upload from device
          </button>

        </div>
      </div>
    </div>
  );
}
