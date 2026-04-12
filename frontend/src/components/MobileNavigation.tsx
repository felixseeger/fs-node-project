import React, { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import gsap from 'gsap';
import './MobileNavigation.css';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

/**
 * Mobile Navigation Component
 * Full-screen overlay with GSAP staggered reveal animation.
 */
const MobileNavigation: FC<MobileNavigationProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true });

      // Phase 1: Staggered background layers reveal (scaleY from top)
      timeline.current.to(bgRefs.current, {
        scaleY: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power4.inOut',
      });

      // Phase 2: Content container clip-path reveal
      timeline.current.to(contentRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.5');

      // Phase 3: Staggered link text slide-up
      timeline.current.fromTo(
        '.mob-nav-link-wrapper span',
        { y: '110%' },
        {
          y: '0%',
          duration: 0.7,
          stagger: 0.04,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!timeline.current) return;
    if (isOpen) {
      timeline.current.play();
    } else {
      timeline.current.reverse();
    }
  }, [isOpen]);

  interface NavLinkProps {
    children: ReactNode;
    href?: string;
    className?: string;
    onClick?: () => void;
  }

  const NavLink: FC<NavLinkProps> = ({ children, href = '#', className = '', onClick }) => (
    <div className={`mob-nav-link-wrapper ${className}`}>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
          onClose();
        }}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <span>{children}</span>
      </a>
    </div>
  );

  const primaryLinks = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Builders', id: 'built-for-builders' },
    { label: 'Models', id: 'models' },
    { label: 'Nodes', id: 'nodes' },
  ];

  const socialLinks = ['Twitter', 'GitHub', 'LinkedIn', 'Instagram'];
  const legalLinks = ['Privacy Policy', 'Terms', 'Security'];

  const scrollTo = (id: string) => {
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
    <div
      className={`mob-nav-overlay${isOpen ? ' is-open' : ''}`}
      ref={overlayRef}
      aria-hidden={!isOpen}
      style={{ pointerEvents: isOpen ? 'all' : 'none' }}
    >
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="mob-nav-bg-layer"
          ref={el => { bgRefs.current[i] = el; }}
          style={{
            background: i % 2 === 0
              ? 'var(--color-bg)'
              : 'var(--color-surface)',
            zIndex: i,
          }}
        />
      ))}

      <div className="mob-nav-header">
      </div>

      <div
        className="mob-nav-content"
        ref={contentRef}
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          opacity: 0,
        }}
      >
        <nav className="mob-nav-primary" aria-label="Primary navigation">
          {primaryLinks.map(item => (
            <NavLink key={item.id} onClick={() => scrollTo(item.id)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mob-nav-cta-row" style={{ marginTop: 24, marginBottom: 40, padding: '0 24px' }}>
          <button 
            className="mob-nav-cta"
            onClick={() => { onNavigate?.('auth-login'); onClose(); }}
            title="Log in"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <g style={{ animation: 'pulse-x 1.5s ease-in-out infinite' }}>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </g>
            </svg>
            Log in
          </button>
        </div>

        <div className="mob-nav-footer">
          <div className="mob-nav-meta">
            <div className="mob-nav-socials">
              <span className="mob-nav-meta-label">Follow</span>
              {socialLinks.map(item => (
                <NavLink key={item} className="social" href="#">
                  {item}
                </NavLink>
              ))}
            </div>

            <div className="mob-nav-legal">
              {legalLinks.map(item => (
                <NavLink key={item} className="legal" href="#">
                  {item}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
