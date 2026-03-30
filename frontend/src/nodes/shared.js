/**
 * Barrel export for all shared node infrastructure.
 *
 * Usage:
 *   import { SectionHeader, LinkedBadges, ConnectionInfo, ConnectedOrLocal } from './shared';
 *   import { Pill, Toggle, Slider, PromptInput, SettingsPanel, PillGroup } from './shared';
 *   import { OutputHandle, OutputPreview, SecondaryOutputHandle } from './shared';
 *   import { surface, border, text, sp, radius, font, ... } from './shared';
 */

// Design tokens
export {
  CATEGORY_COLORS,
  surface, border, text, ui, sp, radius, font,
  inputStyle, textareaStyle, settingsPanelStyle, settingsTitleStyle,
  outputBoxStyle, summaryRowStyle,
} from './nodeTokens';

// Section & connection components
export {
  SectionHeader,
  LinkedBadges,
  ConnectionInfo,
  ConnectedOrLocal,
} from './NodeSection';

// Control components
export {
  Pill,
  Toggle,
  Slider,
  DirectionSlider,
  PromptInput,
  TextInput,
  SettingsPanel,
  PillGroup,
} from './NodeControls';

// Output components
export {
  OutputHandle,
  SecondaryOutputHandle,
  OutputPreview,
} from './NodeOutput';

// Hooks
export { default as useNodeConnections } from './useNodeConnections';
export { default as useNodeExecution } from './useNodeExecution';

// Utility: strip base64 data URI prefix
export function stripBase64Prefix(str) {
  if (!str) return str;
  if (str.startsWith('data:')) return str.split(',')[1];
  return str;
}
