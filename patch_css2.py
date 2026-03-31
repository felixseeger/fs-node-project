import re

with open("frontend/src/GooeyNodesMenu.css", "r") as f:
    css = f.read()

# Make min-height slightly larger so it matches the aesthetic
css = re.sub(r'min-height: 400px;', 'min-height: 450px;', css)

with open("frontend/src/GooeyNodesMenu.css", "w") as f:
    f.write(css)
