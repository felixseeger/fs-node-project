import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function CyberEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) {
  // Guard against NaN coordinates which can crash SVG rendering
  if (isNaN(sourceX) || isNaN(sourceY) || isNaN(targetX) || isNaN(targetY)) {
    return null;
  }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isExecuting = data?.isExecuting;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: isExecuting ? 3 : 2,
          stroke: isExecuting ? 'var(--color-brand-cyan)' : 'var(--color-border-subtle)',
          filter: isExecuting ? 'var(--glow-cyan)' : 'none',
          strokeDasharray: isExecuting ? '10 10' : '5 5',
          opacity: isExecuting ? 1 : 0.6,
        }}
        markerEnd={markerEnd}
      />
      {isExecuting && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke="var(--color-brand-cyan)"
          strokeWidth={4}
          strokeDasharray="5 20"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            filter: 'var(--glow-cyan)',
            willChange: 'stroke-dashoffset', // Optimize performance
            pointerEvents: 'none'
          }}
        />
      )}
    </>
  );
}
