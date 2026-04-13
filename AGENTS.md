# Agent Guidelines & Project Organization

To keep the root folder clean and organized, all agents MUST follow these rules for file management and artifact storage.

## 1. Directory Structure for Artifacts

- **Testing Files:** Place all test scripts, reproduction scripts, and validation tools in the `tests/` directory.
- **Test Results:** Save all test outputs, coverage reports, logs, and screenshots in the `test-results/` directory.
- **General Output:** Save generated assets, images, or data exports in the `output/` directory (or specialized folders like `nanobanana-output/`).
- **Development Scripts:** Place all one-off patches, migration scripts, and maintenance tools in `scripts/patches/`.
- **Documentation:**
  - Technical specs and architecture docs should reside in `docs/`.
  - Temporary development findings, progress logs, and task plans should reside in `docs_dev/`.
  - Project-level mandates (like this file) stay in the root or `.agents/`.

## 2. Root Folder Maintenance

- **Minimalist Root:** Do not create new files in the root unless they are essential project-wide configuration files (e.g., `.env`, `package.json`, `firebase.json`).
- **Cleanup:** Always delete temporary files created during a session. If a file is worth keeping but doesn't belong in the root, move it to the appropriate subdirectory.
- **Proactive Organization:** When identifying disorganized files in the root (e.g., stray `.js` scripts or `.md` logs), move them to their designated folders.

## 3. Workflow Standards

- **Research First:** Always check `docs_dev/` and `knowledgebase/` for existing context before proposing changes.
- **Validation:** Every implementation task must include a validation step with results saved to `test-results/`.
- **Handoffs:** Use `handoff/` for session-to-session context preservation.
