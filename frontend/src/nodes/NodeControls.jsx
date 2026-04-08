import { useRef, useEffect } from 'react';
import { text, surface, border, radius, sp, font } from './nodeTokens';

/**
 * Pill-style toggle button for option selection.
 * Replaces the duplicated pill() helper across all nodes.
 */
export function Pill({ label, isActive, onClick, accentColor = '#5ee7df' }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        flex: 1,
        padding: '8px 4px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: radius.md,
        cursor: 'pointer',
        background: isActive ? accentColor : 'rgba(255, 255, 255, 0.03)',
        color: isActive ? '#000' : 'rgba(255, 255, 255, 0.4)',
        border: `1px solid ${isActive ? accentColor : 'rgba(255, 255, 255, 0.08)'}`,
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: isActive ? `0 0 16px ${accentColor}40` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }
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
export function Toggle({ label, value, checked, onChange, accentColor = '#5ee7df', plain = false, size = 'md' }) {
  const isChecked = checked !== undefined ? checked : value;
  const width = size === 'sm' ? 24 : 32;
  const height = size === 'sm' ? 14 : 18;
  const circleSize = size === 'sm' ? 10 : 12;
  const circleTop = size === 'sm' ? 2 : 3;
  const circleLeft = isChecked ? (size === 'sm' ? 12 : 17) : (size === 'sm' ? 2 : 3);

  const toggleBtn = (
    <button
      onClick={() => onChange(!isChecked)}
      onMouseDown={e => e.stopPropagation()}
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      style={{
        width, height, borderRadius: height / 2, border: 'none', cursor: 'pointer',
        background: isChecked ? accentColor : 'rgba(255, 255, 255, 0.1)', position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isChecked ? `0 0 12px ${accentColor}40` : 'inset 0 1px 4px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{
        width: circleSize, height: circleSize, borderRadius: '50%',
        background: isChecked ? '#000' : 'rgba(255,255,255,0.4)',
        position: 'absolute', top: circleTop, left: circleLeft,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );

  if (plain) return toggleBtn;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: sp[3], padding: '4px 0', width: '100%',
    }}>
      {label && <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{label}</span>}
      {toggleBtn}
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
  accentColor = '#5ee7df',
}) {
  return (
    <div style={{ marginBottom: sp[4] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontSize: 12, color: accentColor, fontWeight: 700 }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="liquid-slider"
          style={{ 
            flex: 1, 
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${accentColor} ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) ${(value - min) / (max - min) * 100}%)`,
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: surface.sunken, border: `1px solid ${border.input}`,
        borderRadius: radius.md, color: text.primary, fontSize: 12, padding: sp[3],
        resize: 'none', outline: 'none', boxSizing: 'border-box', overflow: 'hidden'
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
