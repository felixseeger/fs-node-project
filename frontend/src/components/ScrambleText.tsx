import React, { useEffect, useRef, useState, useCallback, type FC, type ReactNode } from 'react';

interface QueueItem {
  to: string;
  start: number;
  end: number;
  char?: string;
}

interface ScrambleTextProps {
  text: string;
  delay?: number;
  trigger?: boolean;
  className?: string;
  onComplete?: () => void;
}

/**
 * ScrambleText - A React implementation of the classic character scrambling effect.
 */
const ScrambleText: FC<ScrambleTextProps> = ({ 
  text, 
  delay = 0, 
  trigger = true, 
  className = '', 
  onComplete 
}) => {
  const elRef = useRef<HTMLSpanElement>(null);
  const [currentText, setCurrentText] = useState<ReactNode[]>([]);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const frameRequest = useRef<number | null>(null);
  const frameCounter = useRef(0);
  const queue = useRef<QueueItem[]>([]);

  const randomChar = useCallback(() => {
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  const update = useCallback(() => {
    let output: { char: string; isDud: boolean }[] = [];
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
        output.push({ char: char!, isDud: true });
      } else {
        output.push({ char: '', isDud: false });
      }
    }

    const result = output.map((item, idx) => (
      <span key={idx} className={item.isDud ? 'dud' : ''}>
        {item.char}
      </span>
    ));
    
    setCurrentText(result);

    if (completeCount === queue.current.length) {
      onComplete?.();
    } else {
      frameCounter.current++;
      frameRequest.current = requestAnimationFrame(update);
    }
  }, [randomChar, onComplete]);

  const startScramble = useCallback((newText: string) => {
    const length = newText.length;
    queue.current = [];
    
    for (let i = 0; i < length; i++) {
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.current.push({ to, start, end });
    }

    if (frameRequest.current !== null) {
      cancelAnimationFrame(frameRequest.current);
    }
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
        if (frameRequest.current !== null) {
          cancelAnimationFrame(frameRequest.current);
        }
      }
    }
  }, [text, trigger, delay, startScramble]);

  return (
    <span ref={elRef} className={`scramble-text ${className}`}>
      {currentText}
    </span>
  );
};

export default ScrambleText;
