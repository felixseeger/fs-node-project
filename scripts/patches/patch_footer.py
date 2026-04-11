import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

footer_replacement = """        <div className="ms-help-section ms-help-footer">
          <a href="#" className="ms-help-link" style={{ padding: 0, background: 'transparent' }}>
            <span className="ms-help-version">FS V1.0</span>
            <span className="ms-help-external" style={{ marginLeft: 8 }}>{Icons.ExternalLink}</span>
          </a>
          <div className="ms-help-date" style={{ marginTop: 4 }}>Last updated Mar 31, 2026</div>
        </div>"""

content = re.sub(
    r'<div className="ms-help-section ms-help-footer">.*?</div>\n        </div>',
    footer_replacement + '\n      </div>',
    content,
    flags=re.DOTALL
)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
