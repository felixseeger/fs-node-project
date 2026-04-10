import { useState, type FC } from 'react';

/** Resilient thumbnail component with onError fallback */
export const ProjectThumbnail: FC<{ src?: string }> = ({ src }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="project-thumbnail-container"
        style={{
          background: 'var(--color-surface-hover)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24, opacity: 0.2 }}>⚡</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-faint)', fontWeight: 500 }}>Void Canvas</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="project-thumbnail-container"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img src={src} alt="" style={{ display: 'none' }} onError={() => setFailed(true)} />
    </div>
  );
};
