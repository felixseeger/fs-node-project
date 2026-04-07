import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

/**
 * DecodedText Component
 * Animates text by scrambling characters before revealing the final text.
 */
const DecodedText = ({
  text = '',
  active = true,
  speed = 40,
  scrambleCount = 3,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // If not active or empty text, just show it
    if (!active || !text) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      // Scramble logic
      const scrambled = text
        .split('')
        .map((char, index) => {
          // If we've passed this index, show the actual character
          if (index < iterations) {
            return text[index];
          }
          // Otherwise, show a random character
          // Space characters remain spaces for better readability during animation
          if (char === ' ') return ' ';
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      // Stop once we've reached the end
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final text is exact
      }

      // Progress the reveal
      iterations += 1 / scrambleCount;
    }, speed);

    return () => clearInterval(interval);
  }, [text, active, speed, scrambleCount]);

  return <span className={className}>{displayText}</span>;
};

export default DecodedText;
