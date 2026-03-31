import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

content = content.replace(
    'onMouseLeave={() => setActiveSubMenu(null)}',
    'onMouseLeave={() => { setActiveSubMenu(null); setShowHelpMenu(false); }}'
)

content = content.replace(
    'onClick={() => {\n                const nextOpen = !isOpen;\n                setIsOpen(nextOpen);\n                if (!nextOpen) {\n                  setActiveCategory(null);\n                  setSearchQuery(\'\');\n                }\n              }}',
    'onClick={handleMainToggleClick}'
)

help_li_replacement = """          <li className="ms-li ms-help">
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                const newShowHelp = !showHelpMenu;
                setShowHelpMenu(newShowHelp);
                if (newShowHelp) {
                  setIsOpen(false);
                  setActiveCategory(null);
                }
              }} 
              data-tooltip="Help"
              className={showHelpMenu ? 'active' : ''}
            >
              <span>{Icons.Help}</span>
            </button>
          </li>"""

content = re.sub(
    r'<li className="ms-li ms-help">.*?</li>',
    help_li_replacement,
    content,
    flags=re.DOTALL
)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
