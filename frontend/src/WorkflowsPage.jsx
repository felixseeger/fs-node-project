import { useState } from 'react';

// Mini preview canvas (static SVG illustration)
function HeroPreview() {
  return (
    <div
      style={{
        background: '#111',
        borderRadius: 12,
        border: '1px solid #2a2a2a',
        padding: 24,
        width: 420,
        height: 180,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Input node */}
      <div style={{
        position: 'absolute', top: 55, left: 20,
        background: '#1e1e1e', border: '1px solid #333', borderRadius: 6,
        padding: '6px 14px', fontSize: 11, color: '#ccc',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
        Input
      </div>
      {/* Claude Haiku node */}
      <div style={{
        position: 'absolute', top: 20, left: 160,
        background: '#1e1e1e', border: '1px solid #333', borderRadius: 6,
        padding: '6px 14px', fontSize: 11, color: '#ccc',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
        Claude Haiku
      </div>
      {/* Generator node */}
      <div style={{
        position: 'absolute', top: 55, right: 20,
        background: '#1e1e1e', border: '1px solid #333', borderRadius: 6,
        padding: '6px 14px', fontSize: 11, color: '#ccc',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899' }} />
        Generate
      </div>
      {/* Connection lines (SVG) */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Input -> Claude Haiku */}
        <path d="M 100 68 C 130 68, 150 38, 170 38" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Claude Haiku -> Generate (going down) */}
        <path d="M 270 38 C 290 38, 290 68, 310 68" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Input -> Generate */}
        <path d="M 100 72 C 190 72, 230 72, 310 72" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
      {/* Fake content bars */}
      <div style={{
        position: 'absolute', bottom: 30, left: 160, right: 80,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ height: 3, background: '#2a2a2a', borderRadius: 2, width: '80%' }} />
        <div style={{ height: 3, background: '#2a2a2a', borderRadius: 2, width: '60%' }} />
      </div>
    </div>
  );
}

// Sparkle icon SVG
function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#a78bfa" />
      <path d="M18 14L18.75 16.25L21 17L18.75 17.75L18 20L17.25 17.75L15 17L17.25 16.25L18 14Z" fill="#a78bfa" opacity="0.7" />
    </svg>
  );
}

// Plus icon
function PlusIcon() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, color: '#22c55e',
    }}>
      +
    </div>
  );
}

// Grid/template icon
function TemplateIcon() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#22c55e" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#22c55e" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#22c55e" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#22c55e" />
      </svg>
    </div>
  );
}

// Small sparkle for button
function SparkleSmall({ color = '#fff' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} />
      <path d="M18 14L18.75 16.25L21 17L18.75 17.75L18 20L17.25 17.75L15 17L17.25 16.25L18 14Z" fill={color} opacity="0.7" />
    </svg>
  );
}

