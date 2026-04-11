import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

help_panel_html = """
      {/* Help Menu Panel */}
      <div className={`ms-help-panel ${showHelpMenu ? 'active' : ''}`}>
        <div className="ms-help-section">
          <a href="#" className="ms-help-link">
            <span className="ms-help-icon">{Icons.HelpBook}</span>
            <span className="ms-help-text">Help & Resources</span>
            <span className="ms-help-external">{Icons.ExternalLink}</span>
          </a>
          <a href="#" className="ms-help-link">
            <span className="ms-help-icon">{Icons.Bug}</span>
            <span className="ms-help-text">Report a bug</span>
            <span className="ms-help-external">{Icons.ExternalLink}</span>
          </a>
          <a href="#" className="ms-help-link">
            <span className="ms-help-icon">{Icons.Lightbulb}</span>
            <span className="ms-help-text">Suggest a feature</span>
            <span className="ms-help-external">{Icons.ExternalLink}</span>
          </a>
          <a href="#" className="ms-help-link">
            <span className="ms-help-icon">{Icons.Cmd}</span>
            <span className="ms-help-text">Keyboard shortcuts</span>
            <span className="ms-help-shortcut">Ctrl + .</span>
          </a>
        </div>
        
        <div className="ms-help-section ms-help-socials">
          <a href="#" className="ms-social-icon">{Icons.Discord}</a>
          <a href="#" className="ms-social-icon">{Icons.TwitterX}</a>
          <a href="#" className="ms-social-icon">{Icons.Instagram}</a>
          <a href="#" className="ms-social-icon">{Icons.YouTube}</a>
        </div>

        <div className="ms-help-section ms-help-footer">
          <div className="ms-help-version">FS V1.0</div>
          <div className="ms-help-date">Last updated Mar 31, 2026</div>
        </div>
      </div>
"""

# Insert right after <div className={`ms-flyout-panel... </div>
content = content.replace(
    '      </div>\n    </div>\n  );\n}',
    '      </div>\n' + help_panel_html + '    </div>\n  );\n}'
)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
