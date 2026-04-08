# Task: Harden Testing Setup and Validate All Nodes

## Phases

- [ ] **Phase 1: Research & Setup Framework**
  - [ ] Check dependencies, ensure `@playwright/test` is installed.
  - [ ] Set up `playwright.config.ts` for structured E2E testing (retries, timeouts, reporters).
  - [ ] Organize test directory (`frontend/tests/e2e`).

- [ ] **Phase 2: Build Robust Test Helpers**
  - [ ] Create a reusable authentication/login routine (global setup or fixture).
  - [ ] Create helpers to reliably bypass the "ENGAGE" screen and navigate the new dashboard ("New board" -> "Blank Canvas").
  - [ ] Build a robust `addNode` helper using the keyboard shortcuts or menu.

- [ ] **Phase 3: Write Comprehensive Node Tests**
  - [ ] Test 1: Node Instantiation - Verify all nodes can be placed on the canvas without crashing.
  - [ ] Test 2: TextElementNode - Verify double-click to edit, typing, and blurring saves the text.
  - [ ] Test 3: AssetNode - Verify creation and property updates.
  - [ ] Clean up all the old scattered `.js` and `.mjs` test scripts from the root and `frontend/` folders.

- [ ] **Phase 4: Run and Fix Node Issues**
  - [ ] Run the tests.
  - [ ] If any nodes fail to render or interact properly, fix them.

## Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Migrate from raw `playwright` library to `@playwright/test` | Raw node scripts are brittle, lack auto-waiting fixtures, trace viewing, and global setup features necessary for a "hardened" setup. | 2026-04-08 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
