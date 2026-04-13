# Task: Harden Testing Setup and Validate All Nodes

## Phases

- [x] **Phase 1: Research & Setup Framework**
  - [x] Check dependencies, ensure `@playwright/test` is installed.
  - [x] Set up `playwright.config.ts` for structured E2E testing (retries, timeouts, reporters).
  - [x] Organize test directory (`frontend/tests/e2e`).

- [x] **Phase 2: Build Robust Test Helpers**
  - [x] Create a reusable authentication/login routine (global setup or fixture).
  - [x] Create helpers to reliably bypass the "ENGAGE" screen and navigate the new dashboard ("New board" -> "Blank Canvas").
  - [x] Build a robust `addNode` helper using the keyboard shortcuts or menu.

- [x] **Phase 3: Write Comprehensive Node Tests**
  - [x] Test 1: Node Instantiation - Verify all nodes can be placed on the canvas without crashing.
  - [x] Test 2: TextElementNode - Verify double-click to edit, typing, and blurring saves the text.
  - [x] Test 3: AssetNode - Verify creation and property updates.
  - [x] Clean up all the old scattered `.js` and `.mjs` test scripts from the root and `frontend/` folders.

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
