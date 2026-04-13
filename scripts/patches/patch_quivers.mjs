import fs from 'fs';
const patchNode = (path) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace("addToHistory({", "await addToHistory({");
  fs.writeFileSync(path, code);
};
patchNode('frontend/src/nodes/QuiverTextToVectorGenerationNode.jsx');
patchNode('frontend/src/nodes/QuiverImageToVectorGenerationNode.jsx');
