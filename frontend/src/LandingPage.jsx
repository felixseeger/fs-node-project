import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DecodeTextButton from './components/DecodeTextButton';
import ScrambledHeroText from './components/ScrambledHeroText';
import DotMatrixDisplay from './components/DotMatrixDisplay';
import MobileNavigation from './components/MobileNavigation';
import Nodes3DScroll from './components/Nodes3DScroll';

// Icons
import fluxIcon from './assets/icons/black-forest-labs.svg';
import klingIcon from './assets/icons/kling.svg';
import runwayIcon from './assets/icons/runway.svg';
import minimaxIcon from './assets/icons/minimax.svg';
import pixverseIcon from './assets/icons/pixverse.svg';
import koraIcon from './assets/icons/kora.png';
import wanIcon from './assets/icons/wan2-6.png';
import googleIcon from './assets/icons/google.svg';

function ModelsDisplaySection() {
  const models = [
    { icon: fluxIcon, name: "FLUX.1 [DEV]", desc: "State-of-the-Art Image Gen" },
    { icon: klingIcon, name: "KLING 1.5", desc: "Cinematic Video Hub" },
    { icon: runwayIcon, name: "RUNWAY GEN-3", desc: "Professional Video Platform" },
    { icon: minimaxIcon, name: "MINIMAX V2", desc: "Humanoid Motion Synthesis" },
    { icon: pixverseIcon, name: "PIXVERSE V2", desc: "Infinite Flow Animation" },
    { icon: koraIcon, name: "KORA REALITY", desc: "Photorealistic Text-to-Image" },
    { icon: wanIcon, name: "WAN 2.1", desc: "Global Dynamic Motion" },
    { icon: googleIcon, name: "GEMINI 1.5 PRO", desc: "Advanced Multimodal Logic" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % models.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [models.length]);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      padding: '60px 0'
    }}>
      <DotMatrixDisplay 
        iconUrl={models[index].icon} 
        title={models[index].name} 
        description={models[index].desc}
        width={80}
        height={40}
        dotSize={6}
        gap={4}
      />
    </div>
  );
}

