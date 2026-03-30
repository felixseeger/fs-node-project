import React, { useState, useMemo } from 'react';
import './GooeyNodesMenu.css';

// SVG Icons for categories
const Icons = {
  Plus: <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  Search: <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  LLMs: <svg viewBox="0 0 24 24"><path d="M12 2c-4.97 0-9 4.03-9 9 0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2zm0 4h2v2h-2z"/></svg>,
  ImageGen: <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  ImageEdit: <svg viewBox="0 0 24 24"><path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/></svg>,
  VideoGen: <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>,
  VideoEdit: <svg viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>,
  AudioGen: <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  Misc: <svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
};

const CATEGORIES = [
  { id: 'Search', icon: Icons.Search, title: 'Search Nodes' },
  { id: 'LLMs', icon: Icons.LLMs, title: 'LLMs' },
  { id: 'Image Generation', icon: Icons.ImageGen, title: 'Image Generation' },
  { id: 'Image Editing', icon: Icons.ImageEdit, title: 'Image Editing' },
  { id: 'Video Generation', icon: Icons.VideoGen, title: 'Video Generation' },
  { id: 'Video Editing', icon: Icons.VideoEdit, title: 'Video Editing' },
  { id: 'Audio Generation', icon: Icons.AudioGen, title: 'Audio Generation' },
  { id: 'Misc', icon: Icons.Misc, title: 'Inputs & Utilities' },
];

const QUICK_ADD_SECTIONS = [
  {
    title: 'Add Node',
    items: [
      { id: 'text', title: 'Text', desc: 'Generate and edit', shortcut: 'T', type: 'textNode', 
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg> },
      { id: 'image', title: 'Image', desc: 'Generate, edit, and upload', shortcut: 'I', type: 'imageNode',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
      { id: 'video', title: 'Video', desc: 'Generate, edit, and upload', shortcut: 'V', type: 'videoNode',
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (!nextOpen) {
      setActiveCategory(null);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    if (!isOpen) setIsOpen(true);
    setActiveCategory(activeCategory === category ? null : category);
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
    
    const section = nodeMenu.find(s => s.section === activeCategory);
    return section ? section.items : [];
  }, [activeCategory, searchQuery, allNodes, nodeMenu]);

  const subMenuNodes = useMemo(() => {
    if (!activeSubMenu) return [];
    if (activeSubMenu === 'Image') {
      return allNodes.filter(n => n.section === 'Image Generation' || n.section === 'Image Editing');
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
    <div className="ms-menu-wrapper">
      <div className="ms-nav-container">
        <ul className="ms-nav">
          <input 
            type="checkbox" 
            id="ms-menu-toggle" 
            className="ms-menu-toggle" 
            checked={isOpen}
            onChange={handleToggle}
          />
          <div className="ms-pill-bg"></div>
          
          <li className="ms-main">
            <label htmlFor="ms-menu-toggle" title="Add Nodes">
              <span><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></span>
            </label>
          </li>

          {CATEGORIES.map((cat, idx) => {
            const index = idx + 1;
            return (
              <li key={cat.id} className={`ms-li ms-li${index}`}>
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

          <li className="ms-li ms-divider">
            <div className="ms-divider-line"></div>
          </li>
          
          <li className="ms-li ms-avatar ms-li-last">
            <a href="#" onClick={(e) => e.preventDefault()} data-tooltip="User Profile">
              <img src="/ref/gen-ai.jpg" alt="User Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </a>
          </li>
        </ul>
      </div>

      {/* Overlay Panel matching navbar_nodes.jpg */}
      <div className={`ms-overlay-panel ${isOpen ? 'active' : ''}`}>
        <div className="ms-search-container">
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
          {activeSubMenu ? (
            <div className="ms-node-list">
              <div 
                className="ms-back-btn" 
                onClick={() => setActiveSubMenu(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back
              </div>
              <div className="ms-category-title">{activeSubMenu} Nodes</div>
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
          ) : searchQuery || activeCategory ? (
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
                <div key={section.title} className="ms-qa-section">
                  <div className="ms-qa-title">{section.title}</div>
                  <div className="ms-qa-items">
                    {section.items.map(item => (
                      <button 
                        key={item.id} 
                        className="ms-qa-item"
                        onClick={() => {
                          if (item.hasSubmenu) {
                            setActiveSubMenu(item.hasSubmenu);
                          } else {
                            onAddNode(item.type, {});
                            setIsOpen(false);
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
    </div>
  );
}
