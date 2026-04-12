import React, { useEffect, useRef, useState, useCallback, type FC, type ReactNode } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import ScrambleText from './ScrambleText';
import './SystemLoadingProcess.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'strudel-repl': any;
    }
  }
}

gsap.registerPlugin(CustomEase);

// Guard against re-registration on hot-reload
if (!CustomEase.get('hop')) CustomEase.create('hop', '0.9, 0, 0.1, 1');
if (!CustomEase.get('glide')) CustomEase.create('glide', '0.8, 0, 0.2, 1');

interface Phase {
  label: string;
  value: string;
}

interface SystemLoadingProcessConfig {
  backdropTop?: string[][];
  backdropBottom?: string[][];
  title?: string;
  phases?: Phase[];
  code?: string;
  engageText?: string;
  successText?: string;
  logoSrc?: string;
}

// Default content configuration
const DEFAULT_CONFIG: Required<SystemLoadingProcessConfig> = {
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

// Generates a random and refreshing loading sound using Strudel syntax
const generateLoadUpSound = () => {
  const scales = ["C:major", "D:dorian", "E:phrygian", "F:lydian", "G:mixolydian", "A:minor"];
  const notes = ["0 2 4 7", "0 4 7 12", "0 3 7 10", "0 7 12 14", "12 7 4 0", "0 [2 4] <7 12>"];
  const sounds = ["sine", "sawtooth", "triangle", "glass", "gong", "piano", "jazz"];
  const fx = [".room(1)", ".lpf(1000).room(0.5)", ".vowel('a e i o').room(0.8)", ".delay(0.5)", ".gain(0.8)"];
  
  const scale = scales[Math.floor(Math.random() * scales.length)];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const sound = sounds[Math.floor(Math.random() * sounds.length)];
  const effect = fx[Math.floor(Math.random() * fx.length)];

  // Fast pattern that resolves quickly, suitable for a loading sting
  return `n("${note}").scale("${scale}").sound("${sound}")${effect}.fast(4).gain(0.3)`;
};

interface MaskLineProps {
  innerRef?: React.RefObject<HTMLSpanElement | null> | ((el: HTMLSpanElement | null) => void);
  children: ReactNode;
}

// Mask wrapper: overflow:hidden on parent, animated span is the direct child
const MaskLine: FC<MaskLineProps> = ({ innerRef, children }) => {
  return (
    <span className="slp-mask">
      <span ref={innerRef} className="slp-line">{children}</span>
    </span>
  );
};

interface SystemLoadingProcessProps {
  isProcessing?: boolean;
  onComplete?: () => void;
  autoStart?: boolean;
  requireInteraction?: boolean;
  autoContinueDelayMs?: number;
  config?: SystemLoadingProcessConfig;
  theme?: 'dark' | 'light';
}

/**
 * SystemLoadingProcess - Cyberpunk/Sci-fi preloader animation
 */
const SystemLoadingProcess: FC<SystemLoadingProcessProps> = ({
  isProcessing = false,
  onComplete,
  autoStart = true,
  requireInteraction = false,
  autoContinueDelayMs = 700,
  config = {},
  theme = 'dark',
}) => {
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const preloaderRef = useRef<HTMLDivElement>(null);
  const revealerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGCircleElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const labelLineRef = useRef<HTMLSpanElement>(null);
  const outroLineRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);
  const rowLinesRef = useRef<(HTMLSpanElement | null)[]>([]);

  const timelineFinishedRef = useRef(false);
  const replRef = useRef<any>(null);
  const [loadupPattern] = useState(generateLoadUpSound);

  useEffect(() => {
    if (timelineFinishedRef.current && !isProcessing && !readyRef.current) {
      readyRef.current = true;
      setReady(true);
    }
  }, [isProcessing]);

  // Handle Strudel pattern playback
  useEffect(() => {
    if (ready && replRef.current) {
      setTimeout(() => {
        if (replRef.current) {
          replRef.current.code = loadupPattern;
          // Trigger evaluation and play through the web component's custom events or attributes
          // Some versions of the component automatically play when code is updated, 
          // others need the start() or play() method. We try multiple ways safely.
          try {
            if (typeof replRef.current.play === 'function') {
              replRef.current.play();
            } else if (typeof replRef.current.start === 'function') {
              replRef.current.start();
            } else if (replRef.current.evaluate) {
               replRef.current.evaluate();
            } else {
               // Force a re-render/re-evaluation through attribute mutation
               replRef.current.setAttribute('code', loadupPattern);
            }
          } catch(e) {
            console.warn('[Strudel] Could not autoplay loading sound:', e);
          }
        }
      }, 250);
    }
  }, [ready, loadupPattern]);

  useEffect(() => {
    if (exiting && replRef.current) {
      try {
        if (typeof replRef.current.stop === 'function') {
          replRef.current.stop();
        } else if (replRef.current.hush) {
           replRef.current.hush();
        }
      } catch (e) {
        console.warn('[Strudel] Error stopping loading sound:', e);
      }
    }
  }, [exiting]);


  const playSound = useCallback((soundName: string) => {
    const audio = new Audio(`/assets/sfx/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(e => {
      if (e.name === 'NotAllowedError') {
        console.debug(`[SFX] Sound ${soundName} suppressed (user interaction needed)`);
      } else {
        console.warn(`[SFX] Sound ${soundName} play failed:`, e);
      }
    });
  }, []);

  const handleEngage = useCallback(() => {
    if (!readyRef.current) return;
    readyRef.current = false;
    setExiting(true);
    
    playSound('menu-select');

    const svgLen = trackRef.current?.getTotalLength() ?? 974;

    const exitTl = gsap.timeline({
      onComplete: () => {
        playSound('menu-close');
        if (preloaderRef.current) {
          gsap.set(preloaderRef.current, { display: 'none' });
        }
        onComplete?.();
      },
    });

    exitTl
      .to(preloaderRef.current, { scale: 0.75, duration: 1.25, ease: 'hop' })
      .to([trackRef.current, progressRef.current], { strokeDashoffset: -svgLen, duration: 1.25, ease: 'hop' }, '<')
      .to(labelLineRef.current, { y: '-100%', duration: 0.75, ease: 'power3.out' }, '-=1.25')
      .to(outroLineRef.current, { y: '0%', duration: 0.75, ease: 'power3.out' }, '-=0.75')
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
  }, [onComplete, playSound]);

  useEffect(() => {
    if (!autoStart) return undefined;
    
    playSound('menu-open');
    
    const svgLen = trackRef.current?.getTotalLength() ?? 974;

    gsap.set([trackRef.current, progressRef.current], {
      strokeDasharray: svgLen,
      strokeDashoffset: svgLen,
    });

    gsap.set([...rowLinesRef.current, labelLineRef.current, outroLineRef.current], { y: '100%' });

    const progressStops = [0.2, 0.25, 0.85, 1].map((base, i) =>
      i === 3 ? 1 : base + (Math.random() - 0.5) * 0.1
    );

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(rowLinesRef.current, { y: '0%', duration: 0.75, ease: 'power3.out', stagger: 0.1 })
      .to(trackRef.current, { strokeDashoffset: 0, duration: 2, ease: 'hop' }, '<')
      .to(btnRef.current?.querySelector('svg') || null, { rotation: 270, duration: 2, ease: 'hop' }, '<');
    const cyanPaths = logoRef.current?.querySelectorAll('.slp-logo-cyan .slp-logo-path');
    const magentaPaths = logoRef.current?.querySelectorAll('.slp-logo-magenta .slp-logo-path');
    const mainPaths = logoRef.current?.querySelectorAll('.slp-logo-main .slp-logo-path');
    
    if (cyanPaths && magentaPaths && mainPaths) {
      [cyanPaths, magentaPaths, mainPaths].forEach(group => {
        group.forEach(p => {
          const length = (p as SVGPathElement).getTotalLength();
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });
      });
      
      tl.to(cyanPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.0')
        .to(magentaPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.1')
        .to(mainPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.1')
        .to('.slp-logo-cyan', { opacity: 0, scale: 1.05, filter: 'blur(2px)', duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .to('.slp-logo-magenta', { opacity: 0, scale: 0.95, filter: 'blur(2px)', duration: 0.6, ease: 'power2.out' }, '<');
    }


    progressStops.forEach((stop, i) => {
      tl.to(progressRef.current, {
        strokeDashoffset: svgLen - svgLen * stop,
        duration: 0.75,
        ease: 'glide',
        delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
      });
    });

    tl.to(logoRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.25')
      .to(btnRef.current, { scale: 0.9, duration: 1.5, ease: 'hop' }, '-=0.5')
      .to(labelLineRef.current, {
        y: '0%',
        duration: 0.75,
        ease: 'power3.out',
        onComplete: () => {
          timelineFinishedRef.current = true;
          if (!isProcessing) {
            readyRef.current = true;
            setReady(true);
          }
        },
      }, '-=0.75');

    return () => {
      tl.kill();
      readyRef.current = false;
      setReady(false);
    };
  }, [autoStart, playSound]);

  useEffect(() => {
    if (!ready || requireInteraction || exiting) return undefined;
    const timerId = setTimeout(() => {
      handleEngage();
    }, autoContinueDelayMs);
    return () => clearTimeout(timerId);
  }, [ready, requireInteraction, exiting, autoContinueDelayMs, handleEngage]);

  const setLineRef = (i: number) => (el: HTMLSpanElement | null) => { rowLinesRef.current[i] = el; };

  return (
    <div className={`slp-root slp-theme-${theme}`}>
      <div ref={revealerRef} className="slp-revealer" />
      <div className="slp-backdrop">
        <div
          className="slp-noise-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: theme === 'light' ? 0.04 : 0.08,
            pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
          }}
        />
        <div className="slp-backdrop-row">
          {cfg.backdropTop.map((group, gi) => (
            <div key={gi} className="slp-backdrop-col">
              {group.map((t, ti) => (
                <p key={ti}>
                  <ScrambleText text={t} trigger={exiting} delay={gi * 100 + ti * 30} />
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="slp-backdrop-row" style={{ alignItems: 'flex-end' }}>
          {cfg.backdropBottom.map((group, gi) => (
            <div key={gi} className="slp-backdrop-col">
              {group.map((t, ti) => (
                <p key={ti}>
                  <ScrambleText text={t} trigger={exiting} delay={gi * 150 + ti * 50} />
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div ref={preloaderRef} className="slp-preloader">
        <div className="slp-row">
          <p>
            <MaskLine innerRef={setLineRef(0)}>
              <ScrambleText text={cfg.title} delay={500} />
            </MaskLine>
          </p>
        </div>

        <div className="slp-row">
          <div className="slp-col">
            {cfg.phases.map((phase, idx) => (
              <div key={idx}>
                <p>
                  <MaskLine innerRef={setLineRef(idx * 2 + 1)}>
                    <ScrambleText text={phase.label} delay={800 + idx * 200} />
                  </MaskLine>
                </p>
                <p>
                  <MaskLine innerRef={setLineRef(idx * 2 + 2)}>
                    <ScrambleText text={phase.value} delay={1000 + idx * 200} />
                  </MaskLine>
                </p>
              </div>
            ))}
          </div>
          <div className="slp-col">
            <p>
              <MaskLine innerRef={setLineRef(5)}>
                <ScrambleText text={cfg.code} delay={1500} />
              </MaskLine>
            </p>
          </div>
        </div>

        <div
          ref={btnRef}
          className={`slp-btn-container${ready ? ' slp-ready' : ''}`}
          onClick={ready ? handleEngage : undefined}
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
              <circle ref={trackRef} cx="160" cy="160" r="155" stroke="#2b2b2b" strokeWidth="2" />
              <circle ref={progressRef} cx="160" cy="160" r="155" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <svg 
            ref={logoRef as any} 
            className="slp-logo" 
            width="113" 
            height="112" 
            viewBox="0 0 113 112" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ mixBlendMode: 'screen' }}
          >
            {/* Cyan Layer */}
            <g className="slp-logo-cyan" style={{ transformOrigin: 'center', transform: 'translate(-3px, -2px) scale(1.02)' }}>
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
            {/* Magenta Layer */}
            <g className="slp-logo-magenta" style={{ transformOrigin: 'center', transform: 'translate(3px, 2px) scale(0.98)' }}>
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
            {/* Main Layer */}
            <g className="slp-logo-main">
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
          </svg>

          <p className="slp-engage-label">
            <MaskLine innerRef={labelLineRef}>
              {ready ? <ScrambleText text={cfg.engageText} /> : (isProcessing ? <ScrambleText text="Processing..." /> : cfg.engageText)}
            </MaskLine>
          </p>
          <p className="slp-outro-label">
            <MaskLine innerRef={outroLineRef}>
              <ScrambleText text={cfg.successText} trigger={exiting} />
            </MaskLine>
          </p>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <strudel-repl ref={replRef} theme="dark" hide-controls></strudel-repl>
      </div>
    </div>
  );
};

export default SystemLoadingProcess;
