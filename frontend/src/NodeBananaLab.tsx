import React, { useMemo, FC } from 'react';

const surface = {
  bg: 'var(--color-bg, #1a1a1a)',
  panel: 'var(--color-surface, #2a2a2a)',
  border: 'var(--color-border, #3a3a3a)',
  text: 'var(--color-text, #e0e0e0)',
  dim: 'var(--color-text-dim, #888)',
};

/**
 * Embeds [node-banana](https://github.com/shrimbly/node-banana) (Next.js AI workflow editor).
 * Full source port is not bundled here; run node-banana separately or set VITE_NODE_BANANA_URL.
 *
 * Dev: Vite proxies /node-banana-dev → http://localhost:3000 so the iframe is same-origin.
 * Prod: set VITE_NODE_BANANA_URL to your deployed node-banana origin (embedding may require
 * relaxed frame headers on that host).
 */
export const NodeBananaLab: FC = () => {
  const src = useMemo(() => {
    const fromEnv = (import.meta as any).env.VITE_NODE_BANANA_URL?.trim();
    if (fromEnv) return fromEnv;
    if ((import.meta as any).env.DEV && typeof window !== 'undefined') {
      return `${window.location.origin}/node-banana-dev`;
    }
    return '';
  }, []);

  if (!src) {
    return (
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: surface.bg,
          color: surface.text,
        }}
      >
        <div
          style={{
            maxWidth: 520,
            padding: 24,
            borderRadius: 12,
            border: `1px solid ${surface.border}`,
            background: surface.panel,
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>Node Banana editor</h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.5, color: surface.dim }}>
            This view embeds the open-source{' '}
            <a
              href="https://github.com/shrimbly/node-banana"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#60a5fa' }}
            >
              shrimbly/node-banana
            </a>{' '}
            app. Set <code style={{ color: surface.text }}>VITE_NODE_BANANA_URL</code> in{' '}
            <code style={{ color: surface.text }}>frontend/.env</code> to your deployed URL (for example{' '}
            <code style={{ color: surface.text }}>https://banana.example.com</code>), then rebuild.
          </p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: surface.dim }}>
            For local development, run <code style={{ color: surface.text }}>npm run dev</code> in a clone of
            node-banana (port 3000). This Vite app proxies <code style={{ color: surface.text }}>/node-banana-dev</code>{' '}
            to localhost:3000 automatically in dev mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: surface.bg }}>
      <iframe
        title="Node Banana — AI workflow editor"
        src={src}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          minHeight: 480,
        }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
};

export default NodeBananaLab;
