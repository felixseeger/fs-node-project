import React, { useState, type FC, useEffect, useMemo } from 'react';
import DecodedText from './components/DecodedText';


import { type Node, type Edge } from '@xyflow/react';

interface WorkflowBuilderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
}

const WorkflowBuilderDrawer: FC<WorkflowBuilderDrawerProps> = ({ isOpen, onClose, nodes = [], edges = [] }) => {
  const [step, setStep] = useState<'intro' | 'details' | 'inputs'>('intro');
  const [workflowName, setWorkflowName] = useState('');

  const candidateInputs = useMemo(() => {
    // Find nodes with no incoming edges or specific input types
    const connectedTargetIds = new Set(edges.map(e => e.target));
    return nodes.filter(n => 
      !connectedTargetIds.has(n.id) || 
      n.type?.toLowerCase().includes('input') || 
      n.type?.toLowerCase().includes('prompt')
    );
  }, [nodes, edges]);

  const [selectedInputIds, setSelectedInputIds] = useState<string[]>([]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setWorkflowName('');
      // Auto-select all candidate inputs by default
      setSelectedInputIds(candidateInputs.map(n => n.id));
    }
  }, [isOpen, candidateInputs]);

  const handleRemoveInput = (id: string) => {
    setSelectedInputIds(prev => prev.filter(inputId => inputId !== id));
  };

  const handleAddInput = (id: string) => {
    if (!selectedInputIds.includes(id)) {
      setSelectedInputIds(prev => [...prev, id]);
    }
  };

  const getNodeIcon = (type: string) => {
    if (type.toLowerCase().includes('image')) return '🖼️';
    if (type.toLowerCase().includes('video')) return '🎥';
    if (type.toLowerCase().includes('audio') || type.toLowerCase().includes('sound')) return '🎵';
    return '✍️';
  };

  const getNodeColor = (type: string) => {
    if (type.toLowerCase().includes('image')) return 'var(--color-brand-pink-soft)';
    if (type.toLowerCase().includes('video')) return 'var(--color-brand-teal-soft)';
    if (type.toLowerCase().includes('audio')) return 'var(--color-brand-purple-soft)';
    return 'rgba(249, 115, 22, 0.15)'; // Orange for text/prompts
  };

  const availableToAdd = candidateInputs.filter(n => !selectedInputIds.includes(n.id));

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const drawerStyle: React.CSSProperties = {
    width: '520px',
    height: '100%',
    background: '#0D0D0D',
    borderLeft: '1px solid var(--color-border)',
    boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    animation: 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const headerStyle: React.CSSProperties = {
    padding: '32px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--color-border)',
    background: 'rgba(255, 255, 255, 0.02)',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const footerStyle: React.CSSProperties = {
    padding: '24px 40px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.01)',
  };

  const primaryButtonStyle: React.CSSProperties = {
    background: 'var(--color-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--color-text-dim)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#141414',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    color: 'var(--color-text)',
    padding: '14px 18px',
    fontSize: '14px',
    outline: 'none',
    marginTop: '10px',
    transition: 'border-color 0.2s',
  };

  const renderIntro = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 20px' }}>
      <div style={{ 
        width: '96px', 
        height: '96px', 
        borderRadius: '28px', 
        background: 'linear-gradient(135deg, var(--color-accent) 0%, #1e40af 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '40px',
        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: -4, borderRadius: '32px', border: '1px solid var(--color-accent)', opacity: 0.3 }} />
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.03em' }}>
        <DecodedText text="Template Builder" />
      </h2>
      <p style={{ color: 'var(--color-text-dim)', lineHeight: 1.6, marginBottom: '48px', fontSize: '16px' }}>
        Package your creative logic into a production-ready template.<br/>Simplify inputs for your team and scale your workflow.
      </p>
      <button 
        style={{ ...primaryButtonStyle, padding: '16px 56px', fontSize: '16px', borderRadius: '14px' }}
        onClick={() => setStep('details')}
      >
        Start Building
      </button>
    </div>
  );

  const renderDetails = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workflow Name</label>
        <input 
          style={inputStyle}
          placeholder="e.g. Cinematic Image Generator"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview Screenshot</label>
        <div style={{ 
          marginTop: '12px',
          width: '100%',
          aspectRatio: '16/9',
          background: '#0a0a0a',
          border: '1px dashed var(--color-border)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-faint)',
          fontSize: '14px',
          gap: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)' }} />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
          <span style={{ position: 'relative' }}>Screenshot will be captured automatically</span>
        </div>
      </div>

      <div style={{ 
        marginTop: '8px',
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)',
        borderRadius: '24px',
        border: '1px solid var(--color-accent-soft)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px 20px' }}>
           <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Onboarding</span>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', maxWidth: '90%' }}>
          "Compress your creative workflow into a single step."
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === 0 ? '32px' : '8px', height: '8px', borderRadius: '4px', background: i === 0 ? 'var(--color-accent)' : 'var(--color-border)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderInputs = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '40px' }}>
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>What are the inputs?</h2>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '16px', lineHeight: 1.6 }}>
          Select input nodes or prompts in your Workflow. This defines what others need to provide when they run this Workflow.
        </p>
        <a href="#" style={{ color: 'var(--color-accent)', fontSize: '15px', fontWeight: 600, textDecoration: 'underline', marginTop: '16px', display: 'inline-block', textUnderlineOffset: '4px' }}>
          Learn more
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {selectedInputIds.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '14px', border: '1px dashed var(--color-border)', borderRadius: '20px' }}>
            No inputs selected. Click "Add Input" below to add some.
          </div>
        )}
        
        {selectedInputIds.map((id, i) => {
          const node = nodes.find(n => n.id === id);
          if (!node) return null;
          
          const icon = getNodeIcon(node.type || '');
          const color = getNodeColor(node.type || '');
          const name = String(node.data?.label || node.type || id);
          
          return (
            <div key={id} style={{ 
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              transition: 'transform 0.2s',
              position: 'relative',
            }}>
              <button 
                onClick={() => handleRemoveInput(id)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
                  cursor: 'pointer', padding: '4px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                title="Remove Input"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 12px rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '22px' }}>{icon}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '17px' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-faint)', marginTop: '2px' }}>Input Node #{i + 1} ({node.type})</div>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description (optional)</label>
                <input 
                  style={{ ...inputStyle, padding: '12px 16px', fontSize: '14px', background: '#080808' }}
                  placeholder="What should others know about this input?"
                />
              </div>
            </div>
          );
        })}
      </div>

      {availableToAdd.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <select 
            onChange={(e) => {
              if (e.target.value) {
                handleAddInput(e.target.value);
                e.target.value = '';
              }
            }}
            value=""
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px dashed var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              textAlign: 'center',
              appearance: 'none',
            }}
          >
            <option value="" disabled>+ Add Input Node...</option>
            {availableToAdd.map(node => (
              <option key={node.id} value={node.id} style={{ background: '#111', color: '#fff' }}>
                {String(node.data?.label || node.type)} ({node.id})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onClose}
              style={{ background: 'var(--color-surface-active)', border: 'none', color: 'var(--color-text)', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-active)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {step === 'intro' ? 'Overview' : 'Builder'}
            </h3>
          </div>
          {step !== 'intro' && (
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', padding: '6px 14px', background: 'var(--color-accent-soft)', borderRadius: '24px', border: '1px solid var(--color-accent-soft)' }}>
              Step {step === 'details' ? '1' : '2'} <span style={{ opacity: 0.5, margin: '0 4px' }}>/</span> 3
            </div>
          )}
        </header>

        <main style={contentStyle}>
          {step === 'intro' && renderIntro()}
          {step === 'details' && renderDetails()}
          {step === 'inputs' && renderInputs()}
        </main>

        {step !== 'intro' && (
          <footer style={footerStyle}>
            <button 
              style={secondaryButtonStyle}
              onClick={() => {
                if (step === 'details') setStep('intro');
                if (step === 'inputs') setStep('details');
              }}
            >
              Back
            </button>
            <button 
              style={primaryButtonStyle}
              onClick={() => {
                if (step === 'details') setStep('inputs');
                if (step === 'inputs') onClose();
              }}
            >
              {step === 'inputs' ? 'Save & Finish' : 'Next Step'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilderDrawer;
