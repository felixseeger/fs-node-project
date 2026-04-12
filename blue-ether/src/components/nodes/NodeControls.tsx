import type { ReactNode } from "react";

export interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  accentColor?: string;
}

export function Pill({ label, isActive, onClick, accentColor = '#5ee7df' }: PillProps) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="nodrag nopan"
      aria-pressed={isActive}
      style={{
        flex: 1,
        padding: '8px 4px',
        fontSize: 'var(--be-font-size-xs, 11px)',
        fontWeight: 600,
        borderRadius: 'var(--be-radius-md)',
        cursor: 'pointer',
        background: isActive ? accentColor : 'var(--be-control-pillInactiveBg)',
        color: isActive ? '#000' : 'var(--be-control-pillInactiveText)',
        border: `1px solid ${isActive ? accentColor : 'var(--be-control-pillInactiveBorder)'}`,
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: isActive ? `0 0 16px ${accentColor}40` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--be-control-pillHoverBg)';
          e.currentTarget.style.borderColor = 'var(--be-control-pillHoverBorder)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--be-control-pillInactiveBg)';
          e.currentTarget.style.borderColor = 'var(--be-control-pillInactiveBorder)';
        }
      }}
    >
      {label}
    </button>
  );
}

export interface ToggleProps {
  label?: string;
  value?: boolean;
  checked?: boolean;
  onChange: (value: boolean) => void;
  accentColor?: string;
  plain?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ label, value, checked, onChange, accentColor = '#5ee7df', plain = false, size = 'md' }: ToggleProps) {
  const isChecked = checked !== undefined ? checked : value;
  const width = size === 'sm' ? 24 : 32;
  const height = size === 'sm' ? 14 : 18;
  const circleSize = size === 'sm' ? 10 : 12;
  const circleTop = size === 'sm' ? 2 : 3;
  const circleLeft = isChecked ? (size === 'sm' ? 12 : 17) : (size === 'sm' ? 2 : 3);

  const toggleBtn = (
    <button
      onClick={() => onChange(!isChecked)}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="nodrag nopan"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      style={{
        width, height, borderRadius: height / 2, border: 'none', cursor: 'pointer',
        background: isChecked ? accentColor : 'var(--be-control-toggleTrackOff)', position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isChecked ? `0 0 12px ${accentColor}40` : 'var(--be-control-toggleInsetShadow)',
      }}
    >
      <span style={{
        width: circleSize, height: circleSize, borderRadius: '50%',
        background: isChecked ? '#000' : 'var(--be-control-toggleKnobOff)',
        position: 'absolute', top: circleTop, left: circleLeft,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: 'var(--be-control-knobShadow)',
      }} />
    </button>
  );

  if (plain) return toggleBtn;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--be-space-sm)' }}>
      <span style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-secondary)' }}>{label}</span>
      {toggleBtn}
    </div>
  );
}

export interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (val: number) => string;
  accentColor?: string;
  width?: string;
}

export function Slider({
  label, value, onChange, min, max, step,
  formatValue = (v) => v.toString(),
  accentColor = '#5ee7df',
  width = '100%',
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={{ marginBottom: 'var(--be-space-sm)', width }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--be-space-1, 4px)' }}>
        <span style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-control-labelSoft)' }}>{label}</span>
        <span style={{ fontSize: 'var(--be-font-size-xs, 12px)', color: 'var(--be-text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>
          {formatValue(value)}
        </span>
      </div>
      <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 4,
          background: 'var(--be-control-sliderTrackInactive)', borderRadius: 2,
        }} />
        <div style={{
          position: 'absolute', left: 0, height: 4, width: `${percent}%`,
          background: accentColor, borderRadius: 2,
          boxShadow: `0 0 8px ${accentColor}40`,
        }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="nodrag nopan"
          style={{
            position: 'absolute', width: '100%', opacity: 0, cursor: 'pointer',
            margin: 0, height: '100%'
          }}
        />
        <div style={{
          position: 'absolute', left: `calc(${percent}% - 6px)`,
          width: 12, height: 12, borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--be-control-knobShadow)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

export interface PillGroupProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  accentColor?: string;
}

export function PillGroup({ options, value, onChange, accentColor }: PillGroupProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--be-space-sm)', marginBottom: 'var(--be-space-sm)' }}>
      {options.map((opt) => (
        <Pill
          key={opt.id}
          label={opt.label}
          isActive={value === opt.id}
          onClick={() => onChange(opt.id)}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextInput({ label, value, onChange, placeholder, multiline, rows = 3 }: TextInputProps) {
  return (
    <div style={{ marginBottom: 'var(--be-space-sm)' }}>
      <label style={{
        display: 'block', fontSize: 'var(--be-font-size-xs, 12px)',
        color: 'var(--be-text-secondary)', marginBottom: 'var(--be-space-1, 4px)'
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className="nodrag nopan"
          rows={rows}
          style={{
            width: '100%', background: 'var(--be-surface-sunken)',
            border: `1px solid var(--be-border-input)`, borderRadius: 'var(--be-radius-md)',
            color: 'var(--be-text-primary)', fontSize: 'var(--be-font-size-xs, 12px)',
            padding: `var(--be-space-sm) var(--be-space-md)`, outline: 'none',
            boxSizing: 'border-box', resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className="nodrag nopan"
          style={{
            width: '100%', background: 'var(--be-surface-sunken)',
            border: `1px solid var(--be-border-input)`, borderRadius: 'var(--be-radius-md)',
            color: 'var(--be-text-primary)', fontSize: 'var(--be-font-size-xs, 12px)',
            padding: `var(--be-space-sm) var(--be-space-md)`, outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
      )}
    </div>
  );
}

export interface SettingsPanelProps {
  expanded: boolean;
  children: ReactNode;
}

export function SettingsPanel({ expanded, children }: SettingsPanelProps) {
  if (!expanded) return null;
  return (
    <div style={{
      background: 'var(--be-surface-sunken)',
      borderRadius: 'var(--be-radius-lg)',
      border: `1px solid var(--be-border-subtle)`,
      padding: 'var(--be-space-lg)',
      marginTop: 'var(--be-space-md)',
    }}>
      <div style={{
        fontSize: 'var(--be-font-size-xs, 11px)', fontWeight: 600, color: 'var(--be-text-primary)',
        marginBottom: 'var(--be-space-md)', textAlign: 'center'
      }}>
        ADVANCED SETTINGS
      </div>
      {children}
    </div>
  );
}
