import re

with open("frontend/src/GooeyNodesMenu.css", "r") as f:
    css = f.read()

# Remove absolute positioning from divider and avatar
css = re.sub(
    r'\.ms-divider \{\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  margin: 0;\n\}',
    '.ms-divider {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  margin: 0;\n}',
    css
)

css = re.sub(
    r'\.ms-avatar \{\n  position: absolute;\n  top: 550px;\n\}',
    '.ms-avatar {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n  margin: 0;\n}',
    css
)

# Remove the explicit .ms-li1 to .ms-li8 top positions since it's flex now
css = re.sub(r'/\* ── Item Positioning ── \*/.*?/\* ── Liquid Connection Logic \(The Stretch\) ── \*/', '/* ── Liquid Connection Logic (The Stretch) ── */', css, flags=re.DOTALL)

with open("frontend/src/GooeyNodesMenu.css", "w") as f:
    f.write(css)
