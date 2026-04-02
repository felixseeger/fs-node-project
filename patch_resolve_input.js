const fs = require('fs');

let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

app = app.replace(
  /const resolveInput = useCallback\(\(nodeId, handleId\) => \{/,
  `const resolveInput = useCallback((nodeId, handleId, originalHandleId = handleId) => {`
);

app = app.replace(
  /const routedInput = resolveInput\(sourceNode\.id, 'in'\);/,
  `const routedInput = resolveInput(sourceNode.id, 'in', originalHandleId);`
);

app = app.replace(
  /const dataType = getHandleDataType\(handleId\);/,
  `const dataType = getHandleDataType(originalHandleId);`
);

fs.writeFileSync('frontend/src/App.jsx', app);
console.log("Patched resolveInput to handle pass-through properly");
