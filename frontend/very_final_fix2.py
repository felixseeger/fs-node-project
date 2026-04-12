import re

def fix(file):
    with open(file, 'r') as f:
        text = f.read()
    
    if "import { useNodeConnections } from './shared';\nimport { useNodeConnections } from './shared';" in text:
        text = text.replace("import { useNodeConnections } from './shared';\nimport { useNodeConnections } from './shared';", "import { useNodeConnections } from './shared';")
        
    with open(file, 'w') as f:
        f.write(text)

for f in ['src/nodes/ImageToPromptNode.jsx', 'src/nodes/RelightNode.jsx', 'src/nodes/StyleTransferNode.jsx']:
    fix(f)
print("Done")
