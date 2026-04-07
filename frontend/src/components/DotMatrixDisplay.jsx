import { useEffect, useRef, useState } from 'react';

/**
 * DotMatrixDisplay - A skeumorphic LED dot matrix display component.
 * Ported and refactored from the provided template.
 */
export default function DotMatrixDisplay({
  iconUrl,
  title,
  description,
  width = 80,
  height = 40,
  dotSize = 6,
  gap = 4,
  activeColor = '#fffefe',
  inactiveColor = '#121212',
  scanlineColor = 'var(--color-accent)'
}) {
  const canvasRef = useRef(null);
  const sampleCanvasRef = useRef(null);
  const matrixRef = useRef([]); // Stores target pixel values (0 or 1)
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDescription, setDisplayDescription] = useState(description);
  const progressRef = useRef(0); // 0 to 1 for scan reveal

  useEffect(() => {
    if (!iconUrl) return;

    const sampleCanvas = sampleCanvasRef.current;
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1. Sample image
      sampleCtx.clearRect(0, 0, width, height);
      const scale = Math.min(width / img.width, height / img.height) * 0.75;
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      sampleCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const imageData = sampleCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const newMatrix = [];

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        // If it's bright or has significant alpha, mark it as active
        newMatrix.push(alpha > 120 ? 1 : 0);
      }

      matrixRef.current = newMatrix;
      setDisplayTitle(title);
      setDisplayDescription(description);
      progressRef.current = 0; // Reset animation for new image
      setIsLoaded(true);
    };
    img.src = iconUrl;

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [iconUrl, title, description, width, height]);

  // Main rendering loop
  useEffect(() => {
    if (!isLoaded) return;

    const displayCanvas = canvasRef.current;
    const ctx = displayCanvas.getContext('2d');

    const render = (time) => {
      ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

      // Gradually increase progress for the scanline reveal
      if (progressRef.current < 1) {
        progressRef.current += 0.02;
      }

      const matrix = matrixRef.current;
      const currentProgressLimit = Math.floor(progressRef.current * height);

      for (let i = 0; i < matrix.length; i++) {
        const col = i % width;
        const row = Math.floor(i / width);
        const isActive = matrix[i] === 1;

        // Skip corner dots for skeumorphic styling
        const isCorner = (row === 0 && (col === 0 || col === width - 1)) ||
          (row === height - 1 && (col === 0 || col === width - 1));
        if (isCorner) continue;

        // Draw dot
        const centerX = col * (dotSize + gap) + dotSize / 2;
        const centerY = row * (dotSize + gap) + dotSize / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, dotSize / 2, 0, Math.PI * 2);

        const isRevealed = row <= currentProgressLimit;

        if (isActive && isRevealed) {
          // Add subtle flicker logic
          const flicker = Math.sin(time * 0.01 + i) * 0.15;
          const brightness = 0.85 + flicker;

          ctx.fillStyle = activeColor;
          ctx.globalAlpha = brightness;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();

          // Optional: Add a "active core" glow
          if (brightness > 0.9) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, dotSize / 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.5;
            ctx.fill();
          }
        } else if (row === currentProgressLimit) {
          // Draw scanning line "hot" pixels
          ctx.fillStyle = scanlineColor;
          ctx.globalAlpha = 0.8;
          ctx.fill();
        } else {
          ctx.fillStyle = inactiveColor;
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isLoaded, iconUrl, width, height, dotSize, gap, activeColor, inactiveColor, scanlineColor]);

  const totalWidth = width * (dotSize + gap) - gap;
  const totalHeight = height * (dotSize + gap) - gap;

  return (
    <div style={{
      padding: '3rem',
      background: 'var(--color-bg-aside)',
      borderRadius: '2.5rem',
      border: '1px solid var(--color-border)',
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '2.5rem',
      alignItems: 'center',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Offscreen sampling canvas */}
      <canvas
        ref={sampleCanvasRef}
        width={width}
        height={height}
        style={{ display: 'none' }}
      />

      {/* Display matrix */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '1.2rem',
        background: 'linear-gradient(180deg, #1c1d1f 0%, #212224 87.18%, #313235 100%)',
        boxShadow: `
          0px -6px 0px 0px rgba(0, 0, 0, 0.8) inset,
          0px 3px 0px 0px rgba(0, 0, 0, 0.4),
          0px 24px 56px 0px rgba(0, 0, 0, 0.7)
        `,
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          width={totalWidth}
          height={totalHeight}
          style={{ display: 'block' }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{
          margin: '0 0 6px',
          fontSize: '22px',
          color: '#fff',
          fontWeight: 700,
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.02em'
        }}>
          {displayTitle}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--color-text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 500
        }}>
          {displayDescription}
        </p>
      </div>
    </div>
  );
}
