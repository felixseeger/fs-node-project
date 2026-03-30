import { surface, border, sp, radius, font } from './nodeTokens';

/**
 * Node wrapper shell with category-aware visual identity.
 *
 * Props:
 *  - label:    Node display name
 *  - dotColor: Category accent color (drives header tint + left border)
 *  - selected: Whether the node is currently selected
 *  - children: Node body content
 */
export default function NodeShell({ label, dotColor, selected, children }) {
  const accentAlpha = dotColor ? `${dotColor}14` : 'transparent'; // 8% opacity hex

  return (
    <div
      style={{
        background: surface.base,
        border: `1px solid ${selected ? border.active : border.subtle}`,
        borderLeft: dotColor ? `3px solid ${dotColor}` : `1px solid ${selected ? border.active : border.subtle}`,
        borderRadius: radius.lg,
        minWidth: 240,
        maxWidth: 380,
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'border-color 0.12s',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = border.hover;
          e.currentTarget.style.borderLeftColor = dotColor || border.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = border.subtle;
          e.currentTarget.style.borderLeftColor = dotColor || border.subtle;
        }
      }}
    >
      {/* Header bar with category tint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sp[2],
          padding: `${sp[3]}px ${sp[5]}px`,
          borderBottom: `1px solid ${border.subtle}`,
          background: `linear-gradient(90deg, ${accentAlpha}, transparent)`,
          borderRadius: `${radius.lg - 1}px ${radius.lg - 1}px 0 0`,
        }}
      >
        {dotColor && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
              boxShadow: `0 0 6px ${dotColor}40`,
            }}
          />
        )}
        <span style={{ ...font.lg, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>

      {/* Body */}
      <div style={{ padding: `${sp[3]}px ${sp[5]}px` }}>{children}</div>
    </div>
  );
}
