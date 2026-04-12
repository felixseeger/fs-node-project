import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

for i, line in enumerate(content.split('\n')):
    # Find '}' that is not inside quotes or comments
    # A simple heuristic: '}' preceded by a space or a character that isn't closing a block, inside what looks like JSX
    if '}' in line and '{' not in line and not line.strip().startswith('}') and not line.strip().endswith('}') and '/>' not in line:
        print(f"Line {i+1}: {line}")
