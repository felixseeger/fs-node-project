import { text, surface, border, radius, sp, font } from './nodeTokens';

/**
 * Pill-style toggle button for option selection.
 * Replaces the duplicated pill() helper across all nodes.
 */
export function Pill({ label, isActive, onClick, accentColor = '#14b8a6' }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        flex: 1,
        padding: `${sp[1]}px 0`,
        fontSize: 11,
        fontWeight: isActive ? 600 : 400,
        borderRadius: radius.md,
        cursor: 'pointer',
        background: isActive ? accentColor : surface.sunken,
        color: isActive ? '#fff' : text.secondary,
        border: `1px solid ${isActive ? accentColor : border.subtle}`,
        transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  );
}

/**
 * Toggle switch (boolean on/off).
 * Replaces the duplicated toggle() helper across all nodes.
 */
export function Toggle({ label, value, onChange, accentColor = '#14b8a6' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: sp[2], padding: `${sp[1]}px 0`,
    }}>
      <span style={font.sm}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
        style={{
          width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: value ? accentColor : surface.raised, position: 'relative',
          transition: 'background 0.15s',
        }}
      >
        <span style={{
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: value ? 19 : 3, transition: 'left 0.15s',
        }} />
      </button>
    </div>
  );
}

/**
 * Labeled slider with min/max labels and value display.
 * Replaces the duplicated slider patterns across all nodes.
 */
export function Slider({
  label, value, onChange,
  min = 0, max = 100, step = 1,
  minLabel, maxLabel, unit = '',
  accentColor = '#14b8a6',
}) {
  return (
    <div style={{ marginBottom: sp[3] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp[1] }}>
        <span style={font.sm}>{label}</span>
        <span style={{ ...font.sm, color: text.primary, fontWeight: 600 }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: sp[3] }}>
        <span style={{ ...font.xs, color: text.muted, minWidth: 18, textAlign: 'right' }}>
          {minLabel ?? min}
        </span>
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          style={{ flex: 1, accentColor }}
        />
        <span style={{ ...font.xs, color: text.muted, minWidth: 18 }}>
          {maxLabel ?? max}
        </span>
      </div>
    </div>
  );
}

/**
 * Direction slider (for expand nodes).
 */
export function DirectionSlider({ label, value, onChange, max = 2048, step = 64, accentColor = '#f97316' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: sp[2], marginBottom: sp[1] }}>
      <span style={{ fontSize: 10, color: text.secondary, width: 40, textAlign: 'right', flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="range" min={0} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} expansion`}
        style={{ flex: 1, accentColor }}
      />
      <span style={{ fontSize: 10, color: text.primary, fontWeight: 600, width: 44, textAlign: 'right', flexShrink: 0 }}>
        {value}px
      </span>
    </div>
  );
}

/**
 * Prompt textarea with consistent styling.
 */
export function PromptInput({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: surface.sunken, border: `1px solid ${border.input}`,
        borderRadius: radius.md, color: text.primary, fontSize: 12, padding: sp[3],
        resize: 'vertical', outline: 'none', boxSizing: 'border-box',
      }}
    />
  );
}

/**
 * Simple text input.
 */
export function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: surface.sunken, border: `1px solid ${border.input}`,
        borderRadius: radius.md, color: text.primary, fontSize: 11,
        padding: `${sp[2]}px ${sp[3]}px`,
        outline: 'none', boxSizing: 'border-box',
      }}
    />
  );
}

/**
 * Settings panel container with title.
 */
export function SettingsPanel({ title, children }) {
  return (
    <div style={{
      background: surface.sunken, borderRadius: radius.lg, border: `1px solid ${border.subtle}`,
      padding: sp[5], marginTop: sp[4],
    }}>
      {title && (
        <div style={{ fontSize: 11, fontWeight: 600, color: text.primary, marginBottom: sp[4], textAlign: 'center' }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Setting row with label and pills.
 */
export function PillGroup({ label, options, value, onChange, accentColor }) {
  return (
    <div style={{ marginBottom: sp[4] }}>
      {label && <div style={{ ...font.sm, marginBottom: sp[2] }}>{label}</div>}
      <div style={{ display: 'flex', gap: sp[1] }}>
        {options.map((opt) => (
          <Pill
            key={typeof opt === 'string' ? opt : opt.value}
            label={typeof opt === 'string' ? opt : opt.label}
            isActive={value === (typeof opt === 'string' ? opt : opt.value)}
            onClick={() => onChange(typeof opt === 'string' ? opt : opt.value)}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}
