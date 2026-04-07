import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ThemeToggle from './ThemeToggle';
import './MobileNavigation.css';

/**
 * Mobile Navigation Component
 * Full-screen overlay with GSAP staggered reveal animation.
 */
export default function MobileNavigation({ isOpen, onClose, onNavigate, theme, setTheme }) {
  const overlayRef = useRef(null);
  const bgRefs = useRef([]);
  const contentRef = useRef(null);
  const timeline = useRef(null);

  // Initialize GSAP Timeline once on mount
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

  // Drive the timeline from the isOpen prop
  useEffect(() => {
    if (!timeline.current) return;
    if (isOpen) {
      timeline.current.play();
    } else {
      timeline.current.reverse();
    }
  }, [isOpen]);

  // Helper: wraps text in an overflow-hidden span for slide-up animation
  const NavLink = ({ children, href = '#', className = '', onClick }) => (
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

  // Helper: scrolls to a target section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Check if we are on landing page with the specific scroll container
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
      {/* Background Layers — staggered scaleY reveal from top */}
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

      {/* Fixed Header Strip: Logo left */}
      <div className="mob-nav-header">
        
        {/* Theme Toggle aligned to right (before the close button which is in LandingPage) */}
        <div style={{ marginRight: 48 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      {/* Scrollable Menu Content */}
      <div
        className="mob-nav-content"
        ref={contentRef}
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          opacity: 0,
        }}
      >
        {/* Primary Nav Links — large typographic display */}
        <nav className="mob-nav-primary" aria-label="Primary navigation">
          {primaryLinks.map(item => (
            <NavLink key={item.id} onClick={() => scrollTo(item.id)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="mob-nav-cta-row" style={{ marginTop: 24, marginBottom: 40, padding: '0 24px' }}>
          <button 
            className="mob-nav-cta mob-nav-cta--outline"
            onClick={() => { onNavigate?.('auth-login'); onClose(); }}
            style={{ flex: 1 }}
          >
            Log in
          </button>
          <button 
            className="mob-nav-cta"
            onClick={() => { onNavigate?.('auth-signup'); onClose(); }}
            style={{ flex: 1 }}
          >
            Sign up
          </button>
        </div>

        {/* Footer Row */}
        <div className="mob-nav-footer">
          {/* Social + Legal */}
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
}