// New Workflow Modal (two-step)
function NewWorkflowModal({ onClose, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [step, setStep] = useState('pick'); // 'pick' | 'ai'
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMode, setAiMode] = useState('fast'); // 'fast' | 'pro'

  // Step 2: Generate with AI
  if (step === 'ai') {
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: 16,
            padding: '32px 36px 36px',
            width: 520,
            maxWidth: '90vw',
          }}
        >
          {/* Header with Back + Title */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16,
          }}>
            <button
              onClick={() => setStep('pick')}
              style={{
                padding: '5px 12px', fontSize: 12, fontWeight: 500,
                background: '#1e1e1e', border: '1px solid #333',
                borderRadius: 6, color: '#ccc', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; }}
            >
              <span style={{ fontSize: 11 }}>&lsaquo;</span> Back
            </button>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: '#f0f0f0', margin: 0,
            }}>
              Generate with AI
            </h2>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 13, color: '#777', margin: '0 0 16px', lineHeight: 1.5,
          }}>
            Describe what you want your workflow to do and{' '}
            <span style={{
              display: 'inline-block', background: '#1a1a1a', border: '1px solid #333',
              borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600, color: '#ccc',
            }}>AI</span>{' '}
            agents will build it for you.
          </p>

          {/* Prompt textarea */}
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={"e.g., Upload a photo and turn it into anime style, then upscale the result..."}
            rows={4}
            style={{
              width: '100%', background: '#111', border: '1px solid #2a2a2a',
              borderRadius: 10, color: '#e0e0e0', fontSize: 13, padding: '14px 16px',
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              lineHeight: 1.5, marginBottom: 14,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
            onBlur={(e) => { e.target.style.borderColor = '#2a2a2a'; }}
          />

          {/* Fast / Pro toggle */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 10,
          }}>
            <button
              onClick={() => setAiMode('fast')}
              style={{
                padding: '7px 18px', fontSize: 12, fontWeight: 600,
                background: aiMode === 'fast' ? '#1e1e1e' : 'transparent',
                border: '1px solid',
                borderColor: aiMode === 'fast' ? '#444' : '#2a2a2a',
                borderRadius: 8, cursor: 'pointer',
                color: aiMode === 'fast' ? '#f0f0f0' : '#777',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <SparkleSmall color={aiMode === 'fast' ? '#a78bfa' : '#666'} />
              Fast
              <span style={{ fontSize: 10, color: '#666', marginLeft: 2 }}>~$0.13</span>
            </button>
            <button
              onClick={() => setAiMode('pro')}
              style={{
                padding: '7px 18px', fontSize: 12, fontWeight: 600,
                background: aiMode === 'pro' ? '#1e1e1e' : 'transparent',
                border: '1px solid',
                borderColor: aiMode === 'pro' ? '#444' : '#2a2a2a',
                borderRadius: 8, cursor: 'pointer',
                color: aiMode === 'pro' ? '#f0f0f0' : '#777',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <SparkleSmall color={aiMode === 'pro' ? '#a78bfa' : '#666'} />
              Pro
              <span style={{ fontSize: 10, color: '#666', marginLeft: 2 }}>~$0.55</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p style={{
            fontSize: 11, color: '#555', margin: '0 0 16px', lineHeight: 1.4,
          }}>
            AI generation is currently limited to the nodes available on the platform.
          </p>

          {/* Generate Workflow button */}
          <button
            onClick={() => onSelect('ai', aiPrompt, aiMode)}
            disabled={!aiPrompt.trim()}
            style={{
              width: '100%', padding: '12px', fontSize: 14, fontWeight: 700,
              background: aiPrompt.trim() ? '#3b82f6' : '#1e1e1e',
              border: 'none', borderRadius: 10,
              color: aiPrompt.trim() ? '#fff' : '#555',
              cursor: aiPrompt.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s',
            }}
          >
            <SparkleSmall color={aiPrompt.trim() ? '#fff' : '#555'} />
            Generate Workflow
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Pick how to start
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          borderRadius: 16,
          padding: '40px 36px 36px',
          width: 520,
          maxWidth: '90vw',
        }}
      >
        <h2 style={{
          fontSize: 22, fontWeight: 700, color: '#f0f0f0',
          textAlign: 'center', margin: '0 0 8px',
        }}>
          How do you want to start?
        </h2>
        <p style={{
          fontSize: 14, color: '#777',
          textAlign: 'center', margin: '0 0 28px',
        }}>
          You can always add or remove nodes later
        </p>

        {/* Generate with AI option */}
        <button
          onClick={() => setStep('ai')}
          onMouseEnter={() => setHovered('ai')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: hovered === 'ai' ? '#1a1a1a' : '#111',
            border: '1px solid #22c55e',
            borderRadius: 12,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 12,
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle green glow at top */}
          <div style={{
            position: 'absolute', top: -1, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
          }} />
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <SparkleIcon />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', marginBottom: 3 }}>
              Generate with AI
            </div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.4 }}>
              Describe what you want and <span style={{
                display: 'inline-block', background: '#1a1a1a', border: '1px solid #333',
                borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600, color: '#ccc',
              }}>AI</span> will build the workflow
            </div>
          </div>
        </button>

        {/* Bottom row: From Scratch + Pick a Template */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* From Scratch */}
          <button
            onClick={() => onSelect('scratch')}
            onMouseEnter={() => setHovered('scratch')}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '24px 16px',
              background: hovered === 'scratch' ? '#1a1a1a' : '#111',
              border: '1px solid',
              borderColor: hovered === 'scratch' ? '#444' : '#2a2a2a',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
              textAlign: 'center',
              transition: 'border-color 0.15s',
            }}
          >
            <PlusIcon />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>
                From Scratch
              </div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.4 }}>
                Start with an empty canvas and build your own pipeline
              </div>
            </div>
          </button>

          {/* Pick a Template */}
          <button
            onClick={() => onSelect('template')}
            onMouseEnter={() => setHovered('template')}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '24px 16px',
              background: hovered === 'template' ? '#1a1a1a' : '#111',
              border: '1px solid',
              borderColor: hovered === 'template' ? '#444' : '#2a2a2a',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
              textAlign: 'center',
              transition: 'border-color 0.15s',
            }}
          >
            <TemplateIcon />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>
                Pick a Template
              </div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.4 }}>
                Start from a pre-built workflow and customize it
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage({ onCreateWorkflow, workflows = [] }) {
  const [showNewModal, setShowNewModal] = useState(false);

  const handleModalSelect = (type, aiPrompt, aiMode) => {
    setShowNewModal(false);
    if (type === 'scratch' || type === 'ai') {
      const name = `Workflow ${workflows.length + 1}`;
      onCreateWorkflow(name, null, { type, aiPrompt, aiMode });
    }
    // 'template' could open a template picker in the future
    if (type === 'template') {
      const name = `Workflow ${workflows.length + 1}`;
      onCreateWorkflow(name);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflowY: 'auto',
      }}
    >
      {showNewModal && (
        <NewWorkflowModal
          onClose={() => setShowNewModal(false)}
          onSelect={handleModalSelect}
        />
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
        
        {/* Hero section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 24,
          marginBottom: 80,
          position: 'relative'
        }}>
          {/* Subtle background glow behind the text */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            filter: 'blur(100px)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <div style={{ flex: 1, maxWidth: 650, zIndex: 1, position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 999, marginBottom: 24, fontSize: 13, color: '#aaa', fontWeight: 500 }}>
               ✨ FS 1.0 is live
            </div>
            
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.05,
              margin: '0 0 24px',
              letterSpacing: '-0.03em'
            }}>
              Drag.<br />
              Connect.<br />
              Deploy.
            </h1>
            <p style={{
              fontSize: 18,
              color: '#A9A9A9',
              lineHeight: 1.6,
              margin: '0 auto 40px',
              maxWidth: 580
            }}>
              The node-based editor for AI workflows. Connect vision models, generators, and enhancers visually, then deploy each workflow as a live API. No code required.
            </p>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => setShowNewModal(true)}
                style={{
                  background: '#3B3BFF',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 9999,
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(59, 59, 255, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(59, 59, 255, 0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(59, 59, 255, 0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Start building
              </button>
              
              <button
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 9999,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = '#666'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#444'; }}
              >
                See how it works &rarr;
              </button>
            </div>
          </div>
          
          {/* Visual Graphic */}
          <div style={{ zIndex: 1, marginTop: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img src="/hero_img.jpg" alt="AI workflow node editor" style={{ width: '100%', maxWidth: '1000px', borderRadius: 16, border: '1px solid #222', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }} />
          </div>
        </div>

        {/* Your Workflows section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e0', margin: 0 }}>
            Your Workflows
          </h2>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              padding: '6px 16px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 6,
              color: '#ccc',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; }}
          >
            + New
          </button>
        </div>

        {/* Workflow cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {/* New Workflow card */}
          <div
            onClick={() => setShowNewModal(true)}
            style={{
              background: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#1e1e1e',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#888',
                marginBottom: 4,
              }}
            >
              +
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0' }}>
              New Workflow
            </span>
            <span style={{ fontSize: 12, color: '#666' }}>
              Build a custom AI image pipeline
            </span>
          </div>

          {/* Existing workflow cards */}
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => onCreateWorkflow(wf.name, wf.id)}
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 12,
                padding: 24,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              {/* Mini preview */}
              <div
                style={{
                  background: '#0e0e0e',
                  borderRadius: 8,
                  height: 80,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <svg width="120" height="40">
                  <rect x="5" y="12" width="30" height="16" rx="3" fill="#1e1e1e" stroke="#333" strokeWidth="0.5" />
                  <circle cx="8" cy="20" r="2" fill="#22c55e" />
                  <rect x="45" y="5" width="30" height="16" rx="3" fill="#1e1e1e" stroke="#333" strokeWidth="0.5" />
                  <circle cx="48" cy="13" r="2" fill="#f97316" />
                  <rect x="85" y="12" width="30" height="16" rx="3" fill="#1e1e1e" stroke="#333" strokeWidth="0.5" />
                  <circle cx="88" cy="20" r="2" fill="#ec4899" />
                  <line x1="35" y1="20" x2="45" y2="13" stroke="#555" strokeWidth="0.8" />
                  <line x1="75" y1="13" x2="85" y2="20" stroke="#555" strokeWidth="0.8" />
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0' }}>
                {wf.name}
              </span>
              <span style={{ fontSize: 11, color: '#666' }}>
                {wf.nodeCount || 0} nodes
              </span>
            </div>
          ))}
        </div>

        {/* Templates section */}
        <div style={{ marginTop: 56 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e0', margin: 0 }}>
              Templates
            </h2>
            <span style={{ fontSize: 14, color: '#666', marginTop: 1 }}>&rsaquo;</span>
          </div>

          {/* Template cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {/* Generate Prompt Ideas */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 12,
                padding: 24,
                cursor: 'pointer',
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              {/* Preview grid */}
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 10,
                background: '#0e0e0e',
                border: '1px solid #2a2a2a',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                gap: 3,
                padding: 6,
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Color squares */}
                <div style={{ background: '#3b82f6', borderRadius: 4 }} />
                <div style={{ background: '#a78bfa', borderRadius: 4 }} />
                <div style={{ background: '#22c55e', borderRadius: 4 }} />
                <div style={{ background: '#f97316', borderRadius: 4 }} />
                <div style={{ background: '#3b82f6', borderRadius: 4 }} />
                <div style={{ background: '#ec4899', borderRadius: 4 }} />
                <div style={{ background: '#22c55e', borderRadius: 4 }} />
                <div style={{ background: '#f97316', borderRadius: 4 }} />
                <div style={{ background: '#a78bfa', borderRadius: 4 }} />

                {/* Sparkle overlay */}
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  style={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#a78bfa" opacity="0.8" />
                </svg>
              </div>

              {/* Text content */}
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                  Generate Prompt Ideas
                </div>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                  Upload an image or enter keywords to get a list of prompt ideas you can use to generate images in any style with Kora Imagen.
                </p>
              </div>

              {/* Right arrow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 6,
                background: '#1e1e1e',
                border: '1px solid #333',
                flexShrink: 0,
                color: '#888',
                fontSize: 14,
              }}>
                &rsaquo;
              </div>
            </div>
          </div>
        </div>

        {/* Introducing Workflows section */}
        <div style={{ marginTop: 56, marginBottom: 60 }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#f0f0f0',
              margin: '0 0 16px',
            }}>
              Create at the speed of thought
            </h2>
            <p style={{
              fontSize: 16,
              color: '#aaa',
              lineHeight: 1.7,
              margin: '0 auto',
              maxWidth: 620,
            }}>
              Visually build, test, and deploy complex AI workflows. Go from idea to production-ready API in minutes, not weeks.
            </p>
          </div>

          {/* Hero image */}
          <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid #2a2a2a',
            marginBottom: 40,
            background: '#111',
          }}>
            <img
              src="/intro_img.jpg"
              alt="Workflows visual editor"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Feature cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}>
            {/* Available Nodes */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="7" height="7" rx="2" fill="#3b82f6" />
                  <rect x="11" y="2" width="7" height="7" rx="2" fill="#3b82f6" opacity="0.6" />
                  <rect x="2" y="11" width="7" height="7" rx="2" fill="#3b82f6" opacity="0.6" />
                  <rect x="11" y="11" width="7" height="7" rx="2" fill="#3b82f6" opacity="0.4" />
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                Available Nodes
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                Input, text, image, vision analysis, generation, and response nodes ready to use.
              </p>
            </div>

            {/* System Test Workflow */}
            <div
              onClick={() => onCreateWorkflow('System Test Workflow', null, { type: 'system-test' })}
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                System Test Workflow
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                A massive workflow containing one of every available node to verify the system works.
              </p>
            </div>

            {/* Pre-Built Templates */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="14" rx="2" stroke="#22c55e" strokeWidth="1.5" fill="none" />
                  <line x1="6" y1="7" x2="14" y2="7" stroke="#22c55e" strokeWidth="1" />
                  <line x1="6" y1="10" x2="12" y2="10" stroke="#22c55e" strokeWidth="1" />
                  <line x1="6" y1="13" x2="10" y2="13" stroke="#22c55e" strokeWidth="1" />
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                Pre-Built Templates
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                Start from ready-made workflows for common image tasks. Customize and ship in minutes.
              </p>
            </div>

            {/* GPU Infrastructure */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="6" width="16" height="8" rx="2" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
                  <line x1="6" y1="6" x2="6" y2="14" stroke="#a78bfa" strokeWidth="1" />
                  <line x1="10" y1="6" x2="10" y2="14" stroke="#a78bfa" strokeWidth="1" />
                  <line x1="14" y1="6" x2="14" y2="14" stroke="#a78bfa" strokeWidth="1" />
                  <circle cx="5" cy="3" r="1.5" fill="#a78bfa" />
                  <circle cx="10" cy="3" r="1.5" fill="#a78bfa" />
                  <circle cx="15" cy="3" r="1.5" fill="#a78bfa" />
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                GPU Infrastructure
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                Managed GPU compute for inference. No DevOps needed — we scale automatically.
              </p>
            </div>

            {/* 1-Click API Deployment */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 24,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f97316'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(249,115,22,0.1)',
                border: '1px solid rgba(249,115,22,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L13 8H17L11 12L13 18L10 14L7 18L9 12L3 8H7L10 2Z" fill="#f97316" />
                </svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
                1-Click API Deployment
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                Deploy any workflow as a live API endpoint instantly. Integrate with any app via SDK.
              </p>
            </div>
          </div>
        </div>

        {/* Built for Builders section */}
        <div style={{ marginTop: 56, marginBottom: 80 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e0', margin: 0 }}>
              Built for Builders
            </h2>
            <span style={{ fontSize: 14, color: '#666', marginTop: 1 }}>&rsaquo;</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}>
            {/* API-First Card */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 28,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              {/* Code preview */}
              <div style={{
                background: '#0e0e0e',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 20,
                fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
                fontSize: 11,
                lineHeight: 1.7,
                color: '#888',
                borderLeft: '3px solid #3b82f6',
              }}>
                <div><span style={{ color: '#a78bfa' }}>const</span> <span style={{ color: '#e0e0e0' }}>result</span> = <span style={{ color: '#a78bfa' }}>await</span> kora.<span style={{ color: '#3b82f6' }}>run</span>({'{'}</div>
                <div style={{ paddingLeft: 16 }}><span style={{ color: '#22c55e' }}>workflow</span>: <span style={{ color: '#f97316' }}>'img-pipeline'</span>,</div>
                <div style={{ paddingLeft: 16 }}><span style={{ color: '#22c55e' }}>input</span>: <span style={{ color: '#f97316' }}>'./photo.png'</span></div>
                <div>{'}'});</div>
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0', marginBottom: 8 }}>
                API-First Workflows
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.55, margin: 0 }}>
                Every workflow is an API endpoint. Deploy in one click and integrate into any app with our SDK.
              </p>
            </div>

            {/* Developer Experience Card */}
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 14,
                padding: 28,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a78bfa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              {/* Terminal preview */}
              <div style={{
                background: '#0e0e0e',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 20,
                fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
                fontSize: 11,
                lineHeight: 1.7,
                borderLeft: '3px solid #a78bfa',
              }}>
                <div><span style={{ color: '#666' }}>$</span> <span style={{ color: '#22c55e' }}>npx</span> <span style={{ color: '#e0e0e0' }}>kora</span> code-workflow</div>
                <div><span style={{ color: '#666' }}>$</span> <span style={{ color: '#22c55e' }}>npx</span> <span style={{ color: '#e0e0e0' }}>kora</span> deploy --env prod</div>
                <div><span style={{ color: '#888' }}>✓</span> <span style={{ color: '#e0e0e0' }}>Deployed to</span> <span style={{ color: '#3b82f6' }}>api.kora.ai/wf/abc123</span></div>
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0', marginBottom: 8 }}>
                CLI & Deploy
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.55, margin: 0 }}>
                Manage, test, and deploy workflows from the terminal. CI/CD ready with environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
