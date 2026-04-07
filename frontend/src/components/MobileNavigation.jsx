import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './MobileNavigation.css';

/**
 * Mobile Navigation Component
 * Refactored from Codegrid grid-overlay reference.
 * Uses GSAP for high-performance animations and Liquid Glass for aesthetics.
 */
export default function MobileNavigation({ isOpen, onClose, links }) {
  const overlayRef = useRef(null);
  const bgRefs = useRef([]);
  const itemsRef = useRef(null);
  const linksRef = useRef([]);
  const timeline = useRef(null);

  // Initialize GSAP Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true });

      // Staggered background reveal
      timeline.current.to(bgRefs.current, {
        scaleY: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.inOut",
      });

      // Clip-path reveal for menu content
      timeline.current.to(itemsRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power4.inOut",
      }, "-=0.7");

      // Staggered link reveal (manual line split)
      timeline.current.fromTo(".nav-link-wrapper span", 
        { y: "100%" },
        {
          y: "0%",
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
        }, 
        "-=0.5"
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  // Control Timeline based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      timeline.current.play();
    } else {
      timeline.current.reverse();
    }
  }, [isOpen]);

  // Helper to split text into spans for animation
  const SplitLink = ({ children, className, href }) => (
    <div className={`nav-link-wrapper ${className}`}>
      <a href={href} onClick={(e) => { e.preventDefault(); onClose(); }}>
        <span style={{ display: 'block', pointerEvents: 'none' }}>
          {children}
        </span>
      </a>
    </div>
  );

  return (
    <div 
      className={`mobile-nav-overlay ${isOpen ? 'is-open' : ''}`} 
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: isOpen ? 'all' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Layers (Liquid Glass Layers) */}
      {[...Array(4)].map((_, i) => (
        <div 
          key={i}
          className="nav-bg-layer"
          ref={el => bgRefs.current[i] = el}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transformOrigin: 'top',
            transform: 'scaleY(0)',
            zIndex: i,
            background: i % 2 === 0 
              ? 'rgba(10, 10, 10, 0.95)' 
              : 'rgba(20, 20, 20, 0.85)',
            backdropFilter: i === 3 ? 'blur(40px)' : 'none',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none'
          }}
        />
      ))}

      {/* Menu Content */}
      <div 
        className="nav-content-container"
        ref={itemsRef}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1200,
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 60,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        }}
      >
        {/* Left Column: Socials & Legal */}
        <div className="nav-col-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '100px 0' }}>
          <div className="nav-group socials">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 24, letterSpacing: '0.1em' }}>Follow</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map(item => (
                <SplitLink key={item} className="social-link" href="#">{item}</SplitLink>
              ))}
            </div>
          </div>
          
          <div className="nav-group legal">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Privacy Policy', 'Terms', 'Security'].map(item => (
                <SplitLink key={item} className="legal-link" href="#">{item}</SplitLink>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Links */}
        <div className="nav-col-right" style={{ display: 'flex', flexDirection: 'column', gap: 80, padding: '100px 0' }}>
          <div className="nav-group primary">
            {['Home', 'Platform', 'Engine', 'Showcase', 'Documentation'].map(item => (
              <SplitLink key={item} className="primary-link" href="#">{item}</SplitLink>
            ))}
          </div>

          <div className="nav-group secondary" style={{ display: 'flex', gap: 40 }}>
            {['Changelog', 'Community', 'Status'].map(item => (
              <SplitLink key={item} className="secondary-link" href="#">{item}</SplitLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
