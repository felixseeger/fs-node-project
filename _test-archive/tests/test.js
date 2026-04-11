const fs = require('fs');
let code = fs.readFileSync('frontend/src/nodes/LayerEditorNode.jsx', 'utf8');
if (code.includes('id="image-in"')) {
    console.log('image-in handle exists');
} else {
    console.log('image-in handle missing');
}