// Workflow diagram for hero section (Image Input → Claude Vision → Response)
function HeroWorkflowDiagram() {
  return (
    <div
      style={{
        background: '#0d0d0d',
        borderRadius: 16,
        border: '1px solid #1a1a1a',
        padding: '32px 40px',
        minHeight: 320,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status indicator */}
      <div style={{
        position: 'absolute', top: 16, left: 20,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>RUNNING WORKFLOW</span>
      </div>

      {/* Node 1: Image Input */}
      <div style={{
        position: 'absolute', top: 80, left: 40,
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10,
        padding: '14px 18px', minWidth: 140,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: '#1e3a5f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#60a5fa'
          }}>1</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Image Input</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec4899' }} />
            <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>IMAGE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
            <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>PROMPT</span>
          </div>
        </div>
      </div>

      {/* Node 2: Claude Vision */}
      <div style={{
        position: 'absolute', top: 140, left: 200,
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10,
        padding: '14px 18px', minWidth: 140,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: '#1e3a5f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#60a5fa'
          }}>2</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Claude Vision</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
            <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>SYSTEM PROMPT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }} />
            <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>OUTPUT</span>
          </div>
        </div>
      </div>

      {/* Node 3: Response */}
      <div style={{
        position: 'absolute', top: 100, right: 40,
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10,
        padding: '14px 18px', minWidth: 120,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: '#1e3a5f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#60a5fa'
          }}>3</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Response</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>OUTPUT</span>
        </div>
      </div>

      {/* Connection lines (SVG) */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Image Input -> Claude Vision */}
        <path d="M 180 115 C 190 115, 190 175, 200 175" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.6" />
        {/* Claude Vision -> Response */}
        <path d="M 340 195 C 360 195, 360 135, 380 135" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}

// Stat card component
function StatCard({ value, label }) {
  return (
    <div style={{
      background: '#141414',
      border: '1px solid #1a1a1a',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 4,
        letterSpacing: '-0.02em'
      }}>{value}</div>
      <div style={{
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>{label}</div>
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
  const [isGenerating, setIsGenerating] = useState(false);

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
            onClick={async () => {
              if (!aiPrompt.trim() || isGenerating) return;
              setIsGenerating(true);
              try {
                await onSelect('ai', aiPrompt, aiMode);
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={isGenerating}
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isGenerating && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(20,20,20,0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20,
          }}>
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #1e1e1e' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#a78bfa', borderRightColor: '#3b82f6', animation: 'wf-spin 0.9s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SparkleSmall color="#a78bfa" />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', marginBottom: 6 }}>Setting up workspace...</div>
              <div style={{ fontSize: 12, color: '#666' }}>Preparing a clean canvas</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: `wf-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <style>{`@keyframes wf-spin { to { transform: rotate(360deg); } } @keyframes wf-pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
          </div>
        )}

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
            onClick={async () => {
              setIsGenerating(true);
              try {
                await onSelect('scratch');
              } finally {
                setIsGenerating(false);
              }
            }}
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
            onClick={async () => {
              setIsGenerating(true);
              try {
                await onSelect('template');
              } finally {
                setIsGenerating(false);
              }
            }}
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

// Custom hook for window size to handle responsiveness
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function DesktopNavbar({ onNavigate }) {
  const menuItems = ['Home', 'Platform', 'Engine', 'Showcase', 'Documentation'];
  const secondaryItems = ['Changelog', 'Community', 'Status'];

  return (
    <nav style={{
      position: 'fixed',
      top: 30,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      padding: '12px 32px',
      background: 'rgba(10, 10, 10, 0.4)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 100,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {menuItems.map(item => (
          <a 
            key={item} 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              if (item === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
              if (item === 'Platform' || item === 'Engine') {
                const el = document.getElementById('nodes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              textDecoration: 'none', 
              fontSize: 13, 
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            {item}
          </a>
        ))}
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(255, 255, 255, 0.1)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {secondaryItems.map(item => (
          <a 
            key={item} 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{ 
              color: 'rgba(255, 255, 255, 0.4)', 
              textDecoration: 'none', 
              fontSize: 12, 
              fontWeight: 400,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            {item}
          </a>
        ))}
      </div>

      <button 
        onClick={() => onNavigate?.('auth-login')}
        style={{
          marginLeft: 8,
          padding: '8px 20px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Log In
      </button>
    </nav>
  );
}

export default function LandingPage({ onCreateWorkflow, onDeleteWorkflows, workflows = [], onNavigate, isAuthenticated = false }) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedWfs, setSelectedWfs] = useState(new Set());
  const [templates, setTemplates] = useState([
    {
      id: 'template_1',
      name: 'Generate Prompt Ideas',
      desc: 'Upload an image or enter keywords to get a list of prompt ideas you can use to generate images in any style with Kora Imagen.',
      colors: ['#3b82f6', '#a78bfa', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#22c55e', '#f97316', '#a78bfa']
    }
  ]);
  const [isSelectingTemplates, setIsSelectingTemplates] = useState(false);
  const [selectedTpls, setSelectedTpls] = useState(new Set());
  const [showNewModal, setShowNewModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSelection = (id) => {
    setSelectedWfs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllWfs = () => {
    const activeWfs = workflows.filter(w => !w.deleted);
    if (selectedWfs.size === activeWfs.length && activeWfs.length > 0) {
      setSelectedWfs(new Set());
    } else {
      setSelectedWfs(new Set(activeWfs.map(w => w.id)));
    }
  };

  const handleDownloadSelected = () => {
    const selectedData = workflows.filter(w => selectedWfs.has(w.id));
    if (selectedData.length === 0) return;
    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflows_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsSelecting(false);
    setSelectedWfs(new Set());
  };

  const toggleTplSelection = (id) => {
    setSelectedTpls(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllTpls = () => {
    if (selectedTpls.size === templates.length && templates.length > 0) {
      setSelectedTpls(new Set());
    } else {
      setSelectedTpls(new Set(templates.map(t => t.id)));
    }
  };

  const handleDownloadSelectedTpls = () => {
    const selectedData = templates.filter(t => selectedTpls.has(t.id));
    if (selectedData.length === 0) return;
    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsSelectingTemplates(false);
    setSelectedTpls(new Set());
  };

  const handleDeleteSelectedTpls = () => {
    if (selectedTpls.size === 0) return;
    if (confirm(`Delete ${selectedTpls.size} templates?`)) {
      setTemplates(prev => prev.filter(t => !selectedTpls.has(t.id)));
      setIsSelectingTemplates(false);
      setSelectedTpls(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedWfs.size === 0) return;
    if (confirm(`Delete ${selectedWfs.size} workflows?`)) {
      if (onDeleteWorkflows) {
        await onDeleteWorkflows(Array.from(selectedWfs));
      }
      setIsSelecting(false);
      setSelectedWfs(new Set());
    }
  };

  const handleModalSelect = async (type, aiPrompt, aiMode) => {
    const name = `Workflow ${workflows.length + 1}`;
    if (type === 'ai') {
      await onCreateWorkflow(name, null, { type, aiPrompt, aiMode });
    } else {
      if (type === 'scratch') {
        await onCreateWorkflow(name, null, { type });
      } else if (type === 'template') {
        await onCreateWorkflow(name);
      }
    }
    setShowNewModal(false);
  };

  return (
    <div
      id="landing-scroll"
      className="landing-page"
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        color: '#fff',
        fontFamily: 'var(--font-body)',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {isMobile && (
        <MobileNavigation 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
        />
      )}

      {!isMobile && <DesktopNavbar onNavigate={onNavigate} />}


      {/* Fixed Burger Trigger - Only on Mobile */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: 'fixed',
            top: 40,
            right: 40,
            zIndex: 2000,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: 56,
            height: 56,
            borderRadius: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{
            width: 20,
            height: 2,
            background: '#fff',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none'
          }} />
          <div style={{
            width: 20,
            height: 2,
            background: '#fff',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none'
          }} />
        </button>
      )}

      {showNewModal && (
        <NewWorkflowModal
          onClose={() => setShowNewModal(false)}
          onSelect={handleModalSelect}
        />
      )}

      <div style={{ width: '100%', position: 'relative' }}>
        
        {/* Decorative background elements */}
        <div style={{
          position: 'fixed',
          top: '-10%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(94, 231, 223, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{
          position: 'fixed',
          bottom: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(180, 144, 245, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* HERO SECTION */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: 900, position: 'relative', zIndex: 10 }}>
            {/* Tagline */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 100,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: 32,
              animation: 'fadeInUp 0.6s ease-out both'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5ee7df' }}>New</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)' }}>Visual AI Programming is here</span>
            </div>

            <h1 style={{
              fontSize: 'min(5rem, 12vw)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.05,
              margin: '0 0 32px',
              letterSpacing: '-0.04em',
              animation: 'fadeInUp 0.8s ease-out 0.1s both'
            }}>
              <span style={{ 
                background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.4))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block'
              }}>
                Build AI Pipelines
              </span>
              <span style={{ color: '#fff' }}>
                <ScrambledHeroText 
                  phrases={["Visually.", "Seamlessly.", "Effortlessly."]} 
                  interval={4000}
                />
              </span>
            </h1>

            <p style={{
              fontSize: 'min(1.25rem, 5vw)',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 1.6,
              margin: '0 auto 48px',
              maxWidth: 620,
              fontWeight: 400,
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}>
              The elite node-based editor for professional AI workflows. Connect vision models, generators, and enhancers into sophisticated logic, then deploy as a live API.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: 20, 
              justifyContent: 'center',
              animation: 'fadeInUp 0.8s ease-out 0.3s both'
            }}>
              <button
                onClick={() => onNavigate?.('auth-signup')}
                style={{
                  padding: '16px 40px',
                  borderRadius: 100,
                  background: '#fff',
                  color: '#000',
                  fontSize: 16,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: '0 12px 32px rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.2)';
                }}
              >
                Get Started Free
              </button>

              <button
                onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  padding: '16px 32px',
                  borderRadius: 100,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div style={{
            marginTop: 80,
            width: '100%',
            maxWidth: 1100,
            padding: '0 24px',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            <HeroWorkflowDiagram />
          </div>
        </section>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* INTRO SECTION - Two column with stats */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 40px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 60,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left column - Text and stats */}
          <div style={{ maxWidth: 540 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#3b82f6'
              }} />
              <span style={{
                fontSize: 11,
                color: '#666',
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase'
              }}>
                Introducing Workflows
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '0 0 24px',
              letterSpacing: '-0.03em'
            }}>
              Introducing<br />
              <span style={{ color: '#666' }}>Workflows.</span>
            </h2>

            {/* Description */}
            <p style={{
              fontSize: 15,
              color: '#888',
              lineHeight: 1.7,
              margin: '0 0 32px',
            }}>
              Workflows are visual AI pipelines you build by connecting nodes on a canvas. Each node is one step in your feature: accept input, process it through AI models, and return the result. Build any AI-powered feature you can imagine, then deploy it as a live API endpoint. Use it in your own apps or sell it to clients. No code, no backend, no infrastructure.
            </p>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}>
              <StatCard value="20+" label="AI nodes available" />
              <StatCard value="6" label="Pre-built templates" />
              <StatCard value="H100" label="GPU infrastructure" />
              <StatCard value="1-click" label="API deployment" />
            </div>
          </div>

        </div>

        {/* BUILT FOR BUILDERS SECTION */}
        <div id="built-for-builders" style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '60px 40px',
          marginBottom: 100 
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '0 0 16px',
              letterSpacing: '-0.03em'
            }}>
              Built for <span style={{ color: '#666' }}>builders.</span>
            </h2>
            <p style={{
              fontSize: 15,
              color: '#888',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              You don&apos;t need to be a developer. If you have an idea for an AI-powered feature, you can build and ship it here.
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            marginBottom: 40
          }}>
            {/* Card 1: Creators & Agencies */}
            <div style={{
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              borderRadius: 16,
              padding: 24,
              position: 'relative'
            }}>
              {/* Number badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12
              }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(236, 72, 153, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#ec4899'
                }}>1</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#e0e0e0',
                  margin: 0
                }}>Creators & Agencies</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: '#888',
                lineHeight: 1.6,
                margin: '0 0 24px'
              }}>
                Build AI photo and video tools for your clients. Deploy as APIs and charge per call.
              </p>

              {/* Tags with connector lines */}
              <div style={{ position: 'relative', paddingTop: 8 }}>
                {/* Connector dot */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#ec4899'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '20%',
                  right: '20%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #ec4899 20%, #ec4899 80%, transparent)'
                }} />

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  paddingTop: 16
                }}>
                  {['E-commerce', 'Fashion', 'Content creation'].map((tag) => (
                    <span key={tag} style={{
                      padding: '6px 12px',
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: '#ec4899',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Indie Builders & Makers */}
            <div style={{
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              borderRadius: 16,
              padding: 24,
              position: 'relative'
            }}>
              {/* Number badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12
              }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#f59e0b'
                }}>2</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#e0e0e0',
                  margin: 0
                }}>Indie Builders & Makers</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: '#888',
                lineHeight: 1.6,
                margin: '0 0 24px'
              }}>
                Ship AI features without writing backend code. Plug a workflow into your app with a single API call.
              </p>

              {/* Tags with connector lines */}
              <div style={{ position: 'relative', paddingTop: 8 }}>
                {/* Connector dot */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#f59e0b'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '15%',
                  right: '15%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #f59e0b 15%, #f59e0b 85%, transparent)'
                }} />

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  paddingTop: 16
                }}>
                  {['SaaS products', 'MVPs', 'Side projects'].map((tag) => (
                    <span key={tag} style={{
                      padding: '6px 12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: '#f59e0b',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Teams Starting with AI */}
            <div style={{
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              borderRadius: 16,
              padding: 24,
              position: 'relative'
            }}>
              {/* Number badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12
              }}>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#3b82f6'
                }}>3</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#e0e0e0',
                  margin: 0
                }}>Teams Starting with AI</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: '#888',
                lineHeight: 1.6,
                margin: '0 0 24px'
              }}>
                Explore AI models visually. No ML expertise required. Experiment, find what works, and deploy it. Plug and play.
              </p>

              {/* Tags with connector lines */}
              <div style={{ position: 'relative', paddingTop: 8 }}>
                {/* Connector dot */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#3b82f6'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '20%',
                  right: '20%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #3b82f6 20%, #3b82f6 80%, transparent)'
                }} />

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  paddingTop: 16
                }}>
                  {['No-code teams', 'Plug & play', 'Visual builders'].map((tag) => (
                    <span key={tag} style={{
                      padding: '6px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: '#3b82f6',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowNewModal(true)}
              style={{
                background: '#3B3BFF',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 9999,
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(59, 59, 255, 0.4)',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(59, 59, 255, 0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(59, 59, 255, 0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start building <span style={{ fontSize: 14 }}>&rarr;</span>
            </button>
          </div>
        </div>

        {/* MODELS SECTION - Single Dynamic Skeumorphic Display */}
        <section id="models" style={{ 
          padding: '120px 20px', 
          background: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />

          <div style={{ 
            maxWidth: 1200, 
            margin: '0 auto', 
            padding: '100px 40px',
            position: 'relative', 
            zIndex: 1, 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: 60
          }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: 24,
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}>
                Unmatched <br />
                <span style={{ color: '#3b82f6' }}>Model Access.</span>
              </h2>
              <p style={{ color: '#888', fontSize: 18, maxWidth: 480, margin: 0, lineHeight: 1.6 }}>
                Our unified visual engine bridges the world's most powerful AI models into a single drag-and-drop workspace. One canvas, infinite possibilities.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ModelsDisplaySection />
            </div>
          </div>
        </section>

        {/* HOW TO SECTION - Describe your feature */}
        <div id="how-it-works" style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '60px 40px',
          marginBottom: 100 
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '0 0 16px',
              letterSpacing: '-0.03em'
            }}>
              Describe your feature.<br />
              <span style={{ color: '#666' }}>Get a workflow.</span>
            </h2>
            <p style={{
              fontSize: 15,
              color: '#888',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Tell our AI what feature you want to build (virtual try-on, image enhancement, content generation) and it creates the entire workflow for you. It picks the models, writes the system prompts, connects every node, and deploys your API.
            </p>
          </div>
        </div>


        {/* YOUR WORKFLOWS & TEMPLATES - Boxed Width (Logged in only) */}
        {isAuthenticated && (
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 40px',
          }}>
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
              <div style={{ display: 'flex', gap: 8 }}>
                {isSelecting ? (
                  <>
                    <button
                      onClick={handleSelectAllWfs}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedWfs.size === workflows.length && workflows.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={handleDownloadSelected}
                      disabled={selectedWfs.size === 0}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: selectedWfs.size === 0 ? '#666' : '#3b82f6',
                        cursor: selectedWfs.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Download ({selectedWfs.size})
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedWfs.size === 0}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: selectedWfs.size === 0 ? '#666' : '#ef4444',
                        cursor: selectedWfs.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => { setIsSelecting(false); setSelectedWfs(new Set()); }}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSelecting(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      Select Multiple
                    </button>
                    <button
                      onClick={() => setShowNewModal(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      + New
                    </button>
                  </>
                )}
              </div>
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
              {workflows.filter(w => !w.deleted).map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => isSelecting ? toggleSelection(wf.id) : onCreateWorkflow(wf.name, wf.id)}
                  style={{
                    background: '#141414',
                    border: `1px solid ${selectedWfs.has(wf.id) ? '#3b82f6' : '#2a2a2a'}`,
                    position: 'relative',
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
                    {isSelecting && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12, width: 16, height: 16,
                        borderRadius: 4, border: `1px solid ${selectedWfs.has(wf.id) ? '#3b82f6' : '#555'}`,
                        background: selectedWfs.has(wf.id) ? '#3b82f6' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {selectedWfs.has(wf.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    )}
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

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {isSelectingTemplates ? (
                  <>
                    <button
                      onClick={handleSelectAllTpls}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedTpls.size === templates.length && templates.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={handleDownloadSelectedTpls}
                      disabled={selectedTpls.size === 0}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: selectedTpls.size === 0 ? '#666' : '#3b82f6',
                        cursor: selectedTpls.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Download ({selectedTpls.size})
                    </button>
                    <button
                      onClick={handleDeleteSelectedTpls}
                      disabled={selectedTpls.size === 0}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: selectedTpls.size === 0 ? '#666' : '#ef4444',
                        cursor: selectedTpls.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => { setIsSelectingTemplates(false); setSelectedTpls(new Set()); }}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSelectingTemplates(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      Select Multiple
                    </button>
                    <button
                      onClick={() => setShowNewModal(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid #333', borderRadius: 6, color: '#ccc', cursor: 'pointer'
                      }}
                    >
                      + New
                    </button>
                  </>
                )}
              </div>

              {/* Template cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 16,
              }}>
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    style={{
                      background: '#141414',
                      border: `1px solid ${selectedTpls.has(tpl.id) ? '#3b82f6' : '#2a2a2a'}`,
                      borderRadius: 12,
                      padding: 24,
                      cursor: 'pointer',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                      position: 'relative',
                    }}
                    onClick={() => isSelectingTemplates ? toggleTplSelection(tpl.id) : onCreateWorkflow(tpl.name)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedTpls.has(tpl.id) ? '#3b82f6' : '#2a2a2a'; }}
                  >
                    {isSelectingTemplates && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12, width: 16, height: 16,
                        borderRadius: 4, border: `1px solid ${selectedTpls.has(tpl.id) ? '#3b82f6' : '#555'}`,
                        background: selectedTpls.has(tpl.id) ? '#3b82f6' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                      }}>
                        {selectedTpls.has(tpl.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    )}
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
                      {tpl.colors.map((color, idx) => (
                        <div key={idx} style={{ background: color, borderRadius: 4 }} />
                      ))}
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
                        {tpl.name}
                      </div>
                      <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5, margin: 0 }}>
                        {tpl.desc}
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
                ))}
              </div>
            </div>
          </div>
        )}

        <NodesSection />
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{
      width: '100%',
      background: '#0a0a0a',
      padding: '100px 40px 60px',
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 40,
      color: '#888'
    }}>
      {/* Top Part - Logo & HeroDecodeText */}
      <div style={{
        width: '100%',
        maxWidth: 1200,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 18,
          }}>N</div>
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}>Nodespace</span>
        </div>

        {/* HeroDecodeText area */}
        <div style={{
          textAlign: 'right'
        }}>
          <ScrambledHeroText 
            phrases={["BUILDING THE FUTURE.", "CONNECTING INTELLIGENCE.", "PIXELS INTO POSSIBILITIES."]}
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#444', 
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          />
        </div>
      </div>

      {/* Bottom Part - Copyright */}
      <div style={{
        width: '100%',
        maxWidth: 1200,
        paddingTop: 40,
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12
      }}>
        <div>
          &copy; {currentYear} Felix Seeger. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Nodes Section ────────────────────────────────────────────────────────────

function NodesSection() {
  return (
    <div id="nodes" style={{
      borderTop: '1px solid #1a1a1a',
      paddingTop: 80,
      marginTop: 20,
    }}>
      {/* The Nodes3DScroll component handles its own sticky container and scroll depth (500vh) */}
      <Nodes3DScroll />
    </div>
  );
}
