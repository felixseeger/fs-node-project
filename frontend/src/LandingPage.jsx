import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DecodeTextButton from './components/DecodeTextButton';
import ScrambledHeroText from './components/ScrambledHeroText';
import DotMatrixDisplay from './components/DotMatrixDisplay';
import MobileNavigation from './components/MobileNavigation';
import Nodes3DScroll from './components/Nodes3DScroll';
import ThemeToggle from './components/ThemeToggle';
import heroWorkflowImg from './assets/workflows/try-on_workflow_img.png';
import './LandingPage.css';

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

// ─── Hero Workflow Diagram ───────────────────────────────────────────────────

function HeroWorkflowDiagram() {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        padding: '32px 40px',
        minHeight: 320,
        width: '100%',
        maxWidth: 1100,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Background patterns */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      {/* Status indicator */}
      <div style={{
        position: 'absolute', top: 16, left: 20,
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 2,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
        <span style={{ fontSize: 11, color: 'var(--color-text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>RUNNING WORKFLOW</span>
      </div>

      {/* Node 1: Image Input */}
      <div style={{
        position: 'absolute', top: 80, left: '8%',
        background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: 10,
        padding: '14px 18px', minWidth: 140, zIndex: 2,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: 'var(--color-accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'var(--color-accent)'
          }}>1</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Image Input</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-pink)' }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>IMAGE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-amber)' }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>PROMPT</span>
          </div>
        </div>
      </div>

      {/* Node 2: Claude Vision */}
      <div style={{
        position: 'absolute', top: 140, left: '40%',
        background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: 10,
        padding: '14px 18px', minWidth: 140, zIndex: 2,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: 'var(--color-accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'var(--color-accent)'
          }}>2</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Claude Vision</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-amber)' }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>SYSTEM PROMPT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-purple)' }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>OUTPUT</span>
          </div>
        </div>
      </div>

      {/* Node 3: Response */}
      <div style={{
        position: 'absolute', top: 100, right: '8%',
        background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: 10,
        padding: '14px 18px', minWidth: 120, zIndex: 2,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: 'var(--color-accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'var(--color-accent)'
          }}>3</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Response</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
          <span style={{ fontSize: 10, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>OUTPUT</span>
        </div>
      </div>

      {/* Connection lines (SVG) */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-brand-pink)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-brand-purple)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Image Input -> Claude Vision */}
        <path d="M 180 115 C 240 115, 240 175, 430 175" stroke="var(--color-brand-pink)" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Claude Vision -> Response */}
        <path d="M 570 195 C 620 195, 620 135, 760 135" stroke="var(--color-brand-purple)" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="40" to="0" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

// ─── How it works Workflow Demo ───────────────────────────────────────────────

