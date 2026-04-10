# Node UI reference → local primitives mapping

This document maps **Node Banana** (reference app) UI concepts to **FS Node Project** implementations. Use it when aligning visuals or behavior without breaking graph/handle contracts.

## Contract (do not break)

- **Handle IDs and types** — `frontend/src/utils/handleTypes.js` remains the source of truth for connection semantics.
- **API payloads** — UI changes must not alter request bodies sent from nodes to the backend.

## Primitive mapping

| Reference (Node Banana) | Local implementation | Notes |
|-------------------------|----------------------|--------|
| `BaseNode` / card shell | `NodeShell.jsx` | Outer chrome, header strip, selection/error/executing states, resize/fold affordances. |
| Floating / compact header | `NodeShell` header row + top bars on specific nodes | Generation nodes may add a `paddingTop` bar for aspect ratio / lock; model selection belongs in **Inspector**. |
| Category accent / dot | `nodeTokens.js` → `CATEGORY_COLORS` + `NodeShell` `dotColor` | Keep accents consistent with node category. |
| Collapsible sections | `NodeSection.jsx` | Section headers, chevrons, body padding. |
| Pills, toggles, sliders, text areas | `NodeControls.jsx` (`Pill`, `Toggle`, `Slider`, `PromptInput`, `TextInput`, …) | Shared controls; prefer `nodeTokens` (`surface`, `border`, `text`, `control`) over one-off `rgba`. |
| Output preview + handles | `NodeOutput.jsx`, `OutputPreview`, `OutputHandle` (`shared.js` barrel) | Preview box, download/open, handle placement. |
| “Liquid glass” surfaces | `nodeTokens.js` → `surface`, `border`, `text` | Reference-aligned glass language; nodes should not hardcode competing grays. |
| Right-side property sheet | `InspectorPanel.jsx` (+ `NodePropertyEditor.jsx` where used) | **Source of truth** for model lists, auto/multi-model, pinning, provider grouping when applicable. |
| Model picker / provider tree | Inspector only | **Not** duplicated inside universal generator node bodies (removed legacy hidden menus). |

## Data flow

- Node `data.*` is still updated by the inspector (`data.onUpdate` / connection hooks).
- Nodes read `data.models`, `data.autoSelect`, etc., for **execution** (e.g. `Auto` → resolved model in `runGenerationModel` / `generateForModel`).

## Files to touch for visual parity

1. `frontend/src/nodes/nodeTokens.js` — tokens first.
2. `NodeShell.jsx`, `NodeControls.jsx`, `NodeSection.jsx`, `NodeOutput.jsx`.
3. `InspectorPanel.jsx` / `NodePropertyEditor.jsx` for configuration UX.
4. Individual nodes only in **rollout waves** after shared primitives stabilize.

## Rollout waves (per-node UI parity)

Apply changes **after** shared primitives and inspector are stable. Do not change handle IDs or API payloads.

### Wave A — Generation (image / video / audio)

- **Nodes:** Universal generators, dedicated generator nodes (image/video/audio outputs), music/SFX/voiceover where they use shared chrome.
- **Gate:** Visual check vs reference; connect inputs; run job; confirm `handleTypes` still validates; inspector edits persist on `data.*`.

### Wave B — Transform / edit

- **Nodes:** Upscale, expand, inpaint, relight, style transfer, remove background, video upscale/VFX, etc.
- **Gate:** Section layout uses `NodeSection` + tokens; no duplicate model/provider pickers if inspector owns them; execution unchanged.

### Wave C — Utility / router / comment

- **Nodes:** Router, response, comment, adapters, misc utilities.
- **Gate:** Readability, selection states, minimal custom CSS; keyboard/selection unchanged.

### Wave validation checklist (each wave)

1. `cd frontend && npm run lint` (or lint touched paths).
2. Create representative nodes, connect valid edges, single-select → inspector opens.
3. Edit a property in inspector; confirm canvas node reflects `data` and run still works.
4. No new hardcoded colors that bypass `nodeTokens` unless explicitly scoped.

## Verification

- Lint: `cd frontend && npm run lint`
- Smoke: create node, connect edges, open inspector, run generation, confirm handles and API behavior unchanged.
