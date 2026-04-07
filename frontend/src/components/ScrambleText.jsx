import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ScrambleText - A React implementation of the classic character scrambling effect.
 * Ported from the provided template script.js.
 * 
 * @param {Object} props
 * @param {string} props.text - The text to display/morph to.
 * @param {number} props.delay - Delay before starting the animation (ms).
 * @param {boolean} props.trigger - If provided, triggers animation when value changes.
 * @param {string} props.className - Optional CSS class.
 * @param {Function} props.onComplete - Callback when scramble finishes.
 */
export default function ScrambleText({ 
  text, 
  delay = 0, 
  trigger = true, 
  className = '', 
  onComplete 
}) {
  const elRef = useRef(null);
  const [currentText, setCurrentText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const frameRequest = useRef(null);
  const frameCounter = useRef(0);
  const queue = useRef([]);

  const randomChar = useCallback(() => {
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  const update = useCallback(() => {
    let output = [];
    let completeCount = 0;

    for (let i = 0, n = queue.current.length; i < n; i++) {
      let { to, start, end, char } = queue.current[i];
      
      if (frameCounter.current >= end) {
        completeCount++;
        output.push({ char: to, isDud: false });
      } else if (frameCounter.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar();
          queue.current[i].char = char;
        }
        output.push({ char, isDud: true });
      } else {
        // We show nothing or empty space if it hasn't started yet for this character
        // The original script shows 'from', but in a React "reveal" context, 
        // showing nothing initially is often better unless we are transitionsing.
        output.push({ char: '', isDud: false });
      }
    }

    // Convert output objects to JSX to support the .dud styling
    const result = output.map((item, idx) => (
      <span key={idx} className={item.isDud ? 'dud' : ''}>
        {item.char}
      </span>
    ));

    if (elRef.current) {
        // Use set state or direct DOM manipulation? 
        // Direct DOM is more performant for high-frequency RAF updates.
        // But for consistency let's use a ref and innerHTML / render 
        // Actually, let's keep it simple with React for now unless it lags.
    }
    
    setCurrentText(result);

    if (completeCount === queue.current.length) {
      onComplete?.();
    } else {
      frameCounter.current++;
      // eslint-disable-next-line react-hooks/immutability
      frameRequest.current = requestAnimationFrame(update);
    }
  }, [randomChar, onComplete]);

  const startScramble = useCallback((newText) => {
    const length = newText.length;
    queue.current = [];
    
    for (let i = 0; i < length; i++) {
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.current.push({ to, start, end });
    }

    cancelAnimationFrame(frameRequest.current);
    frameCounter.current = 0;
    update();
  }, [update]);

  useEffect(() => {
    if (trigger && text) {
      const timer = setTimeout(() => {
        startScramble(text);
      }, delay);
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frameRequest.current);
      }
    }
  }, [text, trigger, delay, startScramble]);

  return (
    <span ref={elRef} className={`scramble-text ${className}`}>
      {currentText}
    </span>
  );
}
