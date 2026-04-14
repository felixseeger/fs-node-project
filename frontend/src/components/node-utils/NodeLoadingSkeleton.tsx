import React from 'react';
import { surface, border, radius, sp } from '../../nodes/nodeTokens';

/**
 * A visual placeholder displayed while a node component is being downloaded asynchronously.
 * Mimics the general shape and styling of a NodeShell to prevent layout shift.
 */
export function NodeLoadingSkeleton() {
  return (
    <div
      style={{
        background: surface.raised,
        border: `1px solid ${border.default}`,
        borderRadius: radius.xl,
        width: 320,
        minHeight: 180,
        padding: sp[4],
        display: 'flex',
        flexDirection: 'column',
        gap: sp[3],
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Shimmer effect overlay */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.04),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      <div className="skeleton-shimmer" />

      {/* Header Placeholder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: sp[2], marginBottom: sp[2] }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: surface.sunken }} />
        <div style={{ height: 16, width: '60%', background: surface.sunken, borderRadius: radius.sm }} />
      </div>

      {/* Body Placeholders (Mock inputs/sliders) */}
      <div style={{ height: 32, width: '100%', background: surface.sunken, borderRadius: radius.md }} />
      <div style={{ height: 32, width: '100%', background: surface.sunken, borderRadius: radius.md }} />
      <div style={{ height: 64, width: '100%', background: surface.sunken, borderRadius: radius.md, marginTop: sp[2] }} />

      {/* Handle Placeholders */}
      <div style={{ position: 'absolute', left: -6, top: '50%', width: 12, height: 12, borderRadius: '50%', background: surface.sunken, border: `2px solid ${border.default}` }} />
      <div style={{ position: 'absolute', right: -6, top: '50%', width: 12, height: 12, borderRadius: '50%', background: surface.sunken, border: `2px solid ${border.default}` }} />
    </div>
  );
}
