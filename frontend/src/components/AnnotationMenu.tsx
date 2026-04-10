import React, { FC, MouseEvent } from 'react';

/**
 * Bottom pill toolbar for image annotation (colors + tools).
 * Visual reference: frontend/ref/annotations.jpg
 */
export const ANNOTATION_COLORS = [
  { id: 'red', hex: '#ef4444' },
  { id: 'yellow', hex: '#eab308' },
  { id: 'green', hex: '#22c55e' },
  { id: 'sky', hex: '#38bdf8' },
  { id: 'white', hex: '#ffffff' },
];

const pill: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: '10px 18px',
  borderRadius: 999,
  background: 'rgba(24, 24, 24, 0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
};

const swatchBase: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '2px solid rgba(255,255,255,0.25)',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
};

const GridHandleIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="6" cy="8" r="1.5" />
    <circle cx="12" cy="8" r="1.5" />
    <circle cx="18" cy="8" r="1.5" />
    <circle cx="6" cy="16" r="1.5" />
    <circle cx="12" cy="16" r="1.5" />
    <circle cx="18" cy="16" r="1.5" />
  </svg>
);

/** Freehand squiggle */
const FreehandIcon: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
    <path d="M4 14c2-4 5-8 8-6s3 6 1 9-6 4-9 2" />
  </svg>
);

interface AnnotationMenuProps {
  selectedColorHex: string;
  onColorChange: (hex: string) => void;
  tool: string;
  onToolChange: (tool: string) => void;
}

const AnnotationMenu: FC<AnnotationMenuProps> = ({
  selectedColorHex,
  onColorChange,
  tool,
  onToolChange,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 28,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        zIndex: 100002,
        pointerEvents: 'auto',
      }}
      className="nopan nodrag"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div style={pill}>
        {ANNOTATION_COLORS.map((c) => {
          const active = c.hex === selectedColorHex;
          return (
            <button
              key={c.id}
              type="button"
              aria-label={`Color ${c.id}`}
              onClick={() => onColorChange(c.hex)}
              style={{
                ...swatchBase,
                background: c.hex,
                boxShadow: active ? '0 0 0 2px #fff, 0 0 0 4px rgba(59,130,246,0.6)' : undefined,
                transform: active ? 'scale(1.08)' : undefined,
              }}
            />
          );
        })}
      </div>

      <div style={{ ...pill, gap: 6, padding: '8px 14px' }}>
        {[
          { id: 'pan', Icon: GridHandleIcon, label: 'Pan', char: null },
          { id: 'draw', Icon: FreehandIcon, label: 'Draw', char: null },
          { id: 'text', Icon: null, label: 'Text', char: 'T' },
        ].map(({ id, Icon, label, char }) => {
          const active = tool === id;
          return (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={active}
              onClick={() => onToolChange(id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                background: active ? 'rgba(37, 99, 235, 0.95)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {char ? (
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>{char}</span>
              ) : (
                Icon && <Icon />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnnotationMenu;
