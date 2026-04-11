import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

state_replacement = """  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  const handleCategoryClick = (category) => {
    if (activeCategory === category && isOpen) {
      setIsOpen(false);
      setActiveCategory(null);
    } else {
      setIsOpen(true);
      setActiveCategory(category);
    }
    setSearchQuery('');
    setShowHelpMenu(false);
  };
  
  const handleMainToggleClick = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (!nextOpen) {
      setActiveCategory(null);
      setSearchQuery('');
    }
    setShowHelpMenu(false);
  };
"""

content = re.sub(
    r'  const \[isOpen, setIsOpen\] = useState.*?setSearchQuery\(\'\'\);\n  };',
    state_replacement,
    content,
    flags=re.DOTALL
)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
