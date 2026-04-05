import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import './SystemLoadingProcess.css';

gsap.registerPlugin(CustomEase);

// Guard against re-registration on hot-reload
if (!CustomEase.get('hop'))   CustomEase.create('hop',   '0.9, 0, 0.1, 1');
if (!CustomEase.get('glide')) CustomEase.create('glide', '0.8, 0, 0.2, 1');

// Default content configuration
const DEFAULT_CONFIG = {
  backdropTop: [
    ['ARC//117 Delta Trace', 'ARC//117 Delta Trace', 'ARC//117 Delta Trace', 'ARC//117 Delta Trace', 'ARC//117 Delta Trace'],
    ['Sector / Hollow Frame', '0.392 02SD 008923'],
    ['Material / Unknown Fiber', 'Status / Soft Resonance'],
    [':::..:::.::::..:::'],
  ],
  backdropBottom: [
    ['Surface Memory'],
    ['// / / ///// / / / ///'],
    ['Phase Offset > 17%'],
    ['Fragments Aligning', 'Pattern Emerging'],
    ['Collapse Pending', 'Return -- Layer Zero'],
    ['F-9'],
  ],
  title: 'Initiating',
  phases: [
    { label: 'Phase 01', value: 'Sequence' },
    { label: 'Signal Scan', value: '07 Layers' },
  ],
  code: 'PX-17',
  engageText: 'Engage',
  successText: 'Access Granted',
  logoSrc: '/logo-light.svg',
};

// Mask wrapper: overflow:hidden on parent, animated span is the direct child
function MaskLine({ innerRef, children }) {
  return (
    <span className="slp-mask">
      <span ref={innerRef} className="slp-line">{children}</span>
    </span>
  );
}

/**
 * SystemLoadingProcess - Cyberpunk/Sci-fi preloader animation
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback when preloader finishes
 * @param {boolean} props.autoStart - Whether to auto-start animation (default: true)
 * @param {Object} props.config - Custom content configuration
 * @param {string} props.theme - Theme variant: 'dark' | 'light' (default: 'dark')
 */
