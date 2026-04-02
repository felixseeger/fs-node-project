const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

if (!appJsx.includes('onDragOver={onDragOver}')) {
  const hooksInjection = `
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let defaults = { label: type };
      for (const section of NODE_MENU) {
        const item = section.items.find(i => i.type === type);
        if (item && item.defaults) {
          defaults = item.defaults;
          break;
        }
      }

      const newNode = {
        id: nextId(),
        type,
        position,
        data: { ...defaults },
      };

      setNodes((nds) => nds.concat(newNode));
      saveHistory();
    },
    [rfInstance, saveHistory, setNodes]
  );
  `;
  
  appJsx = appJsx.replace(
    /const onPaneContextMenu = useCallback\(/,
    `${hooksInjection}\n  const onPaneContextMenu = useCallback(`
  );

  appJsx = appJsx.replace(
    /style=\{\{ flex: 1, position: 'relative' \}\}>/,
    `style={{ flex: 1, position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}>`
  );
  
  fs.writeFileSync('frontend/src/App.jsx', appJsx);
  console.log("Patched App.jsx with D&D handlers");
} else {
  console.log("App.jsx already patched with D&D");
}
