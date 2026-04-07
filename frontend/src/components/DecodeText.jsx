import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + 
             '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * DecodeText - Scrambled text reveal effect
 * @param {string} text - The target text
 * @param {number} duration - Total duration in ms
 * @param {number} delay - Initial delay in ms
 * @param {boolean} trigger - Start the animation when true
 */
export default function DecodeText({ 
  text = "", 
  duration = 1000, 
  delay = 0, 
  trigger = true,
  className = "" 
}) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!trigger || isDone) return;

    const start = () => {
      startTimeRef.current = performance.now();
      
      const animate = (now) => {
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Calculate how many characters are "fixed"
        const fixedCount = Math.floor(text.length * progress);
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
          if (i < fixedCount) {
            result += text[i];
          } else {
            // Randomly select a junk character
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        
        setDisplayText(result);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          setIsDone(true);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(start, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, duration, delay, trigger, isDone]);

  return (
    <span className={className}>
      {displayText || (trigger ? '' : text)}
    </span>
  );
}