export default function SystemLoadingProcess({ 
  onComplete, 
  autoStart = true,
  config = {},
  theme = 'dark',
}) {
  const [ready, setReady] = useState(false);
  
  // Merge config with defaults
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const preloaderRef   = useRef(null);
  const revealerRef    = useRef(null);
  const btnRef         = useRef(null);
  const trackRef       = useRef(null);
  const progressRef    = useRef(null);
  const logoRef        = useRef(null);
  const labelLineRef   = useRef(null);
  const outroLineRef   = useRef(null);
  const readyRef       = useRef(false);
  const timelineRef    = useRef(null);
  // Collect the 6 row text lines (refs on the .slp-line spans directly)
  const rowLine        = useRef([]);

  const handleEngage = useCallback(() => {
    if (!readyRef.current) return;
    readyRef.current = false;

    const svgLen = trackRef.current?.getTotalLength() ?? 974;

    const exitTl = gsap.timeline({
      onComplete: () => {
        gsap.set(preloaderRef.current, { display: 'none' });
        onComplete?.();
      },
    });

    exitTl
      .to(preloaderRef.current, { 
        scale: 0.75, 
        duration: 1.25, 
        ease: 'hop' 
      })
      .to([trackRef.current, progressRef.current],
          { strokeDashoffset: -svgLen, duration: 1.25, ease: 'hop' }, '<')
      .to(labelLineRef.current,
          { y: '-100%', duration: 0.75, ease: 'power3.out' }, '-=1.25')
      .to(outroLineRef.current,
          { y: '0%', duration: 0.75, ease: 'power3.out' }, '-=0.75')
      .to(preloaderRef.current, {
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'hop',
      })
      .to(revealerRef.current, {
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'hop',
      }, '-=1.45');
  }, [onComplete]);

  useEffect(() => {
    if (!autoStart) return;

    const svgLen = trackRef.current?.getTotalLength() ?? 974;

    gsap.set([trackRef.current, progressRef.current], {
      strokeDasharray: svgLen,
      strokeDashoffset: svgLen,
    });

    // Set all line spans to their off-screen start position
    gsap.set([...rowLine.current, labelLineRef.current, outroLineRef.current], { y: '100%' });

    const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) =>
      i === 3 ? 1 : base + (Math.random() - 0.5) * 0.1
    );

    const tl = gsap.timeline({ delay: 0.5 });
    timelineRef.current = tl;

    tl.to(rowLine.current,
        { y: '0%', duration: 0.75, ease: 'power3.out', stagger: 0.1 })
      .to(trackRef.current,
        { strokeDashoffset: 0, duration: 2, ease: 'hop' }, '<')
      .to(btnRef.current.querySelector('svg'),
        { rotation: 270, duration: 2, ease: 'hop' }, '<');

    progressStops.forEach((stop, i) => {
      tl.to(progressRef.current, {
        strokeDashoffset: svgLen - svgLen * stop,
        duration: 0.75,
        ease: 'glide',
        delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
      });
    });

    tl.to(logoRef.current,
        { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.25')
      .to(btnRef.current,
        { scale: 0.9, duration: 1.5, ease: 'hop' }, '-=0.5')
      .to(labelLineRef.current, {
        y: '0%',
        duration: 0.75,
        ease: 'power3.out',
        onComplete: () => {
          readyRef.current = true;
          setReady(true);
        },
      }, '-=0.75');

    return () => {
      tl.kill();
      // Reset ready state on cleanup so StrictMode double-invoke restarts cleanly
      readyRef.current = false;
      setReady(false);
    };
  }, [autoStart]);

  // Helper for indexed row-line refs
  const lineRef = (i) => (el) => { rowLine.current[i] = el; };

  return (
    <div className={`slp-root slp-theme-${theme}`}>
      {/* White curtain that wipes away after the black panel exits */}
      <div ref={revealerRef} className="slp-revealer" />

      {/* Decorative backdrop (white layer) */}
      <div className="slp-backdrop">
        <div className="slp-backdrop-row">
          {cfg.backdropTop.map((group, gi) => (
            <div key={gi} className="slp-backdrop-col">
              {group.map((t, ti) => <p key={ti}>{t}</p>)}
            </div>
          ))}
        </div>
        <div className="slp-backdrop-row" style={{ alignItems: 'flex-end' }}>
          {cfg.backdropBottom.map((group, gi) => (
            <div key={gi} className="slp-backdrop-col">
              {group.map((t, ti) => <p key={ti}>{t}</p>)}
            </div>
          ))}
        </div>
      </div>

      {/* Main black panel */}
      <div ref={preloaderRef} className="slp-preloader">
        <div className="slp-row">
          <p><MaskLine innerRef={lineRef(0)}>{cfg.title}</MaskLine></p>
        </div>

        <div className="slp-row">
          <div className="slp-col">
            {cfg.phases.map((phase, idx) => (
              <div key={idx}>
                <p><MaskLine innerRef={lineRef(idx * 2 + 1)}>{phase.label}</MaskLine></p>
                <p><MaskLine innerRef={lineRef(idx * 2 + 2)}>{phase.value}</MaskLine></p>
              </div>
            ))}
          </div>
          <div className="slp-col">
            <p><MaskLine innerRef={lineRef(5)}>{cfg.code}</MaskLine></p>
          </div>
        </div>

        <div
          ref={btnRef}
          className={`slp-btn-container${ready ? ' slp-ready' : ''}`}
          onClick={handleEngage}
          role="button"
          tabIndex={ready ? 0 : -1}
          aria-label={ready ? cfg.engageText : 'Loading...'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEngage();
            }
          }}
        >
          <div className="slp-svg-strokes">
            <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle ref={trackRef}
                cx="160" cy="160" r="155"
                stroke="#2b2b2b" strokeWidth="2" />
              <circle ref={progressRef}
                cx="160" cy="160" r="155"
                stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <img ref={logoRef} className="slp-logo" src={cfg.logoSrc} alt="Logo" />

          <p className="slp-engage-label">
            <MaskLine innerRef={labelLineRef}>{cfg.engageText}</MaskLine>
          </p>
          <p className="slp-outro-label">
            <MaskLine innerRef={outroLineRef}>{cfg.successText}</MaskLine>
          </p>
        </div>
      </div>
    </div>
  );
}