function HowToWorkflowDemo() {
  return (
    <div style={{
      background: 'var(--color-input)',
      border: '1px solid var(--color-border)',
      borderRadius: 20,
      padding: 32,
      maxWidth: 1000,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            boxShadow: '0 0 8px var(--color-accent)'
          }} />
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-dim)',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>VIBE-NODING</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: 'var(--color-accent-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: 9999
        }}>
          <span style={{ fontSize: 12, color: 'var(--color-success)' }}>&#10003;</span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--color-success)'
          }}>Workflow ready</span>
        </div>
      </div>

      {/* Prompt Input */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 32,
        fontSize: 14,
        color: 'var(--color-text)',
        lineHeight: 1.6,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span style={{ fontSize: 20 }}>🪄</span>
        <span>Build me a virtual try-on feature. Users upload a clothing photo and a model photo, and the workflow generates a realistic try-on image.</span>
      </div>

      {/* Workflow Diagram */}
      <div style={{
        position: 'relative',
        height: 280,
        marginBottom: 24,
        padding: '20px 0'
      }}>
        {/* Connection Lines SVG */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          {/* Detailed connecting paths with colors */}
          <path d="M 180 70 Q 230 70 250 70" stroke="var(--color-accent)" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 180 190 Q 230 190 250 190" stroke="var(--color-accent)" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 410 70 Q 460 70 480 100" stroke="var(--color-brand-purple)" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 410 190 Q 460 190 480 160" stroke="var(--color-brand-purple)" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 640 130 Q 690 130 720 130" stroke="var(--color-brand-pink)" strokeWidth="2" fill="none" opacity="0.6" />
          
          {/* Animating dots */}
          <circle r="3" fill="var(--color-accent)">
            <animateMotion path="M 180 70 Q 230 70 250 70" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="var(--color-accent)">
            <animateMotion path="M 180 190 Q 230 190 250 190" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Node cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', gap: 80, position: 'absolute', top: 0, left: 0 }}>
             <NodeMini label="Clothing Input" id="1" color="var(--color-accent)" top={0} left={0} />
             <NodeMini label="Claude Vision" id="3" color="var(--color-brand-purple)" top={0} left={250} />
             <NodeMini label="Nano Banana" id="5" color="var(--color-brand-pink)" top={60} left={480} />
             <NodeMini label="Response" id="6" color="var(--color-success)" top={70} left={720} />
          </div>
          {/* Column 2 */}
          <div style={{ display: 'flex', gap: 100, position: 'absolute', top: 120, left: 0 }}>
             <NodeMini label="Model Input" id="2" color="var(--color-accent)" top={0} left={0} />
             <NodeMini label="Claude Haiku" id="4" color="var(--color-brand-purple)" top={0} left={250} />
          </div>
        </div>
      </div>

      {/* Footer info bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        borderTop: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-success)', marginRight: 4 }}>&#10003;</span> 6 nodes
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-success)', marginRight: 4 }}>&#10003;</span> 5 connections
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-success)', marginRight: 4 }}>&#10003;</span> API generated
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-dim)', fontStyle: 'italic' }}>
          "Deployed to nodespace.ai/api/try-on"
        </div>
      </div>
    </div>
  );
}

function NodeMini({ label, id, color, top, left }) {
  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      width: 160,
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '12px 14px',
      borderLeft: `3px solid ${color}`,
      boxShadow: 'var(--shadow-sm)',
      zIndex: 5
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 4, background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color
        }}>{id}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
          <div style={{ width: 30, height: 4, borderRadius: 2, background: 'var(--color-border)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
          <div style={{ width: 20, height: 4, borderRadius: 2, background: 'var(--color-border)' }} />
        </div>
      </div>
    </div>
  );
}

// Workflow diagram for hero section (Image Input → Claude Vision → Response)

// Stat card component
function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--color-text)',
        marginBottom: 4,
        letterSpacing: '-0.02em'
      }}>{value}</div>
      <div style={{
        fontSize: 12,
        color: 'var(--color-text-dim)',
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
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="var(--color-accent)" />
      <path d="M18 14L18.75 16.25L21 17L18.75 17.75L18 20L17.25 17.75L15 17L17.25 16.25L18 14Z" fill="var(--color-accent)" opacity="0.7" />
    </svg>
  );
}

// Plus icon
function PlusIcon() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, color: 'var(--color-accent)',
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
      background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="var(--color-accent)" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="var(--color-accent)" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="var(--color-accent)" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="var(--color-accent)" />
      </svg>
    </div>
  );
}

// Small sparkle for button
function SparkleSmall({ color = 'var(--color-text)' }) {
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
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
        <div 
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-overlay)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }} 
        />
        
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
        }}>
          <div style={{ padding: 32 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 24 
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>New Workflow</h2>
              <button 
                onClick={onClose}
                style={{
                  background: 'var(--color-surface-hover)',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ 
                fontSize: 11, 
                color: 'var(--color-text-muted)', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: 1,
                marginBottom: 12,
                paddingLeft: 4
              }}>Create with AI</div>
              
              <div style={{ 
                background: 'var(--color-input)', 
                borderRadius: 20, 
                padding: 16,
                border: '1px solid var(--color-border-subtle)'
              }}>
                <textarea 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="I want to build a virtual try-on feature..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text)',
                    fontSize: 14,
                    resize: 'none',
                    height: 80,
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: 1.5
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: 8
                }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                      onClick={() => setAiMode('fast')}
                      style={{
                        padding: '6px 12px',
                        background: aiMode === 'fast' ? 'var(--color-surface-active)' : 'transparent',
                        border: '1px solid var(--color-border)',
                        borderRadius: 100,
                        fontSize: 11,
                        color: aiMode === 'fast' ? 'var(--color-text)' : 'var(--color-text-dim)',
                        cursor: 'pointer'
                      }}
                    >Fast</button>
                    <button 
                      onClick={() => setAiMode('creative')}
                      style={{
                        padding: '6px 12px',
                        background: aiMode === 'creative' ? 'var(--color-surface-active)' : 'transparent',
                        border: '1px solid var(--color-border)',
                        borderRadius: 100,
                        fontSize: 11,
                        color: aiMode === 'creative' ? 'var(--color-text)' : 'var(--color-text-dim)',
                        cursor: 'pointer'
                      }}
                    >Creative</button>
                  </div>

                  <button 
                    onClick={() => onSelect('ai', aiPrompt, aiMode)}
                    disabled={!aiPrompt.trim()}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: aiPrompt.trim() ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                      border: 'none',
                      color: aiPrompt.trim() ? 'var(--color-white)' : 'var(--color-text-dim)',
                      cursor: aiPrompt.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      transition: 'all 0.2s'
                    }}
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '20px 32px', 
            background: 'var(--color-surface-hover)', 
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>Press <kbd style={{ background: 'var(--color-surface)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--color-border)' }}>&crarr;</kbd> to generate</span>
            <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600, cursor: 'pointer' }}>View Examples</span>
          </div>
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
        background: 'var(--color-overlay)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
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
            background: 'var(--color-surface)',
            backdropFilter: 'blur(4px)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20,
          }}>
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRightColor: 'var(--color-accent)', animation: 'wf-spin 0.9s linear infinite' }} />
              <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SparkleSmall color="var(--color-accent)" />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>Setting up workspace...</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Preparing a clean canvas</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', animation: `wf-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <style>{`@keyframes wf-spin { to { transform: rotate(360deg); } } @keyframes wf-pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
          </div>
        )}

        <h2 style={{
          fontSize: 22, fontWeight: 700, color: 'var(--color-text)',
          textAlign: 'center', margin: '0 0 8px',
        }}>
          How do you want to start?
        </h2>
        <p style={{
          fontSize: 14, color: 'var(--color-text-dim)',
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
            background: hovered === 'ai' ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            border: '1px solid var(--color-accent)',
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
            background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          }} />
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <SparkleIcon />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>
              Generate with AI
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-dim)', lineHeight: 1.4 }}>
              Describe what you want and <span style={{
                display: 'inline-block', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-dim)',
              }}>AI</span> will build the workflow
            </div>
          </div>
        </button>

        {/* Bottom row: From Scratch + Pick a Template */}
        <div style={{ 
          background: 'var(--color-input)', 
          borderRadius: 16, 
          padding: 6,
          border: '1px solid var(--color-border-subtle)'
        }}>
          <NewWorkflowItem
            dataTestId="blank-canvas-btn"
            title="Visual Editor"
            desc="Start from a blank canvas and build node by node"
            icon="+"
            onClick={() => onSelect('scratch')}
          />          <div style={{ height: 1, background: 'var(--color-border-subtle)', margin: '0 16px' }} />
          <NewWorkflowItem 
            title="Browse Templates"
            desc="Choose from our library of pre-built pipelines"
            icon="&boxplus;"
            onClick={() => onSelect('template')}
          />
        </div>
      </div>
    </div>
  );
}

