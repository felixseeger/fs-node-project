
  1. New Component: CommandPalette.tsx
  We will create a new global overlay component, similar to Spotlight or Raycast.
   * Trigger: It will listen to a custom window event (open-command-palette), which App.tsx will dispatch when
     Cmd/Ctrl + K is pressed.
   * UI Layout:
       * A centered modal with a blurred, darkened backdrop.
       * A large, borderless search input field at the top, auto-focused.
       * A scrollable list of categorized results below the input.
   * Keyboard Navigation:
       * ArrowUp and ArrowDown to change the highlighted/focused item.
       * Enter to select and execute the highlighted item.
       * Escape to dismiss the palette.

  2. Search Categories & Data Sources
  We will aggregate data from existing configuration files to populate four distinct groups:

   * Commands:
       * Items: "Run Workflow", "Clear Canvas", "Fit View", "Export to JSON", "Export Screenshot", "Project
         Settings", "Open History".
       * Action: Executes the respective top-level function passed down from App.tsx.
   * Nodes:
       * Source: Flattens the NODE_MENU exported from src/config/nodeMenu.ts.
       * Items: "Add Text", "Add Image Analyzer", "Add Tripo3D", etc.
       * Action: Calls onAddNode(type, defaults) to spawn the node in the center of the viewport.
   * Models:
       * Source: Iterates over IMAGE_UNIVERSAL_MODEL_DEFS and VIDEO_UNIVERSAL_MODEL_DEFS.
       * Items: "Model: Nano Banana 2", "Model: Kling3", "Model: Recraft V4".
       * Action: Automatically adds a universalGeneratorImage or universalGeneratorVideo node pre-configured with the
         selected model active.
   * Tools:
       * Source: The "Utilities" section from NODE_MENU.
       * Items: "Add Layer Editor", "Add Router", "Add Comment".

  3. Filtering & Rendering
   * When the user types, it will perform a case-insensitive search across item titles, descriptions, and category
     tags.
   * Results will be grouped by their category with sticky headers (e.g., COMMANDS, MODELS).
   * Each list item will display an icon (using SVG paths we already have in NodeIcons.tsx or GooeyNodesMenu.tsx),
     the title, and a subtle descriptive sub-label or shortcut hint on the right side.

  4. Integration in App.tsx
   1. Add Keybinding: We'll update the handleKeyDown function in App.tsx to intercept Cmd+K:
     
   1     if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
   2       e.preventDefault(); // Stop Chrome's default search bar
   3       window.dispatchEvent(new CustomEvent('open-command-palette'));
   4     }
   2. Mount Component: Place <CommandPalette /> near the root of the JSX output, passing in all the necessary
      top-level handler functions (onAddNode, handleClear, handleExport, etc.).
