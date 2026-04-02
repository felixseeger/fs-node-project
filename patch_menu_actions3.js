const fs = require('fs');
let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const startIdx = appJsx.indexOf('const handleMenuAction = (action, data) => {');
const endIdx = appJsx.indexOf('const saveHistory = useCallback(() => {');

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
      case 'align_right':
        if (selectedNodes && selectedNodes.length > 1) {
          const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.width || 200)));
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: maxX - (n.width || 200) } } : n));
        }
        break;
      case 'align_center':
        if (selectedNodes && selectedNodes.length > 1) {
          let sumX = 0;
          selectedNodes.forEach(n => sumX += n.position.x + (n.width || 200)/2);
          const avgX = sumX / selectedNodes.length;
          setNodes(nds => nds.map(n => n.selected ? { ...n, position: { ...n.position, x: avgX - (n.width || 200)/2 } } : n));
        }
        break;
      case 'stack_nodes':
        if (selectedNodes && selectedNodes.length > 1) {
          // Sort by Y position
          const sorted = [...selectedNodes].sort((a,b) => a.position.y - b.position.y);
          let currentY = sorted[0].position.y;
          const x = sorted[0].position.x;
          setNodes(nds => {
            return nds.map(n => {
              if (!n.selected) return n;
              const idx = sorted.findIndex(s => s.id === n.id);
              if (idx === 0) return n;
              const prev = sorted[idx-1];
              currentY += (prev.height || 300) + 20;
              return { ...n, position: { x, y: currentY } };
            });
          });
        }
        break;
      case 'grid_nodes':
        if (selectedNodes && selectedNodes.length > 1) {
          const startX = selectedNodes[0].position.x;
          const startY = selectedNodes[0].position.y;
          const cols = Math.ceil(Math.sqrt(selectedNodes.length));
          let idx = 0;
          setNodes(nds => nds.map(n => {
            if (!n.selected) return n;
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            idx++;
            return { ...n, position: { x: startX + c * 350, y: startY + r * 400 } };
          }));
        }
        break;
      case 'copy':
      case 'paste':
      case 'autoformat':
      case 'download':
        console.log(\`Action \${action} not fully implemented yet.\`);
        break;
    }
    setMenu(null);
  };

  `;

appJsx = appJsx.substring(0, startIdx) + newActions + appJsx.substring(endIdx);
fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched clean handleMenuAction");
