const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const startIdx = appJsx.indexOf('const handleMenuAction = (action, data) => {');
const endIdx = appJsx.indexOf('  };', startIdx) + 4; // Including '  };'

if (startIdx !== -1 && endIdx !== -1) {
  const newActions = `const handleMenuAction = (action, data) => {
    saveHistory();
    const { selectedNodes } = data;
    
    switch (action) {
      case 'create_element':
        if (selectedNodes && selectedNodes.length > 0) {
          const newAssetNode = {
            id: nextId(),
            type: 'assetNode',
            position: {
              x: selectedNodes[selectedNodes.length - 1].position.x + 300,
              y: selectedNodes[selectedNodes.length - 1].position.y,
            },
            data: {
              label: 'New Asset',
              images: selectedNodes.reduce((acc, node) => {
                if (node.data.outputImage) return [...acc, node.data.outputImage];
                if (node.data.outputVideo) return [...acc, node.data.outputVideo];
                return acc;
              }, []),
            },
          };
          setNodes((nds) => [...nds, newAssetNode]);
        }
        break;
      case 'duplicate':
        if (selectedNodes && selectedNodes.length > 0) {
          const newNodes = selectedNodes.map(node => ({
            ...node,
            id: nextId(),
            selected: true,
            position: { x: node.position.x + 50, y: node.position.y + 50 }
          }));
          setNodes(nds => [...nds.map(n => ({...n, selected: false})), ...newNodes]);
        }
        break;
      case 'clear_contents':
        if (selectedNodes && selectedNodes.length > 0) {
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const newData = { ...n.data };
            // Clear common content fields based on node type
            if (newData.text !== undefined) newData.text = '';
            if (newData.images) newData.images = [];
            if (newData.inputPrompt) newData.inputPrompt = '';
            if (newData.outputImage) newData.outputImage = null;
            if (newData.outputVideo) newData.outputVideo = null;
            return { ...n, data: newData };
          }));
        }
        break;
      case 'align_left':
        if (selectedNodes && selectedNodes.length > 1) {
          const minX = Math.min(...selectedNodes.map(n => n.position.x));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: minX } } : n));
        }
        break;
      // Add placeholders for other actions
      case 'copy':
      case 'paste':
      case 'autoformat':
      case 'grid_nodes':
      case 'stack_nodes':
      case 'align_center':
      case 'align_right':
      case 'download':
        console.log(\`Action \${action} not fully implemented yet.\`);
        break;
    }
    setMenu(null);
  };`;

  appJsx = appJsx.substring(0, startIdx) + newActions + appJsx.substring(endIdx);
  fs.writeFileSync('frontend/src/App.jsx', appJsx);
  console.log("Patched handleMenuAction successfully.");
} else {
  console.log("Indices not found.");
}
