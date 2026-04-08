const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const onDropRegex = /const type = event\.dataTransfer\.getData\('application\/reactflow'\);\s*if \(typeof type === 'undefined' \|\| !type\) return;\s*const position = rfInstance\.screenToFlowPosition\(\{\s*x: event\.clientX,\s*y: event\.clientY,\s*\}\);\s*let defaults = \{ label: type \};\s*for \(const section of NODE_MENU\) \{\s*const item = section\.items\.find\(i => i\.type === type\);\s*if \(item && item\.defaults\) \{\s*defaults = item\.defaults;\s*break;\s*\}\s*\}/m;

const newOnDrop = `const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let defaults = { label: type };
      
      const draggedDefaults = event.dataTransfer.getData('application/reactflow-defaults');
      if (draggedDefaults) {
        try {
          defaults = JSON.parse(draggedDefaults);
        } catch (e) {
          console.error("Failed to parse dragged defaults", e);
        }
      } else {
        for (const section of NODE_MENU) {
          const item = section.items.find(i => i.type === type);
          if (item && item.defaults) {
            defaults = item.defaults;
            break;
          }
        }
      }`;

code = code.replace(onDropRegex, newOnDrop);
fs.writeFileSync('frontend/src/App.jsx', code);
console.log('Patched onDrop in App.jsx');