function NewWorkflowItem({ title, desc, icon, onClick, dataTestId }) {
  return (
    <button
      data-testid={dataTestId}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--color-accent-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: 'var(--color-accent)',
        flexShrink: 0,
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-dim)', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-text-faint)', opacity: 0.5 }}>&rsaquo;</div>
    </button>
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

// ScrollDownIndicator Component
function ScrollDownIndicator() {
  const scrollToNext = () => {
    const el = document.getElementById('intro-section');
    if (!el) return;
    const container = document.getElementById('landing-scroll');
    if (container) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      container.scrollTo({ top, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={scrollToNext}
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        zIndex: 20,
        opacity: 0.6,
        transition: 'opacity 0.3s'
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
    >
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--color-text-dim)' }}>
        <ScrambledHeroText phrases={["SCROLL DOWN", "DISCOVER MORE", "EXPLORE NOW"]} interval={3000} />
      </div>
      <div style={{ animation: 'pulse-y 2s ease-in-out infinite', color: 'var(--color-accent)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="4" x2="12" y2="20"></line>
          <polyline points="18 14 12 20 6 14"></polyline>
        </svg>
      </div>
    </div>
  );
}

function DesktopNavbar({ onNavigate, theme, setTheme }) {
  const primaryLinks = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Builders', id: 'built-for-builders' },
    { label: 'Models', id: 'models' },
    { label: 'Nodes', id: 'nodes' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const container = document.getElementById('landing-scroll');
    if (container) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      container.scrollTo({ top, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="desktop-nav">

      <div className="desktop-nav-links">
        {primaryLinks.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="desktop-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <button
          className="desktop-nav-login"
          title="Log in"
          onClick={() => onNavigate?.('auth-login')}
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <g style={{ animation: 'pulse-x 1.5s ease-in-out infinite' }}>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </g>
          </svg>
          Log in
        </button>
        <div style={{ marginLeft: 8, paddingLeft: 8, borderLeft: '1px solid var(--color-border)' }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
}

export default function LandingPage({ onCreateWorkflow, onDeleteWorkflows, workflows = [], onNavigate, isAuthenticated = false, theme, setTheme }) {
  const { width } = useWindowSize();
  const isMobile = width <= 1024;

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
    const getNextBoardName = () => {
      const boards = workflows.filter(w => (w.name || w.title || '').startsWith('Board '));
      let maxNum = 0;
      boards.forEach(b => {
        const match = (b.name || b.title).match(/Board (\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxNum) maxNum = num;
        }
      });
      return `Board ${(maxNum + 1).toString().padStart(2, '0')}`;
    };

    const name = getNextBoardName();
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
    <div id="landing-scroll" className="landing-page">
      {isMobile && (
        <MobileNavigation 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
          onNavigate={onNavigate}
        />
      )}

      {!isMobile && <DesktopNavbar onNavigate={onNavigate} theme={theme} setTheme={setTheme} />}


      {/* Fixed Burger / Close Trigger — Mobile Only, always on top */}
      {isMobile && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`mobile-hamburger ${menuOpen ? 'mobile-hamburger-open' : 'mobile-hamburger-closed'}`}
            style={{ position: 'relative', top: 'auto', right: 'auto', margin: 0 }}
          >
          {/* Top bar */}
          <span 
            className="hamburger-line"
            style={{
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
            }} 
          />
          {/* Middle bar */}
          <span 
            className="hamburger-line"
            style={{
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'none',
            }} 
          />
          {/* Bottom bar */}
          <span 
            className="hamburger-line"
            style={{
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
            }} 
          />
        </button>
      </div>
      )}

      {showNewModal && (
        <NewWorkflowModal
          onClose={() => setShowNewModal(false)}
          onSelect={handleModalSelect}
        />
      )}

      <div style={{ width: '100%', position: 'relative' }}>
        
        {/* Decorative background elements */}
        <div className="bg-glow-top" />
        <div className="bg-glow-bottom" />

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
              background: 'var(--color-surface)',
              backdropFilter: 'blur(10px)',
              borderRadius: 100,
              border: '1px solid var(--color-border)',
              marginBottom: 32,
              animation: 'fadeInUp 0.6s ease-out both'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>New</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-dim)' }}>Visual AI Programming is here</span>
            </div>

            <h1 style={{
              fontSize: 'min(5rem, 12vw)',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.05,
              margin: '0 0 32px',
              letterSpacing: '-0.04em',
              animation: 'fadeInUp 0.8s ease-out 0.1s both'
            }}>
              <span style={{ 
                background: 'linear-gradient(to bottom, var(--color-text) 40%, var(--color-text-dim))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block'
              }}>
                Build AI Pipelines
              </span>
              <span style={{ color: 'var(--color-text)' }}>
                <ScrambledHeroText 
                  phrases={["Visually.", "Seamlessly.", "Effortlessly."]} 
                  interval={4000}
                />
              </span>
            </h1>

            <p style={{
              fontSize: 'min(1.25rem, 5vw)',
              color: 'var(--color-text-dim)',
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
                  background: 'var(--color-text)',
                  color: 'var(--color-bg)',
                  fontSize: 16,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: 'var(--shadow-default)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-default)';
                }}
              >
                Get Started Free
              </button>

              <button
                onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  padding: '16px 32px',
                  borderRadius: 100,
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--color-text)',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--color-text-faint)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                Watch Demo
              </button>
            </div>
          </div>

          <ScrollDownIndicator />

        </section>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* INTRO SECTION - Two column with stats */}
        <div id="intro-section" style={{
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
                width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)'
              }} />
              <span style={{
                fontSize: 11,
                color: 'var(--color-text-muted)',
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
              color: 'var(--color-text)',
              lineHeight: 1.1,
              margin: '0 0 24px',
              letterSpacing: '-0.03em'
            }}>
              Introducing<br />
              <span style={{ color: 'var(--color-text-muted)' }}>Workflows.</span>
            </h2>

            {/* Description */}
            <p style={{
              fontSize: 15,
              color: 'var(--color-text-dim)',
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

          {/* Right column - Graphic */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            animation: 'fadeInUp 1s ease-out 0.4s both',
            position: 'relative',
            zIndex: 2,
            transform: 'scale(1.15)',
            transformOrigin: 'center'
          }}>
            <HeroWorkflowDiagram />
          </div>
        </div>

        {/* HOW TO SECTION - Describe your feature */}
        <div id="how-it-works" style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '60px 40px',
          marginBottom: 100 
        }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.1,
              margin: '0 0 16px',
              letterSpacing: '-0.03em'
            }}>
              Describe your feature.<br />
              <span style={{ color: 'var(--color-text-dim)' }}>Get a workflow.</span>
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--color-text-dim)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Tell our AI what feature you want to build (virtual try-on, image enhancement, content generation) and it creates the entire workflow for you. It picks the models, writes the system prompts, connects every node, and deploys your API.
            </p>
          </div>

          <HowToWorkflowDemo />

          <div style={{ marginTop: 80 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
              justifyContent: 'center'
            }}>
              <div style={{ height: 1, flex: 1, background: 'var(--color-border)' }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Scalable Infrastructure
              </h2>
              <div style={{ height: 1, flex: 1, background: 'var(--color-border)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 20,
            }}>
              <div
                style={{
                  background: 'var(--color-input)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14,
                  padding: 28,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 20,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: 'var(--color-text-dim)',
                  borderLeft: '3px solid var(--color-accent)',
                }}>
                  <div><span style={{ color: 'var(--color-brand-purple)' }}>const</span> <span style={{ color: 'var(--color-text)' }}>result</span> = <span style={{ color: 'var(--color-brand-purple)' }}>await</span> kora.<span style={{ color: 'var(--color-accent)' }}>run</span>({'{'}</div>
                  <div style={{ paddingLeft: 16 }}><span style={{ color: 'var(--color-success)' }}>workflow</span>: <span style={{ color: 'var(--color-warning)' }}>'img-pipeline'</span>,</div>
                  <div style={{ paddingLeft: 16 }}><span style={{ color: 'var(--color-success)' }}>input</span>: <span style={{ color: 'var(--color-warning)' }}>'./photo.png'</span></div>
                  <div>{'}'});</div>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                  API-First Workflows
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-dim)', lineHeight: 1.55, margin: 0 }}>
                  Every workflow is an API endpoint. Deploy in one click and integrate into any app with our SDK.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--color-input)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14,
                  padding: 28,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-purple)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 20,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.7,
                  borderLeft: '3px solid #a78bfa',
                }}>
                  <div><span style={{ color: 'var(--color-text-muted)' }}>$</span> <span style={{ color: 'var(--color-success)' }}>npx</span> <span style={{ color: 'var(--color-text)' }}>kora</span> code-workflow</div>
                  <div><span style={{ color: 'var(--color-text-muted)' }}>$</span> <span style={{ color: 'var(--color-success)' }}>npx</span> <span style={{ color: 'var(--color-text)' }}>kora</span> deploy --env prod</div>
                  <div><span style={{ color: 'var(--color-success)' }}>✓</span> <span style={{ color: 'var(--color-text)' }}>Deployed to</span> <span style={{ color: 'var(--color-accent)' }}>nodespace.ai/wf/abc...</span></div>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                  CLI & Local Dev
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-dim)', lineHeight: 1.55, margin: 0 }}>
                  Manage, test, and deploy workflows from the terminal. CI/CD ready with environment variables.
                </p>
              </div>
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
              color: 'var(--color-text)',
              lineHeight: 1.1,
              margin: '0 0 16px',
              letterSpacing: '-0.03em'
            }}>
              Built for <span style={{ color: 'var(--color-text-muted)' }}>builders.</span>
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--color-text-dim)',
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
              background: 'var(--color-input)',
              border: '1px solid var(--color-border)',
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
                  background: 'var(--color-brand-pink-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-brand-pink)'
                }}>1</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0
                }}>Creators & Agencies</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: 'var(--color-text-dim)',
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
                  background: 'var(--color-brand-pink)'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '20%',
                  right: '20%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--color-brand-pink) 20%, var(--color-brand-pink) 80%, transparent)'
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
                      background: 'var(--color-brand-pink-soft)',
                      border: '1px solid var(--color-brand-pink-subtle)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: 'var(--color-brand-pink)',
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
              background: 'var(--color-input)',
              border: '1px solid var(--color-border)',
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
                  background: 'var(--color-brand-amber-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-brand-amber)'
                }}>2</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0
                }}>Indie Builders & Makers</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: 'var(--color-text-dim)',
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
                  background: 'var(--color-brand-amber)'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '15%',
                  right: '15%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--color-brand-amber) 15%, var(--color-brand-amber) 85%, transparent)'
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
                      background: 'var(--color-brand-amber-soft)',
                      border: '1px solid var(--color-brand-amber-subtle)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: 'var(--color-brand-amber)',
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
              background: 'var(--color-input)',
              border: '1px solid var(--color-border)',
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
                  background: 'var(--color-accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-accent)'
                }}>3</span>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0
                }}>Teams Starting with AI</h3>
              </div>

              <p style={{
                fontSize: 13,
                color: 'var(--color-text-dim)',
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
                  background: 'var(--color-brand-blue)'
                }} />
                {/* Connector line */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: '20%',
                  right: '20%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--color-brand-blue) 20%, var(--color-brand-blue) 80%, transparent)'
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
                      background: 'var(--color-brand-blue-soft)',
                      border: '1px solid var(--color-brand-blue-subtle)',
                      borderRadius: 9999,
                      fontSize: 11,
                      color: 'var(--color-brand-blue)',
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
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 9999,
                cursor: 'pointer',
                boxShadow: '0 0 24px var(--color-accent-soft)',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px var(--color-accent-soft)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px var(--color-accent-soft)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start building <span style={{ fontSize: 14 }}>&rarr;</span>
            </button>
          </div>
        </div>

        {/* MODELS SECTION - Single Dynamic Skeumorphic Display */}
        <section id="models" style={{ 
          padding: '120px 20px', 
          background: 'var(--color-bg-alt)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
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
            background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 60%)',
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
                color: 'var(--color-text)',
                marginBottom: 24,
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}>
                Unmatched <br />
                <span style={{ color: 'var(--color-accent)' }}>Model Access.</span>
              </h2>
              <p style={{ color: 'var(--color-text-dim)', fontSize: 18, maxWidth: 480, margin: 0, lineHeight: 1.6 }}>
                Our unified visual engine bridges the world's most powerful AI models into a single drag-and-drop workspace. One canvas, infinite possibilities.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ModelsDisplaySection />
            </div>
          </div>
        </section>



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
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                Your Workflows
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {isSelecting ? (
                  <>
                    <button
                      onClick={handleSelectAllWfs}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)',
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: selectedWfs.size === 0 ? 'var(--color-text-faint)' : 'var(--color-accent)',
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: selectedWfs.size === 0 ? 'var(--color-text-faint)' : 'var(--color-danger)',
                        cursor: selectedWfs.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => { setIsSelecting(false); setSelectedWfs(new Set()); }}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
                      }}
                    >
                      Select Multiple
                    </button>
                    <button
                      onClick={() => setShowNewModal(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
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
                  background: 'var(--color-input)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: 'var(--color-text-dim)',
                    marginBottom: 4,
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                  New Workflow
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Build a custom AI image pipeline
                </span>
              </div>

              {/* Existing workflow cards */}
              {workflows.filter(w => !w.deleted).map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => isSelecting ? toggleSelection(wf.id) : onCreateWorkflow(wf.name, wf.id)}
                  style={{
                    background: 'var(--color-input)',
                    border: `1px solid ${selectedWfs.has(wf.id) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    position: 'relative',
                    borderRadius: 12,
                    padding: 24,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWfs.has(wf.id) ? 'var(--color-accent)' : 'var(--color-border)'; }}
                >
                  {/* Mini preview */}
                  <div
                    style={{
                      background: 'var(--color-bg)',
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
                        borderRadius: 4, border: `1px solid ${selectedWfs.has(wf.id) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: selectedWfs.has(wf.id) ? 'var(--color-accent)' : 'transparent',
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
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                    {wf.name}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
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
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                  Templates
                </h2>
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 1 }}>&rsaquo;</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {isSelectingTemplates ? (
                  <>
                    <button
                      onClick={handleSelectAllTpls}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)',
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: selectedTpls.size === 0 ? 'var(--color-text-faint)' : 'var(--color-accent)',
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: selectedTpls.size === 0 ? 'var(--color-text-muted)' : 'var(--color-danger)',
                        cursor: selectedTpls.size === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => { setIsSelectingTemplates(false); setSelectedTpls(new Set()); }}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
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
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
                      }}
                    >
                      Select Multiple
                    </button>
                    <button
                      onClick={() => setShowNewModal(true)}
                      style={{
                        padding: '6px 16px', fontSize: 12, background: 'transparent',
                        border: '1px solid var(--color-border)', borderRadius: 6, color: 'var(--color-text-dim)', cursor: 'pointer'
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
                      background: 'var(--color-input)',
                      border: `1px solid ${selectedTpls.has(tpl.id) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      borderRadius: 12,
                      padding: 24,
                      cursor: 'pointer',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                      position: 'relative',
                    }}
                    onClick={() => isSelectingTemplates ? toggleTplSelection(tpl.id) : onCreateWorkflow(tpl.name)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedTpls.has(tpl.id) ? 'var(--color-accent)' : 'var(--color-border)'; }}
                  >
                    {isSelectingTemplates && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12, width: 16, height: 16,
                        borderRadius: 4, border: `1px solid ${selectedTpls.has(tpl.id) ? 'var(--color-accent)' : 'var(--color-text-muted)'}`,
                        background: selectedTpls.has(tpl.id) ? 'var(--color-accent)' : 'transparent',
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
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
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
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
                        {tpl.name}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', lineHeight: 1.5, margin: 0 }}>
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
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      flexShrink: 0,
                      color: 'var(--color-text-dim)',
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
        <Footer />
      </div>
    </div>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{
      width: '100%',
      background: 'var(--color-bg)',
      padding: '100px 40px 60px',
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 40,
      color: 'var(--color-text-dim)'
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
          <img src="/logo-light.svg" alt="Logo" style={{ height: 32, width: 'auto' }} />
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text)',
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
              color: 'var(--color-text-dim)', 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.8
            }}
          />
        </div>
      </div>

      {/* Bottom Part - Copyright */}
      <div style={{
        width: '100%',
        maxWidth: 1200,
        paddingTop: 40,
        borderTop: '1px solid var(--color-border)',
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
      borderTop: '1px solid var(--color-border)',
      paddingTop: 80,
      marginTop: 20,
    }}>
      {/* The Nodes3DScroll component handles its own sticky container and scroll depth (500vh) */}
      <Nodes3DScroll />
    </div>
  );
}
