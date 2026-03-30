/**
 * Design tokens for the node system.
 * Single source of truth for colors, spacing, typography, and borders.
 */

// ── Category accent colors ──
export const CATEGORY_COLORS = {
  imageGeneration: '#f97316',  // Orange — generators, reimagine
  imageEditing:    '#f97316',  // Orange — upscale, expand, relight, etc.
  videoGeneration: '#14b8a6',  // Teal — all video gen nodes
  videoEditing:    '#14b8a6',  // Teal — VFX
  vision:          '#0ea5e9',  // Blue — image analyzer
  utility:         '#8b5cf6',  // Purple — response, adapted prompt
  input:           '#6b7280',  // Gray — input, text, image source nodes
};

// ── Surface colors ──
export const surface = {
  base:   '#2a2a2a',  // Node background
  sunken: '#1a1a1a',  // Inputs, panels, output boxes
  deep:   '#111111',  // Nested containers, summary bars
  raised: '#333333',  // Elevated elements
  canvas: '#1a1a1a',  // Page/canvas background
};

// ── Border colors ──
export const border = {
  subtle:   '#3a3a3a',  // Default borders
  hover:    '#4a4a4a',  // Hover state borders
  active:   '#3b82f6',  // Selected/focus borders
  input:    '#3a3a3a',  // Form input borders
};

// ── Text colors ──
export const text = {
  primary:   '#e0e0e0',  // Main text, labels
  secondary: '#999999',  // Descriptions, sublabels
  muted:     '#555555',  // Placeholders, disabled
  accent:    '#3b82f6',  // Links, linked badges
  error:     '#ef4444',  // Error messages
  success:   '#22c55e',  // Success indicators
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
