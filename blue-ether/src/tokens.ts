/**
 * Blue Ether - JS Design Tokens
 * These map directly to the CSS variables defined in src/tokens.css
 */

export const CATEGORY_COLORS = {
  imageGeneration: 'var(--be-category-imageGeneration)',
  imageEditing:    'var(--be-category-imageEditing)',
  videoGeneration: 'var(--be-category-videoGeneration)',
  videoEditing:    'var(--be-category-videoEditing)',
  vision:          'var(--be-category-vision)',
  utility:         'var(--be-category-utility)',
  input:           'var(--be-category-input)',
};

export const surface = {
  base:   'var(--be-surface-base)',
  sunken: 'var(--be-surface-sunken)',
  deep:   'var(--be-surface-deep)',
  raised: 'var(--be-surface-raised)',
  canvas: 'var(--be-surface-canvas)',
};

export const border = {
  subtle:  'var(--be-border-subtle)',
  default: 'var(--be-border-default)',
  hover:   'var(--be-border-hover)',
  active:  'var(--be-border-active)',
  input:   'var(--be-border-input)',
};

export const control = {
  pillInactiveBg:     'var(--be-control-pillInactiveBg)',
  pillInactiveBorder: 'var(--be-control-pillInactiveBorder)',
  pillInactiveText:   'var(--be-control-pillInactiveText)',
  pillHoverBg:        'var(--be-control-pillHoverBg)',
  pillHoverBorder:    'var(--be-control-pillHoverBorder)',
  toggleTrackOff:     'var(--be-control-toggleTrackOff)',
  toggleKnobOff:      'var(--be-control-toggleKnobOff)',
  toggleInsetShadow:  'var(--be-control-toggleInsetShadow)',
  knobShadow:         'var(--be-control-knobShadow)',
  sliderTrackInactive:'var(--be-control-sliderTrackInactive)',
  labelSoft:          'var(--be-control-labelSoft)',
};

export const text = {
  primary:   'var(--be-text-primary)',
  secondary: 'var(--be-text-secondary)',
  muted:     'var(--be-text-muted)',
  accent:    'var(--be-text-accent)',
  error:     'var(--be-text-error)',
  success:   'var(--be-text-success)',
};

export const ui = {
  link:        'var(--be-ui-link)',
  linkBg:      'var(--be-ui-linkBg)',
  linkBorder:  'var(--be-ui-linkBorder)',
  linkText:    'var(--be-ui-linkText)',
  error:       'var(--be-ui-error)',
  errorBg:     'var(--be-ui-errorBg)',
  errorBorder: 'var(--be-ui-errorBorder)',
};

// Spacing maps to numbers where possible for math, but we should use CSS vars directly for styles.
// We keep numeric values to maintain backward compatibility with dynamic styles that use 'sp[3] + "px"'.
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

export const font = {
  xs:  { fontSize: 'var(--be-font-size-xs)' },
  sm:  { fontSize: 'var(--be-font-size-sm)' },
  md:  { fontSize: 'var(--be-font-size-md)' },
  lg:  { fontSize: 'var(--be-font-size-lg)' },
  xl:  { fontSize: 'var(--be-font-size-xl)' },

  label:     { fontSize: 'var(--be-font-size-md)', fontWeight: 600, color: text.primary },
  sublabel:  { fontSize: 'var(--be-font-size-sm)', fontWeight: 600, color: text.secondary },
  body:      { fontSize: 'var(--be-font-size-sm)', color: text.primary },
  caption:   { fontSize: 'var(--be-font-size-sm)', color: text.secondary },
  micro:     { fontSize: 'var(--be-font-size-sm)', color: text.muted },
};

// We keep the numeric types for radius when possible for compatibility.
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  pill: 14,
  full: '50%',
};

export const inputStyle = {
  width: '100%',
  background: surface.sunken,
  border: `1px solid ${border.input}`,
  borderRadius: radius.md,
  color: text.primary,
  fontSize: 'var(--be-font-size-sm)',
  padding: `${sp[3]}px ${sp[4]}px`,
  outline: 'none',
  boxSizing: 'border-box' as const,
};

export const textareaStyle = {
  ...inputStyle,
  resize: 'vertical' as const,
};

export const settingsPanelStyle = {
  background: surface.sunken,
  borderRadius: radius.lg,
  border: `1px solid ${border.subtle}`,
  padding: `${sp[5]}px`,
  marginTop: `${sp[4]}px`,
};

export const settingsTitleStyle = {
  fontSize: 'var(--be-font-size-xs)',
  fontWeight: 600,
  color: text.primary,
  marginBottom: `${sp[4]}px`,
  textAlign: 'center' as const,
};

export const outputBoxStyle = {
  background: surface.sunken,
  borderRadius: radius.md,
  border: `1px solid ${border.subtle}`,
  position: 'relative' as const,
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
