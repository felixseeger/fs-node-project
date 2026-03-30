import React, { useState, useMemo } from 'react';
import './GooeyNodesMenu.css';

// SVG Icons for categories
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
];

const QUICK_ADD_SECTIONS = [
  {
    title: 'Add Node',
    items: [
      { id: 'text', title: 'Text', desc: 'Generate and edit', shortcut: 'T', type: 'textNode', 
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg> },
      { id: 'image', title: 'Images', desc: 'Generate, edit, and analyze', hasSubmenu: 'Image',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
      { id: 'video', title: 'Video', desc: 'Generate, edit, and upload', hasSubmenu: 'Video',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> },
    ]
  },
  {
    title: 'Utilities',
    items: [
      { id: 'layer', title: 'Layer Editor', desc: 'Combine images together', shortcut: 'L', type: 'layerEditor',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
      { id: 'element', title: 'Element', desc: 'Reusable visual assets', shortcut: 'E', type: 'elementNode',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg> },
      { id: 'batch', title: 'Batch', desc: 'Process multiple items at once', shortcut: 'B', type: 'batchNode',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> },
      { id: 'router', title: 'Router', desc: 'One input to many outputs', shortcut: 'R', type: 'routerNode',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6l4-4-4-4"></path><path d="M18 14l4 4-4 4"></path><path d="M4 10h8v8h-8z"></path><path d="M12 10l6-6"></path><path d="M12 18l6 6"></path></svg> },
    ]
  },
  {
    title: 'Add Source',
    items: [
      { id: 'upload', title: 'Upload', desc: 'Add media from your computer', shortcut: 'U', type: 'uploadNode',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> },
      { id: 'model', title: 'Add model', desc: 'Start with a model', hasSubmenu: 'LLMs',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> },
    ]
  }
];

export default function GooeyNodesMenu({ nodeMenu, onAddNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (category) => {
    if (activeCategory === category && isOpen) {
      setIsOpen(false);
      setActiveCategory(null);
    } else {
      setIsOpen(true);
      setActiveCategory(category);
    }
    setSearchQuery('');
  };

  const allNodes = useMemo(() => {
    return nodeMenu.reduce((acc, section) => {
      return [...acc, ...section.items.map(item => ({ ...item, section: section.section }))];
    }, []);
  }, [nodeMenu]);

  const filteredNodes = useMemo(() => {
    if (!activeCategory && !searchQuery) return [];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return allNodes.filter(n => 
        n.label.toLowerCase().includes(lowerQuery) || 
        n.type.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (activeCategory === 'Search') {
      return [];
    }
    
    if (activeCategory === 'Misc') {
       return allNodes.filter(n => n.section === 'Inputs' || n.section === 'Utilities');
    }
    

    if (activeCategory === 'Uploads') {
      return allNodes.filter(n => n.type === 'uploadNode');
    }
    
    if (activeCategory === 'Workflows') {
      return [];
    }
    
    const section = nodeMenu.find(s => s.section === activeCategory);

    return section ? section.items : [];
  }, [activeCategory, searchQuery, allNodes, nodeMenu]);

  const subMenuNodes = useMemo(() => {
    if (!activeSubMenu) return [];
    if (activeSubMenu === 'Image') {
      return allNodes.filter(n => 
        n.section === 'Image Generation' || 
        n.section === 'Image Editing' ||
        (n.section === 'LLMs' && (n.type === 'imageAnalyzer' || n.type === 'imageToPrompt' || n.type === 'aiImageClassifier' || n.type === 'improvePrompt')) ||
        (n.section === 'Inputs' && n.type === 'imageNode')
      );
    }
    if (activeSubMenu === 'Video') {
      return allNodes.filter(n => n.section === 'Video Generation' || n.section === 'Video Editing');
    }
    if (activeSubMenu === 'LLMs') {
      return allNodes.filter(n => n.section === 'LLMs');
    }
    return [];
  }, [activeSubMenu, allNodes]);

  return (
    <div className="ms-menu-wrapper" onMouseLeave={() => setActiveSubMenu(null)}>
      <div className="ms-nav-container">
        <ul className="ms-nav">
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
        </ul>
      </div>

      {/* Overlay Panel matching navbar_nodes.jpg */}
      <div className={`ms-overlay-panel ${isOpen ? 'active' : ''}`}>
        <div className="ms-search-container" onMouseEnter={() => setActiveSubMenu(null)}>
          <div className="ms-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input 
            autoFocus
            type="text" 
            className="ms-search-input-overlay" 
            placeholder="Search nodes and models" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ms-overlay-scroll-area">
          {searchQuery || activeCategory ? (
            <div className="ms-node-list">
              {activeCategory && !searchQuery && <div className="ms-category-title">{activeCategory}</div>}
              {filteredNodes.length > 0 ? (
                filteredNodes.map(item => (
                  <button
                    key={item.label}
                    className="ms-node-btn"
                    onClick={() => {
                      onAddNode(item.type, item.defaults);
                      setSearchQuery('');
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className="ms-no-results">
                  {searchQuery ? 'No nodes found.' : 'Type to search nodes...'}
                </div>
              )}
            </div>
          ) : (
            // Default Quick Add View
            <div className="ms-quick-add">
              {QUICK_ADD_SECTIONS.map(section => (
                <div key={section.title} className="ms-qa-section" onMouseEnter={() => { if(section.title === 'Utilities' || section.title === 'Add Source') setActiveSubMenu(null) }}>
                  <div className="ms-qa-title">{section.title}</div>
                  <div className="ms-qa-items">
                    {section.items.map(item => (
                      <button 
                        key={item.id} 
                        className={`ms-qa-item ${activeSubMenu === item.hasSubmenu ? 'active-submenu' : ''}`}
                        onMouseEnter={() => {
                          if (item.hasSubmenu) {
                            setActiveSubMenu(item.hasSubmenu);
                          } else {
                            setActiveSubMenu(null);
                          }
                        }}
                        onClick={() => {
                          if (item.type) {
                            onAddNode(item.type, {});
                            setIsOpen(false);
                            setActiveSubMenu(null);
                          }
                        }}
                      >
                        <div className="ms-qa-icon">{item.icon}</div>
                        <div className="ms-qa-text">
                          <div className="ms-qa-label">{item.title}</div>
                          {item.desc && <div className="ms-qa-desc">{item.desc}</div>}
                        </div>
                        {item.shortcut ? (
                          <div className="ms-qa-shortcut">{item.shortcut}</div>
                        ) : item.hasSubmenu ? (
                          <div className="ms-qa-shortcut">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`ms-flyout-panel ${activeSubMenu && isOpen && !searchQuery && !activeCategory ? 'active' : ''}`}>
        {activeSubMenu && (
          <>
            <div className="ms-category-title">
              {activeSubMenu === 'LLMs' ? 'Models' : activeSubMenu === 'Image' ? 'Images' : `${activeSubMenu} Models`}
            </div>
            <div className="ms-node-list">
              {subMenuNodes.map(item => (
                <button
                  key={item.label}
                  className="ms-node-btn"
                  onClick={() => {
                    onAddNode(item.type, item.defaults);
                    setIsOpen(false);
                    setActiveSubMenu(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
