import { useRef, useEffect, useState, type ReactNode } from 'react';
import { text, surface, border, radius, sp, font, control } from './nodeTokens';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Pill-style toggle button for option selection.
 * Replaces the duplicated pill() helper across all nodes.
 */
interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  accentColor?: string;
}

export function Pill({ label, isActive, onClick, accentColor = '#5ee7df' }: PillProps) {
  return (
    <button
      onClick={onClick}
      className="nodrag nopan"
      aria-pressed={isActive}
      style={{
        flex: 1,
        padding: '8px 4px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: radius.md,
        cursor: 'pointer',
        background: isActive ? accentColor : control.pillInactiveBg,
        color: isActive ? '#000' : control.pillInactiveText,
        border: `1px solid ${isActive ? accentColor : control.pillInactiveBorder}`,
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: isActive ? `0 0 16px ${accentColor}40` : 'none',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isActive) {
          e.currentTarget.style.background = control.pillHoverBg;
          e.currentTarget.style.borderColor = control.pillHoverBorder;
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isActive) {
          e.currentTarget.style.background = control.pillInactiveBg;
          e.currentTarget.style.borderColor = control.pillInactiveBorder;
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
interface ToggleProps {
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
      className="nodrag nopan"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      style={{
        width, height, borderRadius: height / 2, border: 'none', cursor: 'pointer',
        background: isChecked ? accentColor : control.toggleTrackOff, position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isChecked ? `0 0 12px ${accentColor}40` : control.toggleInsetShadow,
      }}
    >
      <span style={{
        width: circleSize, height: circleSize, borderRadius: '50%',
        background: isChecked ? '#000' : control.toggleKnobOff,
        position: 'absolute', top: circleTop, left: circleLeft,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: control.knobShadow,
      }} />
    </button>
  );

  if (plain) return toggleBtn;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: sp[3], padding: '4px 0', width: '100%',
    }}>
      {label && <span style={{ fontSize: 12, fontWeight: 500, color: control.labelSoft }}>{label}</span>}
      {toggleBtn}
    </div>
  );
}

/**
 * Labeled slider with min/max labels and value display.
 * Replaces the duplicated slider patterns across all nodes.
 */
interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
  accentColor?: string;
}

export function Slider({
  label, value, onChange,
  min = 0, max = 100, step = 1,
  minLabel: _minLabel,
  maxLabel: _maxLabel,
  unit = '',
  accentColor = '#5ee7df',
}: SliderProps) {
  return (
    <div style={{ marginBottom: sp[4] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: control.labelSoft }}>{label}</span>
        <span style={{ fontSize: 12, color: accentColor, fontWeight: 700 }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          className="nodrag nopan"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          
          style={{ 
            flex: 1, 
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${accentColor} ${(value - min) / (max - min) * 100}%, ${control.sliderTrackInactive} ${(value - min) / (max - min) * 100}%)`,
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
interface DirectionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  accentColor?: string;
}

export function DirectionSlider({ label, value, onChange, max = 2048, step = 64, accentColor = '#f97316' }: DirectionSliderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: sp[2], marginBottom: sp[1] }}>
      <span style={{ fontSize: 10, color: text.secondary, width: 40, textAlign: 'right', flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="range" min={0} max={max} step={step} value={value}
        className="nodrag nopan"
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
interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function PromptInput({ value, onChange, placeholder, rows = 3 }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="nodrag nopan"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: surface.sunken, border: `1px solid ${border.input}`,
        borderRadius: radius.md, color: text.primary, fontSize: 12, padding: sp[3],
        resize: 'none', outline: 'none', boxSizing: 'border-box', overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = border.active;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${border.active}33`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = border.input;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

/**
 * Simple text input.
 */
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextInput({ value, onChange, placeholder, type = 'text' }: TextInputProps) {
  return (
    <input
      type={type}
      className="nodrag nopan"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: surface.sunken, border: `1px solid ${border.input}`,
        borderRadius: radius.md, color: text.primary, fontSize: 11,
        padding: `${sp[2]}px ${sp[3]}px`,
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = border.active;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${border.active}33`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = border.input;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

/**
 * Settings panel container with title.
 */
interface SettingsPanelProps {
  title?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function SettingsPanel({ title, children, defaultExpanded = false }: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div style={{
      background: surface.sunken, borderRadius: radius.lg, border: `1px solid ${border.subtle}`,
      padding: sp[5], marginTop: sp[4],
    }}>
      {title && (
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            color: text.primary, 
            marginBottom: isExpanded ? sp[4] : 0, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'margin 0.16s ease'
          }}
        >
          <span>{title}</span>
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.16 }}
            style={{ display: 'flex' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>
      )}
      <AnimatePresence initial={false}>
        {(!title || isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: title ? sp[2] : 0 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Setting row with label and pills.
 */
interface PillGroupProps<T> {
  label?: string;
  options: (string | { value: T; label: string })[];
  value: T;
  onChange: (value: T) => void;
  accentColor?: string;
}

export function PillGroup<T>({ label, options, value, onChange, accentColor }: PillGroupProps<T>) {
  return (
    <div style={{ marginBottom: sp[4] }}>
      {label && <div style={{ ...font.sm, marginBottom: sp[2] }}>{label}</div>}
      <div style={{ display: 'flex', gap: sp[1] }}>
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <Pill
              key={String(optValue)}
              label={optLabel}
              isActive={value === optValue}
              onClick={() => onChange(optValue as T)}
              accentColor={accentColor}
            />
          );
        })}
      </div>
    </div>
  );
}
