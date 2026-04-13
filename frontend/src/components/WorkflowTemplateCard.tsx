import { type FC } from 'react';
import { createPortal } from 'react-dom';

interface Template {
  id?: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  coverImage?: string;
  nodes?: any[];
  edges?: any[];
  authorName?: string;
  cost?: number | string;
}

interface WorkflowTemplateCardProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onAddToCanvas: (template: Template) => void;
  onOpenAsApp?: (template: Template) => void;
}

export const WorkflowTemplateCard: FC<WorkflowTemplateCardProps> = ({
  isOpen,
  onClose,
  template,
  onAddToCanvas,
  onOpenAsApp
}) => {
  if (!isOpen || !template) return null;

  // Derive inputs and outputs from nodes if available
  const inputs = template.nodes?.filter(n => n.type === 'inputNode' || n.type === 'input' || n.type === 'imageNode') || [];
  const outputs = template.nodes?.filter(n => n.type === 'imageOutput' || n.type === 'videoOutput' || n.type === 'response') || [];

  const modalContent = (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4000,
        fontFamily: "'SF Pro Display', 'Inter', sans-serif"
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '900px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          background: '#1A1A1A',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button 
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: '#A0A0A0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              padding: 0,
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>←</span>
            Back to Library
          </button>
          
          <button 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A0A0A0',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </button>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(350px, 450px) 1fr',
          gap: '32px',
          padding: '32px',
          overflowY: 'auto',
          flexGrow: 1
        }}>
          {/* Left Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 700, 
                color: '#FFF', 
                margin: '0 0 12px 0',
                letterSpacing: '-0.02em'
              }}>
                {template.name}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  background: '#6C725E', marginRight: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: 'bold'
                }}>
                  {template.authorName ? template.authorName.charAt(0).toUpperCase() : 'F'}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#A0A0A0', marginRight: '6px' }}>
                  {template.authorName || 'FLORA'}
                </span>
                <div style={{ 
                  width: '14px', height: '14px', borderRadius: '50%', 
                  background: '#2F6C2C', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>

              <p style={{ fontSize: '16px', color: '#A0A0A0', lineHeight: 1.5, margin: 0 }}>
                {template.description || 'Turn products into styled grid layouts and animations.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { onAddToCanvas(template); onClose(); }}
                style={{
                  background: '#2F80ED',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  flexGrow: 1,
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px', marginRight: '8px', fontWeight: 400 }}>+</span>
                Add to canvas
              </button>
              
              <button 
                onClick={() => { if (onOpenAsApp) { onOpenAsApp(template); onClose(); } }}
                style={{
                  background: 'transparent',
                  color: '#E0E0E0',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  flexGrow: 1,
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Open as app
              </button>

              <button 
                style={{
                  background: 'transparent',
                  color: '#A0A0A0',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>

            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              
              {/* About Card */}
              <div style={{ background: '#242424', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#A0A0A0', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  About
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#A0A0A0', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      Cost
                    </span>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>{template.cost || '12'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#A0A0A0', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      Time
                    </span>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>~1 min</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#A0A0A0', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                      Runs
                    </span>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>1.2K</span>
                  </div>
                </div>
              </div>

              {/* Inputs & Outputs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Inputs */}
                <div style={{ background: '#242424', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#A0A0A0', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E879F9" strokeWidth="2" style={{ marginRight: '8px' }}><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                    Inputs
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {inputs.length > 0 ? inputs.map((node, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 500 }}>{node.data?.label || 'Input'}</span>
                          <span style={{ color: '#888', fontSize: '11px' }}>Image</span>
                        </div>
                      </div>
                    )) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 500 }}>Product Image</span>
                          <span style={{ color: '#888', fontSize: '11px' }}>Image</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Outputs */}
                <div style={{ background: '#242424', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#A0A0A0', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" style={{ marginRight: '8px' }}><path d="M9 21H3v-6"></path><path d="M14 10l7-7"></path><path d="M6 11v6a2 2 0 0 0 2 2h6"></path></svg>
                    Outputs
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {outputs.length > 0 ? outputs.map((node, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 500 }}>{node.data?.label || 'Output'}</span>
                          <span style={{ color: '#888', fontSize: '11px' }}>Video / Image</span>
                        </div>
                      </div>
                    )) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 500 }}>Grid Storyboard</span>
                          <span style={{ color: '#888', fontSize: '11px' }}>Image</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Panel - Media Preview */}
          <div style={{ 
            height: '100%', 
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {(template.thumbnailUrl || template.coverImage) ? (
              <img 
                src={template.thumbnailUrl || template.coverImage} 
                alt={template.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ 
                width: '100%', height: '100%', 
                background: 'linear-gradient(135deg, #2d394d 0%, #1a1a1a 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#444'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default WorkflowTemplateCard;
