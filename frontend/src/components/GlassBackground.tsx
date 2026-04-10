/**
 * Animated background scene with drifting blobs.
 * Matches the Liquid Glass UI Kit animation system.
 */

export default function GlassBackground() {
  return (
    <div className="scene">
      <div className="scene__blob scene__blob--1"></div>
      <div className="scene__blob scene__blob--2"></div>
      <div className="scene__blob scene__blob--3"></div>
    </div>
  );
}