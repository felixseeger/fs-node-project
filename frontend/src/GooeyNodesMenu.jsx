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

export default function GooeyNodesMenu({ nodeMenu, onAddNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      setActiveCategory('Search');
      setSearchQuery('');
    } else {
      setActiveCategory(null);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setSearchQuery('');
  };

  const allNodes = useMemo(() => {
    return nodeMenu.reduce((acc, section) => {
      return [...acc, ...section.items.map(item => ({ ...item, section: section.section }))];
    }, []);
  }, [nodeMenu]);

  const filteredNodes = useMemo(() => {
    if (!activeCategory) return [];
    
    if (activeCategory === 'Search') {
      if (!searchQuery) return []; // Return empty array if no search query
      const lowerQuery = searchQuery.toLowerCase();
      return allNodes.filter(n => 
        n.label.toLowerCase().includes(lowerQuery) || 
        n.type.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (activeCategory === 'Misc') {
       return allNodes.filter(n => n.section === 'Inputs' || n.section === 'Utilities');
    }
    
    const section = nodeMenu.find(s => s.section === activeCategory);
    return section ? section.items : [];
  }, [activeCategory, searchQuery, allNodes, nodeMenu]);

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
          
          {CATEGORIES.map((cat, idx) => {
            const index = idx + 1;
            return (
              <li key={cat.id} className={`ms-li ms-li${index} ${index === CATEGORIES.length ? 'ms-li-last' : ''}`}>
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

          <li className="ms-main">
            <label htmlFor="ms-menu-toggle" title="Add Nodes">
              <span>{Icons.Plus}</span>
            </label>
          </li>
        </ul>
      </div>

      {/* Submenu Panel */}
      <div className={`ms-submenu ${activeCategory ? 'active' : ''}`}>
        <div className="ms-submenu-header">
          <div className="ms-submenu-title">{activeCategory}</div>
          {activeCategory === 'Search' && (
            <input 
              autoFocus
              type="text" 
              className="ms-search-input" 
              placeholder="Search nodes..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        <div className="ms-node-list">
          {filteredNodes.length > 0 ? (
            filteredNodes.map(item => (
              <button
                key={item.label}
                className="ms-node-btn"
                onClick={() => {
                  onAddNode(item.type, item.defaults);
                  if (activeCategory === 'Search') setSearchQuery('');
                }}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="ms-no-results">
              {activeCategory === 'Search' && !searchQuery 
                ? 'Type to search nodes...' 
                : 'No nodes found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
