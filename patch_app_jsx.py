import re

with open("frontend/src/App.jsx", "r") as f:
    content = f.read()

# Add import
content = content.replace("import ImageNode from './nodes/ImageNode';", "import ImageNode from './nodes/ImageNode';\nimport AssetNode from './nodes/AssetNode';")

# Add to nodeTypes
content = content.replace("      imageNode: ImageNode,", "      imageNode: ImageNode,\n      assetNode: AssetNode,")

# Add to NODE_MENU (Inputs section)
content = content.replace("      { type: 'imageNode', label: 'Image', defaults: { label: 'Image', images: [] } },", "      { type: 'imageNode', label: 'Image', defaults: { label: 'Image', images: [] } },\n      { type: 'assetNode', label: 'Asset', defaults: { label: 'Asset', images: [] } },")

with open("frontend/src/App.jsx", "w") as f:
    f.write(content)
