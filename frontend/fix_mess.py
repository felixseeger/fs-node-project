import os
import re

files = [
  'src/nodes/ImageToPromptNode.jsx',
  'src/nodes/RelightNode.jsx', 
  'src/nodes/RemoveBackgroundNode.jsx',
  'src/nodes/SoundEffectsNode.jsx',
  'src/nodes/StyleTransferNode.jsx', 
  'src/nodes/VfxNode.jsx'
]

for fpath in files:
    with open(fpath, 'r') as f:
        text = f.read()

    # Clean out all forms of useNodeConnections imports
    text = re.sub(r"import\s*\{\s*[^}]*useNodeConnections[^}]*\}\s*from\s*['\"]\./shared['\"];\n?", "", text)
    text = re.sub(r"import\s*\{\s*useNodeConnections\s*\}\s*from\s*['\"]\./shared['\"];\n?", "", text)
    
    # We will just append import { useNodeConnections } from './shared'; right after import { Position, Handle }
    text = re.sub(r"(import \{ Position, Handle \} from '@xyflow/react';\n)", r"\1import { useNodeConnections } from './shared';\n", text)
    
    # Clean out any stray useNodeConnections
    text = text.replace("import { useNodeConnections } from './shared';\nimport { useNodeConnections } from './shared';\n", "import { useNodeConnections } from './shared';\n")
    
    # Ensure const { onDisconnectNode } is inside the component
    text = re.sub(r"\s*const\s*\{\s*onDisconnectNode\s*\}\s*=\s*useNodeConnections\(\);\n", "\n", text)
    text = re.sub(r"(export default function \w+\(\{ id, data, selected \}\) \{)", r"\1\n  const { onDisconnectNode } = useNodeConnections();", text)

    with open(fpath, 'w') as f:
        f.write(text)

print("Done")
