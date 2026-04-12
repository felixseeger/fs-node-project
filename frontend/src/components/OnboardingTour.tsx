import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'body',
    title: 'Welcome to FS Node Project!',
    content: 'This is a visual workspace for building AI pipelines. Let\'s take a quick tour to help you get started.',
    position: 'center'
  },
  {
    target: '.ms-main-toggle', // Targets the GooeyNodesMenu plus button
    title: 'Node Library',
    content: 'Click here to browse and add nodes to your canvas. You can find everything from AI generators to image filters.',
    position: 'top'
  },
  {
    target: '.react-flow__pane',
    title: 'Quick Add (Search)',
    content: 'Pro tip: Double-click anywhere on the canvas or press the Spacebar to quickly search and add nodes.',
    position: 'center'
  },
  {
    target: '.react-flow__handle',
    title: 'Smart Connections',
    content: 'Drag between colored dots to connect nodes. The colors indicate data types (e.g., pink for images, orange for text). Incompatible connections are blocked automatically.',
    position: 'center'
  },
  {
    target: '.recipes-btn',
    title: 'Prompt Recipes',
    content: 'Don\'t want to start from scratch? Click here to instantly load pre-built workflows for common AI tasks.',
    position: 'bottom'
  },
  {
    target: 'button[title="Run Workflow"]', // The Run button in CanvasRunToolbar
    title: 'Execute Workflows',
    content: 'Once your pipeline is connected, click Run to execute all nodes from left to right. You can also run individual nodes using the play button on the node header.',
    position: 'top'
  }
];

export default function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('fs_node_tour_completed');
    if (!hasSeenTour) {
      // Delay start to allow UI to render completely
      const timer = setTimeout(() => setIsActive(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const updateTargetRect = () => {
      const step = TOUR_STEPS[currentStep];
      if (step.target === 'body' || step.target === '.react-flow__pane' || step.target === '.react-flow__handle') {
        // Center position or fallback
        setTargetRect(null);
        return;
      }

      const el = document.querySelector(step.target);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsActive(false);
    localStorage.setItem('fs_node_tour_completed', 'true');
  };

  const handleRestart = () => {
    setIsActive(true);
    setCurrentStep(0);
    localStorage.removeItem('fs_node_tour_completed');
  };

  // Expose restart function to window for the Help menu
  useEffect(() => {
    (window as any).startOnboardingTour = handleRestart;
    return () => {
      delete (window as any).startOnboardingTour;
    };
  }, []);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isCenter = step.position === 'center' || !targetRect;

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10001,
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '24px',
    width: '320px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)',
    color: '#fff',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  };

  if (isCenter) {
    tooltipStyle.top = '50%';
    tooltipStyle.left = '50%';
    tooltipStyle.transform = 'translate(-50%, -50%)';
  } else if (targetRect) {
    const margin = 20;
    if (step.position === 'top') {
      tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
      tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 160;
    } else if (step.position === 'bottom') {
      tooltipStyle.top = targetRect.bottom + margin;
      tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 160;
    } else if (step.position === 'left') {
      tooltipStyle.right = window.innerWidth - targetRect.left + margin;
      tooltipStyle.top = targetRect.top + (targetRect.height / 2) - 100;
    } else if (step.position === 'right') {
      tooltipStyle.left = targetRect.right + margin;
      tooltipStyle.top = targetRect.top + (targetRect.height / 2) - 100;
    }

    // Keep within bounds
    if (tooltipStyle.left && parseInt(tooltipStyle.left as string) < 20) tooltipStyle.left = 20;
    if (tooltipStyle.right && parseInt(tooltipStyle.right as string) < 20) tooltipStyle.right = 20;
  }

  return createPortal(
    <>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: isCenter ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
          backdropFilter: isCenter ? 'blur(4px)' : 'none',
          zIndex: 10000,
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        }}
      />
      
      {targetRect && !isCenter && (
        <div 
          style={{
            position: 'fixed',
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      <div style={tooltipStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>{step.title}</h3>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 500, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 12 }}>
            {currentStep + 1} of {TOUR_STEPS.length}
          </span>
        </div>
        
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.6, color: '#ccc' }}>
          {step.content}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '6px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            Skip Tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(p => p - 1)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                }}
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              style={{
                background: '#3b82f6',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
              }}
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
