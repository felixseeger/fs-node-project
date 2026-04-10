import { useState, type FC } from 'react';

/** Logo with fallback if SVG fails to load */
export const LogoImage: FC = () => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span style={{ fontSize: 20 }}>🎨</span>;
  }
  return (
    <img
      src="/logo-light.svg"
      alt="Logo"
      style={{ height: 24, width: 'auto' }}
      onError={() => setFailed(true)}
    />
  );
};
