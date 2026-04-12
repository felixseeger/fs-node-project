import React, { useState, useEffect, useRef } from 'react';

export interface GuideStep {
  targetSelector?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const DEFAULT_STEPS: GuideStep[] = [
  {
    title: 'Welcome to FS Node Editor',
    content: 'Let\'s take a quick tour of the workspace. This is where you can build powerful AI pipelines by connecting different nodes together.',
    position: 'center'
  },
  {
    targetSelector: '.left-side-menu-trigger, .icon-sidebar',
    title: 'Add Nodes',
    content: 'Click here or press any shortcut key (like "T" for Text, "I" for Image) to add nodes to your canvas. You can also right-click anywhere on the canvas.',
    position: 'right'
  },
  {
    targetSelector: '.react-flow__pane',
    title: 'Connect the Dots',
    content: 'Every node has colored handles. Drag a line from an output handle to an input handle to pass data. Colors represent data types (e.g., orange for text, pink for images).',
    position: 'center'
  },
  {
    targetSelector: '.run-workflow-btn, button:contains("Run")',
    title: 'Run Workflow',
    content: 'Once your pipeline is wired up, click "Run" (or use Cmd+Enter) to execute it. The data will flow from left to right.',
    position: 'bottom'
  },
  {
    targetSelector: '.recipes-btn, .template-btn',
    title: 'Prompt Recipes',
    content: 'Don\'t want to start from scratch? Check out the Prompt Recipes gallery to instantly load pre-built workflows.',
    position: 'bottom'
  }
];

interface InteractiveStepGuideProps {
  steps?: GuideStep[];
  onComplete?: () => void;
  isOpen: boolean;
}

export default function InteractiveStepGuide({ 
  steps = DEFAULT_STEPS, 
  onComplete, 
  isOpen 
}: InteractiveStepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    
    const updatePosition = () => {
      if (step.targetSelector) {
        // Simple pseudo-selector support for text content (very basic)
        let el: Element | null = null;
        
        if (step.targetSelector.includes(':contains')) {
           const match = step.targetSelector.match(/(.*):contains\("([^"]+)"\)/);
           if (match) {
             const tag = match[1];
             const text = match[2];
             const elements = Array.from(document.querySelectorAll(tag));
             el = elements.find(e => e.textContent?.includes(text)) || null;
           }
        } else {
          el = document.querySelector(step.targetSelector);
        }

        if (el) {
          setTargetRect(el.getBoundingClientRect());
          return;
        }
      }
      setTargetRect(null);
    };

    updatePosition();

    // Re-calculate on resize or scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Also observe mutations in case the element appears dynamically
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer.disconnect();
    };
  }, [currentStep, steps, isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  // Calculate tooltip position
  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
  };

  if (targetRect && step.position !== 'center') {
    const spacing = 16;
    
    switch (step.position) {
      case 'bottom':
        tooltipStyle = {
          position: 'fixed',
          top: targetRect.bottom + spacing,
          left: targetRect.left + (targetRect.width / 2),
          transform: 'translateX(-50%)',
          zIndex: 9999,
        };
        break;
      case 'top':
        tooltipStyle = {
          position: 'fixed',
          top: targetRect.top - spacing,
          left: targetRect.left + (targetRect.width / 2),
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
        };
        break;
      case 'right':
        tooltipStyle = {
          position: 'fixed',
          top: targetRect.top + (targetRect.height / 2),
          left: targetRect.right + spacing,
          transform: 'translateY(-50%)',
          zIndex: 9999,
        };
        break;
      case 'left':
        tooltipStyle = {
          position: 'fixed',
          top: targetRect.top + (targetRect.height / 2),
          left: targetRect.left - spacing,
          transform: 'translate(-100%, -50%)',
          zIndex: 9999,
        };
        break;
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9998,
          pointerEvents: 'auto'
        }}
      />
      
      {/* Highlight cut-out (approximate) */}
      {targetRect && (
        <div style={{
          position: 'fixed',
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          borderRadius: '8px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          pointerEvents: 'none',
          transition: 'all 0.3s ease'
        }} />
      )}

      {/* Guide Card */}
      <div 
        className="modal-surface"
        style={{
          ...tooltipStyle,
          width: '320px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 600 }}>{step.title}</h4>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <p style={{ margin: '0 0 24px 0', color: '#a3a3a3', fontSize: '14px', lineHeight: '1.5' }}>
          {step.content}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={handleSkip}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#888', 
              cursor: 'pointer', 
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
          >
            Skip Tour
          </button>
          
          <button 
            onClick={handleNext}
            className="modal-btn modal-btn-primary"
            style={{ padding: '8px 20px' }}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
}
