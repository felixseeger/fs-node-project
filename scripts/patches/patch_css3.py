import re

with open("frontend/src/GooeyNodesMenu.css", "r") as f:
    css = f.read()

# Add position: relative to the links/buttons so tooltips position correctly
css = re.sub(
    r'\.ms-li a, \.ms-li button \{',
    '.ms-li a, .ms-li button {\n  position: relative;',
    css
)

# also add tooltip support for button since we added the main toggle as a button
css = re.sub(
    r'\.ms-li a\[data-tooltip\]::before',
    '.ms-li a[data-tooltip]::before,\n.ms-li button[data-tooltip]::before',
    css
)
css = re.sub(
    r'\.ms-li a:hover::before',
    '.ms-li a:hover::before,\n.ms-li button:hover::before',
    css
)

with open("frontend/src/GooeyNodesMenu.css", "w") as f:
    f.write(css)
