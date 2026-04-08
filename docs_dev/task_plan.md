# Task: Implement Firebase Templates and Inject into NodesMenu

## Phases

- [ ] **Phase 1: Research & Strategy**
  - [ ] Understand `useFirebaseWorkflows.ts` to see how it interacts with Firebase.
  - [ ] Check how `GooeyNodesMenu.jsx` and `NODE_MENU` render categories and items.
  - [ ] Understand how custom nodes (like templates) can be instantiated on the canvas.

- [ ] **Phase 2: Update Firebase Hooks**
  - [ ] Update or create a new hook (`useFirebaseTemplates`) to sync templates with a `templates` collection in Firestore.
  - [ ] Modify `TemplateBuilderModal` to use the Firebase save function instead of `templateStore.js` (or use it in addition to local storage).

- [ ] **Phase 3: Inject Templates into NodesMenu**
  - [ ] In `App.jsx`, fetch the saved templates.
  - [ ] Dynamically append a "Templates" or "My Workflows" category to `NODE_MENU`.
  - [ ] Create a `WorkflowNode` or reuse the existing node wrapper so that when dragged onto the canvas, the template operates properly.

- [ ] **Phase 4: Handle Template Instantiation**
  - [ ] Update `App.jsx` `onDrop` or `addNode` logic so that when a template is added from the menu, it generates the encapsulated nodes (or a specialized `WorkflowNode`).

## Decisions
| Decision | Rationale | Date |
|----------|-----------|------|

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
