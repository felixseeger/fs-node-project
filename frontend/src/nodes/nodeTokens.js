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
  hover:    'rgba(255, 255, 255, 0.25)',
  active:   '#5ee7df',                 // Aqua focus
  input:    'rgba(255, 255, 255, 0.12)',
};

// ── Text colors ──
export const text = {
  primary:   '#ffffff',
  secondary: 'rgba(255, 255, 255, 0.55)',
  muted:     'rgba(255, 255, 255, 0.35)',
  accent:    '#5ee7df',
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

// ── Spacing scale (4px base) ──
export const sp = {
  0: 0,
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
};

// ── Typography ──
export const font = {
  xs:  { fontSize: 9 },
  sm:  { fontSize: 11 },
  md:  { fontSize: 12 },
  lg:  { fontSize: 13 },
  xl:  { fontSize: 16 },

  label:     { fontSize: 12, fontWeight: 600, color: text.primary },
  sublabel:  { fontSize: 11, fontWeight: 600, color: text.secondary },
  body:      { fontSize: 12, color: text.primary },
  caption:   { fontSize: 10, color: text.secondary },
  micro:     { fontSize: 9, color: text.muted },
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
