# Architect Brief - Phase 8.2

## Step 1 — Task 8.2.1: Settings Panels
- Implement expandable/collapsible settings panels for nodes using the `BaseNode` foundation.
- Use `framer-motion` for smooth 160ms transitions.
- Add panel height tracking and persistence in node data.
- Implement a rapid toggling prevention mechanism (debounce/throttle).
- Create a generic `SettingsPanel` wrapper and specific settings components for each node type.
- Ensure keyboard navigation (Enter/Space to toggle) is implemented.
- Flag: Do not break existing `BaseNode` resize functionality.
- Flag: Ensure settings panels do not overlap with handles or execution indicators.
