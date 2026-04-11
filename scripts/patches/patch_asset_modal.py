import re

with open("frontend/src/AssetModal.jsx", "r") as f:
    content = f.read()

content = content.replace("export default function AssetModal({ isOpen, onClose }) {", "export default function AssetModal({ isOpen, onClose, onUpload }) {")

content = content.replace("onClick={onClose}", "onClick={onClose}") # don't touch

btn_replace = """          onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          onClick={() => {
            if(onUpload) onUpload('assetNode', {});
            onClose();
          }}
          >"""

content = re.sub(r'          onMouseEnter=\{e => e.currentTarget.style.background = \'#e0e0e0\'\}\n          onMouseLeave=\{e => e.currentTarget.style.background = \'#fff\'\}\n          >', btn_replace, content)

with open("frontend/src/AssetModal.jsx", "w") as f:
    f.write(content)

