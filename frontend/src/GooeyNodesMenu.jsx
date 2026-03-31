import React, { useState, useMemo } from 'react';
import './GooeyNodesMenu.css';
import ProfileModal from './ProfileModal';
import AssetModal from './AssetModal';
import SearchHistoryMenu from './SearchHistoryMenu';

// SVG Icons for categories
const Icons = {
  Plus: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  Close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  FolderPlus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>,
  Flash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Hash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>,
  Help: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  HelpBook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Bug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M9 14h6"></path><path d="M12 11v6"></path></svg>,
  Lightbulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5"></path></svg>,
  Cmd: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>,
  ExternalLink: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  Discord: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>,
  TwitterX: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>,
  Instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  YouTube: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
};

const CATEGORIES = [
  { id: 'Uploads', icon: Icons.Folder, title: 'Uploaded Files' },
  { id: 'Workflows', icon: Icons.Flash, title: 'Workflows' },
  { id: 'Assets', icon: Icons.Hash, title: 'Assets' },
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
      
      
            
      { id: 'search-history', title: 'Search History', desc: 'View past generations', shortcut: 'H', type: 'searchHistory',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
      { id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
      { id: 'layer', title: 'Layer Editor', desc: 'Combine images together', shortcut: 'L', type: 'layerEditor',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
      { id: 'assets', title: 'Assets', desc: 'Reusable visual assets', shortcut: 'A', type: 'assetNode',
        icon: Icons.Hash },
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
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
    <div className="ms-menu-wrapper" onMouseLeave={() => { setActiveSubMenu(null); setShowHelpMenu(false); }}>
      <div className="ms-nav-container">
        <ul className="ms-nav">
          <li className="ms-li ms-main-toggle">
            <button 
              onClick={handleMainToggleClick}
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
          </li>

          <li className="ms-divider">
            <div className="ms-divider-line"></div>
          </li>
          
          <li className="ms-li ms-avatar ms-li-last">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowProfileModal(true); setIsOpen(false); setShowHelpMenu(false); }} data-tooltip="User Profile">
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
          {activeCategory === 'Assets' && !searchQuery ? (
            <div className="ms-assets-browser">
              <div className="ms-assets-tabs">
                <button className="ms-asset-tab active">Library</button>
                <button className="ms-asset-tab">Unsplash</button>
              </div>
              <div className="ms-assets-section">
                <div className="ms-assets-title">Folders <span>0</span></div>
                <div className="ms-assets-grid">
                  <button className="ms-asset-card">
                    <span className="ms-asset-icon">{Icons.FolderPlus}</span>
                    <span className="ms-asset-label">Create Folder</span>
                  </button>
                </div>
              </div>
              <div className="ms-assets-section">
                <div className="ms-assets-title">Unorganized <span>0</span></div>
                <div className="ms-assets-grid">
                  <button className="ms-asset-card" onClick={() => { setIsOpen(false); setShowAssetModal(true); }}>
                    <span className="ms-asset-icon" style={{ width: 24, height: 24, padding: 6 }}>{Icons.Plus}</span>
                    <span className="ms-asset-label">Upload Asset</span>
                  </button>
                </div>
              </div>
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
          <a href="#" className="ms-help-link" style={{ padding: 0, background: 'transparent' }}>
            <span className="ms-help-version">FS V1.0</span>
            <span className="ms-help-external" style={{ marginLeft: 8 }}>{Icons.ExternalLink}</span>
          </a>
          <div className="ms-help-date" style={{ marginTop: 4 }}>Last updated Mar 31, 2026</div>
        </div>
      </div>
      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      {/* Asset Modal */}
      <AssetModal isOpen={showAssetModal} onClose={() => setShowAssetModal(false)} onUpload={onAddNode} />
      {/* Search History Modal */}
      <SearchHistoryMenu isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
    </div>
  );
}
