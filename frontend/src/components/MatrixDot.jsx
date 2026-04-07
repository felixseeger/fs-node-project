import { useMemo } from 'react';

export default function MatrixDot({
  dotSize = 2,
  dotColor = '#444',
  spacing = 24,
  opacity = 0.5,
  style = {},
}) {
  // Create SVG pattern for the dot matrix
  const patternId = useMemo(() => `matrix-dot-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <defs>
          <pattern
            id={patternId}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize / 2}
              fill={dotColor}
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

// Variant with subtle gradient fade at edges
export function MatrixDotWithFade({
  dotSize = 2,
  dotColor = '#444',
  spacing = 24,
  opacity = 0.5,
  fadeEdges = false,
  style = {},
}) {
  const patternId = useMemo(() => `matrix-dot-fade-${Math.random().toString(36).substr(2, 9)}`, []);
  const maskId = useMemo(() => `matrix-mask-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <defs>
          <pattern
            id={patternId}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize / 2}
              fill={dotColor}
              opacity={opacity}
            />
          </pattern>
          {fadeEdges && (
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              <rect
                x="0"
                y="0"
                width="100%"
                height="60"
                fill="url(#fade-gradient-top)"
              />
              <rect
                x="0"
                y="calc(100% - 60px)"
                width="100%"
                height="60"
                fill="url(#fade-gradient-bottom)"
              />
              <linearGradient id="fade-gradient-top" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="black" />
              </linearGradient>
              <linearGradient id="fade-gradient-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="black" />
              </linearGradient>
            </mask>
          )}
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          mask={fadeEdges ? `url(#${maskId})` : undefined}
        />
      </svg>
    </div>
  );
}

// Dense variant for smaller screens
export function MatrixDotDense(props) {
  return <MatrixDot {...props} spacing={16} dotSize={1.5} opacity={0.4} />;
}

// Sparse variant for larger displays
export function MatrixDotSparse(props) {
  return <MatrixDot {...props} spacing={32} dotSize={2.5} opacity={0.6} />;
}
