import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    jsx = f.read()

# Replace Icons
icons_replacement = """// SVG Icons for categories
const Icons = {
  Plus: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  Close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Flash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Help: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
};

const CATEGORIES = [
  { id: 'Uploads', icon: Icons.Folder, title: 'Uploaded Files' },
  { id: 'Workflows', icon: Icons.Flash, title: 'Workflows' },
];"""

jsx = re.sub(r'// SVG Icons for categories.*?const QUICK_ADD_SECTIONS', icons_replacement + '\n\nconst QUICK_ADD_SECTIONS', jsx, flags=re.DOTALL)

# Replace ms-nav content
nav_replacement = """        <ul className="ms-nav">
          <li className="ms-li ms-main-toggle">
            <button 
              onClick={() => {
                const nextOpen = !isOpen;
                setIsOpen(nextOpen);
                if (!nextOpen) {
                  setActiveCategory(null);
                  setSearchQuery('');
                }
              }}
              data-tooltip={isOpen ? "Close Menu" : "Add Nodes"}
            >
              {isOpen ? Icons.Close : Icons.Plus}
            </button>
          </li>

          {CATEGORIES.map((cat, idx) => {
            return (
              <li key={cat.id} className="ms-li">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleCategoryClick(cat.id); }}
                  data-tooltip={cat.title}
                  className={activeCategory === cat.id ? 'active' : ''}
                >
                  <span>{cat.icon}</span>
                </a>
              </li>
            );
          })}

          <li className="ms-spacer"></li>

          <li className="ms-li ms-help">
            <a href="#" onClick={(e) => e.preventDefault()} data-tooltip="Help">
              <span>{Icons.Help}</span>
            </a>
          </li>

          <li className="ms-divider">
            <div className="ms-divider-line"></div>
          </li>
          
          <li className="ms-li ms-avatar ms-li-last">
            <a href="#" onClick={(e) => e.preventDefault()} data-tooltip="User Profile">
              <img src="/ref/gen-ai.jpg" alt="User Profile" />
            </a>
          </li>
        </ul>"""

jsx = re.sub(r'        <ul className="ms-nav">.*?</ul>', nav_replacement, jsx, flags=re.DOTALL)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(jsx)
