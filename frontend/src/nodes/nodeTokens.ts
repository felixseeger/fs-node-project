/**
 * Design tokens for the node system.
 * Single source of truth for colors, spacing, typography, and borders.
 */

// ── Category accent colors ──
export const CATEGORY_COLORS = {
  imageGeneration: '#ffd27f',  // Amber
  imageEditing:    '#ffd27f',  // Amber
  videoGeneration: '#5ee7df',  // Aqua
  videoEditing:    '#5ee7df',  // Aqua
  vision:          '#b490f5',  // Violet
  utility:         '#3b82f6',  // Blue
  input:           'rgba(255, 255, 255, 0.35)', // Subtle
};

// ── Surface colors ──
export const surface = {
  base:   'rgba(255, 255, 255, 0.08)', // Liquid Glass base
  sunken: 'rgba(0, 0, 0, 0.2)',        // Darkened glass
  deep:   'rgba(0, 0, 0, 0.4)',        // Deeper glass
  raised: 'rgba(255, 255, 255, 0.15)', // Raised glass
  canvas: '#0b0e1a',                   // App background
};

// ── Border colors ──
export const border = {
  subtle:   'rgba(255, 255, 255, 0.12)',
  default:  'rgba(255, 255, 255, 0.16)', // Node cards, menus, compact chrome (reference parity)
  hover:    'rgba(255, 255, 255, 0.25)',
  active:   '#3b82f6',                 // Matches --color-accent (app chrome / focus)
  input:    'rgba(255, 255, 255, 0.12)',
};

// ── Shared control chrome (pills, toggles, sliders) — use instead of inline rgba in NodeControls ──
export const control = {
  pillInactiveBg:     'rgba(255, 255, 255, 0.03)',
  pillInactiveBorder: 'rgba(255, 255, 255, 0.08)',
  pillInactiveText:   'rgba(255, 255, 255, 0.4)',
  pillHoverBg:        'rgba(255, 255, 255, 0.06)',
  pillHoverBorder:    'rgba(255, 255, 255, 0.15)',
  toggleTrackOff:     'rgba(255, 255, 255, 0.1)',
  toggleKnobOff:      'rgba(255, 255, 255, 0.4)',
  toggleInsetShadow:  'inset 0 1px 4px rgba(0, 0, 0, 0.2)',
  knobShadow:         '0 2px 4px rgba(0, 0, 0, 0.2)',
  sliderTrackInactive:'rgba(255, 255, 255, 0.1)',
  labelSoft:          'rgba(255, 255, 255, 0.7)',
};

// ── Text colors ──
export const text = {
  primary:   '#ffffff',
  secondary: 'rgba(255, 255, 255, 0.55)',
  muted:     'rgba(255, 255, 255, 0.35)',
  accent:    '#3b82f6',                // Matches --color-accent
  error:     '#f87171',
  success:   '#a8f08a',
};

// ── Semantic UI colors ──
export const ui = {
  link:        '#3b82f6',
  linkBg:      'rgba(59,130,246,0.1)',
  linkBorder:  'rgba(59,130,246,0.25)',
  linkText:    '#93b4f5',
  error:       '#ef4444',
  errorBg:     'rgba(239,68,68,0.15)',
  errorBorder: 'rgba(239,68,68,0.3)',
};

// ── Spacing scale: linear 4px steps (sp[n] = n × 4 for n ≤ 8) ──
export const sp = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
};

// ── Typography (≥12px for UI text where practical; WCAG-friendly body minimum) ──
export const font = {
  xs:  { fontSize: 12 },
  sm:  { fontSize: 12 },
  md:  { fontSize: 13 },
  lg:  { fontSize: 14 },
  xl:  { fontSize: 16 },

  label:     { fontSize: 13, fontWeight: 600, color: text.primary },
  sublabel:  { fontSize: 12, fontWeight: 600, color: text.secondary },
  body:      { fontSize: 12, color: text.primary },
  caption:   { fontSize: 12, color: text.secondary },
  micro:     { fontSize: 12, color: text.muted },
};

// ── Border radius ──
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  pill: 14,
  full: '50%',
};

// ── Shared style fragments (reusable inline style objects) ──

export const inputStyle = {
  width: '100%',
  background: surface.sunken,
  border: `1px solid ${border.input}`,
  borderRadius: radius.md,
  color: text.primary,
  fontSize: 12,
  padding: `${sp[3]}px ${sp[4]}px`,
  outline: 'none',
  boxSizing: 'border-box',
};

export const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

export const settingsPanelStyle = {
  background: surface.sunken,
  borderRadius: radius.lg,
  border: `1px solid ${border.subtle}`,
  padding: sp[5],
  marginTop: sp[4],
};

export const settingsTitleStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: text.primary,
  marginBottom: sp[4],
  textAlign: 'center',
};

export const outputBoxStyle = {
  background: surface.sunken,
  borderRadius: radius.md,
  border: `1px solid ${border.subtle}`,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

export const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${sp[2]}px ${sp[3]}px`,
  background: surface.deep,
  borderRadius: radius.md,
};
