import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

# 1. Import ProfileModal
if "import ProfileModal" not in content:
    content = content.replace("import './GooeyNodesMenu.css';", "import './GooeyNodesMenu.css';\nimport ProfileModal from './ProfileModal';")

# 2. Add state
state_replacement = """  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);"""
  
content = re.sub(
    r'  const \[searchQuery, setSearchQuery\] = useState\(\'\'\);\n  const \[showHelpMenu, setShowHelpMenu\] = useState\(false\);',
    state_replacement,
    content,
    flags=re.DOTALL
)

# 3. Update Avatar click handler
avatar_replacement = """          <li className="ms-li ms-avatar ms-li-last">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowProfileModal(true); setIsOpen(false); setShowHelpMenu(false); }} data-tooltip="User Profile">
              <img src="/ref/gen-ai.jpg" alt="User Profile" />
            </a>
          </li>"""

content = re.sub(
    r'          <li className="ms-li ms-avatar ms-li-last">.*?</li>',
    avatar_replacement,
    content,
    flags=re.DOTALL
)

# 4. Add ProfileModal at the end
modal_append = """      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}"""

content = re.sub(
    r'    </div>\n  \);\n}',
    modal_append,
    content,
    flags=re.DOTALL
)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
