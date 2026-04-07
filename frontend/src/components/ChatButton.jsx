import { useEffect, useRef, useCallback } from 'react';
import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';

export default function ChatButton({ isOpen, onClick, unreadCount = 0 }) {
  const shaderContainerRef = useRef(null);
  const shaderInstanceRef = useRef(null);
  const buttonRef = useRef(null);

  // Initialise the liquid-metal shader once the DOM node is ready
  useEffect(() => {
    const el = shaderContainerRef.current;
    if (!el || shaderInstanceRef.current) return;

    shaderInstanceRef.current = new ShaderMount(
      el,
      liquidMetalFragmentShader,
      {
        u_repetition: 1.5,
        u_softness: 0.5,
        u_shiftRed: 0.3,
        u_shiftBlue: 0.3,
        u_distortion: 0,
        u_contour: 0,
        u_angle: 100,
        u_scale: 1.5,
        u_shape: 1,
        u_offsetX: 0.1,
        u_offsetY: -0.1,
      },
      undefined,
      0.6
    );

    return () => {
      if (shaderInstanceRef.current?.dispose) {
        shaderInstanceRef.current.dispose();
      }
      shaderInstanceRef.current = null;
    };
  }, []);

  /* ---- hover handlers for outline glow ---- */
  const handleMouseEnter = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    btn.classList.add('chat-btn--hover');
  }, []);

  const handleMouseLeave = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    btn.classList.remove('chat-btn--hover');
  }, []);

  return (
    <>
      {/* Scoped styles — injected once */}
      <style>{chatButtonStyles}</style>

      <button
        ref={buttonRef}
        className={`chat-btn${isOpen ? ' chat-btn--open' : ''}`}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Conic-gradient outline ring */}
        <span className="chat-btn__outline" />

        {/* Liquid-metal shader fill */}
        <span className="chat-btn__shader" ref={shaderContainerRef} />

        {/* Dark inner gradient disc (sits over the shader) */}
        <span className="chat-btn__inner" />

        {/* Icon */}
        <svg
          className="chat-btn__icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="chat-btn__badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Active indicator */}
        {isOpen && <span className="chat-btn__active" />}
      </button>
    </>
  );
}

/* ────────────────────────────────────────────────────
   Styles — kept as a template literal so the component
   stays self-contained without a separate CSS file.
   ──────────────────────────────────────────────────── */
const chatButtonStyles = `
  /* ---- button wrapper ---- */
  .chat-btn {
    position: absolute;
    right: 24px;
    bottom: 24px;
    z-index: 10;
    width: 56px;
    height: 56px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    transition: transform 0.25s ease;
    /* new stacking context */
    isolation: isolate;
  }

  .chat-btn:hover {
    transform: scale(1.06);
  }

  .chat-btn:active {
    transform: scale(0.97);
  }

  /* ---- conic outline ring ---- */
  .chat-btn__outline {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    z-index: 0;
  }

  .chat-btn__outline::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2.5px;
    border-radius: inherit;
    background: conic-gradient(from 180deg, #3b82f6, #a855f7, #ec4899, #a855f7, #3b82f6);
    filter: grayscale(1);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: filter 0.35s ease;
  }

  .chat-btn--hover .chat-btn__outline::before,
  .chat-btn--open .chat-btn__outline::before {
    filter: grayscale(0);
  }

  /* ---- shader canvas container ---- */
  .chat-btn__shader {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
    z-index: 1;
  }

  .chat-btn__shader canvas {
    width: 100% !important;
    height: 100% !important;
    border-radius: 50%;
    display: block;
  }

  /* ---- dark inner disc ---- */
  .chat-btn__inner {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: linear-gradient(145deg, #444, #000);
    box-shadow: inset 0 1px 2px 2px rgba(255, 255, 255, 0.12);
    z-index: 2;
    pointer-events: none;
  }

  /* ---- icon ---- */
  .chat-btn__icon {
    position: relative;
    z-index: 3;
    color: #bbb;
    transition: color 0.25s ease;
  }

  .chat-btn--hover .chat-btn__icon,
  .chat-btn--open .chat-btn__icon {
    color: #fff;
  }

  /* ---- unread badge ---- */
  .chat-btn__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ef4444;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #1a1a1a;
    z-index: 4;
  }

  /* ---- active dot ---- */
  .chat-btn__active {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #222;
    z-index: 4;
  }
`;
