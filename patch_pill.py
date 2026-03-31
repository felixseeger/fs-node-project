import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    jsx = f.read()

jsx = jsx.replace('<div className="ms-pill-bg"></div>', '')

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(jsx)

with open("frontend/src/GooeyNodesMenu.css", "r") as f:
    css = f.read()

css = re.sub(r'/\* ── Pilled Background ── \*/.*?-webkit-backdrop-filter: blur\(12px\);\n  border-radius: 40px;\n  z-index: 0;\n  border: 1px solid rgba\(255,255,255,0\.05\);\n}', '', css, flags=re.DOTALL)

with open("frontend/src/GooeyNodesMenu.css", "w") as f:
    f.write(css)
