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
export default function NodeShell({ label, dotColor, selected, children, onDisconnect, onEdit }) {
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
          justifyContent: 'space-between',
          padding: `${sp[3]}px ${sp[5]}px`,
          borderBottom: `1px solid ${border.subtle}`,
          background: `linear-gradient(90deg, ${accentAlpha}, transparent)`,
          borderRadius: `${radius.lg - 1}px ${radius.lg - 1}px 0 0`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
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

        
        <div style={{ display: 'flex', gap: 4 }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit Element"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: 14,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
          {onDisconnect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect();
            }}
            title="Disconnect all connections"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: 14,
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.84 9.42l-1.42 1.42a4 4 0 1 1-5.66-5.66l1.42-1.42"></path>
              <path d="M5.16 14.58l1.42-1.42a4 4 0 0 1 5.66 5.66l-1.42 1.42"></path>
              <line x1="8" y1="16" x2="16" y2="8"></line>
            </svg>
          </button>
        )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${sp[3]}px ${sp[5]}px` }}>{children}</div>
    </div>
  );
}
