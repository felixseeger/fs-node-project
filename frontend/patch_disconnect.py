import os
import glob
import re

node_files = glob.glob('src/nodes/*.tsx') + glob.glob('src/nodes/*.jsx')

for file in node_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Check if file uses NodeShell
    if '<NodeShell' not in content:
        continue
        
    # Check if it already has onDisconnect
    if 'onDisconnect=' in content:
        continue
        
    # Check if disconnectNode is extracted from useNodeConnections
    if 'useNodeConnections' in content and 'disconnectNode' not in content:
        content = re.sub(r'(const\s+\{.*?)(\s*\}\s*=\s*useNodeConnections)', r'\1, disconnectNode\2', content)
        
    # Inject onDisconnect into NodeShell
    content = re.sub(r'(<NodeShell[^>]*?)(\s*>)', r'\1 onDisconnect={disconnectNode}\2', content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Patching complete.")
