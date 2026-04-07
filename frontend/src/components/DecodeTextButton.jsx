import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * DecodeTextButton - A GSAP-powered button with a character scrambling reveal effect on hover.
 * Ported and refactored from the provided template.
 */
export default function DecodeTextButton({ 
  text,
  children,
  onClick, 
  className = '', 
  style = {},
  variant = 'primary', 
  fromRight = false,
  duration,
  startIcon,
  endIcon,
  ...props 
}) {
  const buttonRef = useRef(null);
  const [displayText, setDisplayText] = useState(text || children?.toString() || '');
  const originalText = text || children?.toString() || '';
  
  // Use originalText for the scramble logic
  useEffect(() => {
    setDisplayText(originalText);
  }, [originalText]);
  
  const randChar = useCallback(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`";
    const char = chars[Math.floor(Math.random() * chars.length)];
    return Math.random() > 0.5 ? char : char.toUpperCase();
  }, []);

  const handleMouseEnter = () => {
    if (!originalText) return;
    const arr1 = originalText.split('');
    const arr2 = arr1.map(() => randChar());
    
    const tl = gsap.timeline();
    let step = 0;
    const totalChars = arr1.length;
    
    setDisplayText(arr2.join(''));

    tl.to({}, {
      duration: duration || Math.max(0.4, totalChars / 15),
      ease: 'none',
      onUpdate: () => {
        const p = Math.floor(tl.progress() * totalChars);
        
        if (step !== p) {
          step = p;
          const currentRandom = arr1.map(() => randChar());
          
          let pt1, pt2;
          if (fromRight) {
            pt1 = currentRandom.join('').substring(0, totalChars - p);
            pt2 = originalText.substring(totalChars - p);
          } else {
            pt1 = originalText.substring(0, p);
            pt2 = currentRandom.join('').substring(0, totalChars - p);
          }
          setDisplayText(pt1 + pt2);
        }
      },
      onComplete: () => {
        setDisplayText(originalText);
      }
    });
  };

  const handleMouseLeave = () => {
    setDisplayText(originalText);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: '#fff',
          color: '#000',
          border: 'none',
        };
      case 'accent':
        return {
          background: '#3B3BFF',
          color: '#fff',
          border: 'none',
          boxShadow: '0 0 24px rgba(59, 59, 255, 0.4)'
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: '#fff',
          border: '1px solid #333',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#888',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const combinedStyle = {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    whiteSpace: 'nowrap',
    ...getVariantStyles(),
    ...style
  };

  return (
    <button
      ref={buttonRef}
      className={`decode-button ${className}`}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {startIcon && (
        <span style={{ display: 'flex', alignItems: 'center', width: 14 }}>
          {startIcon}
        </span>
      )}
      
      <span style={{ position: 'relative' }}>
        {displayText}
      </span>

      {endIcon && (
        <span style={{ display: 'flex', alignItems: 'center', width: 14 }}>
          {endIcon}
        </span>
      )}
      
      {!text && !startIcon && !endIcon && children}
    </button>
  );
}
