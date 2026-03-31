import React, { useState } from 'react';

export default function TemplateBuilderModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  if (!isOpen) return null;

  const slides = [
    {
      number: '01',
      title: 'Compress your creative workspace',
      image: '/ref/save workflow 1-4.jpg'
    },
    {
      number: '02',
      title: 'Publish it as a Workflow Template',
      image: '/ref/save workflow 3-4.jpg'
    },
    {
      number: '03',
      title: 'Reuse it anywhere on the FS workspace canvas',
      image: '/ref/save workflow 4-4.jpg'
    },
    {
      number: '04',
      title: 'Share with others as a simple app',
      image: '/ref/save workflow_3-4.jpg'
    }
  ];

  return (
    <div className="tb-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
    }}>
      <div className="tb-modal" onClick={e => e.stopPropagation()} style={{
        background: '#1C1C1C', border: '1px solid #333', borderRadius: '16px',
        width: '460px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workflow Template Builder</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '0 0 12px 0' }}>Build a Workflow Template</h2>
          <p style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Define your workspace's inputs and outputs to package it as a reusable Workflow Template. Templates can be run as nodes on canvas, or via a simplified app interface.
          </p>
          <a href="#" style={{ fontSize: '13px', color: '#fff', textDecoration: 'underline', marginBottom: '24px' }}>What are Workflow Templates?</a>

          {/* Carousel Viewport */}
          <div style={{ width: '100%', aspectRatio: '16/10', background: '#111', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid #2a2a2a' }}>
            
            <div style={{ 
              display: 'flex', height: '100%', 
              transform: `translateX(-${currentSlide * 100}%)`, 
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' 
            }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ minWidth: '100%', height: '100%', position: 'relative', flexShrink: 0 }}>
                  <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* Overlay Gradient */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }} />
                  
                  {/* Slide Text */}
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#888', marginBottom: '4px' }}>{slide.number}</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{slide.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left/Right Buttons */}
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer', opacity: currentSlide === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
              disabled={currentSlide === totalSlides - 1}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer', opacity: currentSlide === totalSlides - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', marginBottom: '8px' }}>
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', padding: 0, border: 'none', 
                  background: currentSlide === i ? '#fff' : '#444', cursor: 'pointer', transition: 'background 0.2s' 
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 32px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button style={{ 
            width: '100%', background: '#22c55e', color: '#000', border: 'none', borderRadius: '8px', 
            padding: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' 
          }}>
            Start Building
          </button>
          <button onClick={onClose} style={{ 
            width: '100%', background: 'transparent', color: '#888', border: 'none', 
            padding: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' 
          }}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
