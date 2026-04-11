import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

# I want to replace the icon of the assets item with Icons.Hash
assets_item_regex = r"(\{ id: 'assets', title: 'Assets', desc: 'Reusable visual assets', shortcut: 'A', type: 'assetNode',\s+icon: )<svg.*?</svg> \}."

def replacer(match):
    return match.group(1) + "{Icons.Hash} },"

content = re.sub(assets_item_regex, replacer, content)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
