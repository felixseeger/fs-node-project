# Task: Implement Global Asset Library

## Phases

- [ ] **Phase 1: Research & Strategy**
  - [ ] Understand `AssetNode.jsx` requirements for properties (e.g. `data.images`).
  - [ ] Understand how `GooeyNodesMenu.jsx` handles the "Assets" tab.
  - [ ] Plan Firebase structure for assets.

- [ ] **Phase 2: Create Firebase Services & Hooks**
  - [ ] Create `frontend/src/services/assetService.ts` to manage asset CRUD operations.
  - [ ] Create `frontend/src/hooks/useFirebaseAssets.ts` to sync user assets locally.

- [ ] **Phase 3: Connect Assets to the Editor**
  - [ ] Update `App.jsx` to load assets via `useFirebaseAssets`.
  - [ ] Pass `assets` to `GooeyNodesMenu.jsx`.
  - [ ] Update "Create Element" action in the context menu to also save the generated asset to Firebase.
  - [ ] Allow adding assets via dragging from the `GooeyNodesMenu` to the canvas.

- [ ] **Phase 4: Update GooeyNodesMenu UI**
  - [ ] Render the actual saved assets in the "Unorganized" or "Library" section instead of showing '0' static items.
  - [ ] Ensure drag-and-drop applies the correct defaults (`data.images`).

## Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Mimic templates structure | Use the same pattern as templates to maintain code consistency and ease of future maintenance. | 2026-04-08 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
