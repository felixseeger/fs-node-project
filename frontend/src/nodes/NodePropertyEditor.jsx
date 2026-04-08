import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { InfoIcon, PublishIcon, ChevronDownIcon } from './NodeIcons';
import { text as textStyles, surface, border, radius, sp, font } from './nodeTokens';

/**
 * Modern Node Property Editor Panel
 * Slides in from the right when a node is selected.
 */

const styles = {
  panelContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    bottom: '20px',
    width: '320px',
    backgroundColor: 'rgba(15, 15, 20, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    zIndex: 1000,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease-out'
  },
  wrapper: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    overflowY: 'auto'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  titleText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  labelText: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '8px'
  },
  valueText: {
    fontSize: '12px',
    color: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px 12px',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  row: {
    display: 'flex',
    gap: '12px'
  }
};

const InEndPointSearch = ({ value, onChange }) => (
  <div style={{ position: 'relative', marginBottom: '12px' }}>
    <input 
      style={{ ...styles.input, paddingLeft: '32px' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search properties..."
    />
    <svg 
      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </div>
);

export default function NodePropertyEditor({ node, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataExpanded, setIsDataExpanded] = useState(true);
  const [isPointsExpanded, setIsPointsExpanded] = useState(false);

  if (!node) return null;

  const availablePoints = Object.keys(node.data)
    .filter(key => {
      const internalKeys = [
        'label', 'onUpdate', 'onDisconnect', 'onGenerate', 'onEdit', 
        'hasConnection', 'getConnectionInfo', 'resolveInput', 'isGenerating', 
        'executionProgress', 'executionStatus', 'executionMessage', 'publishedPoints',
        'triggerGenerate', 'outputError', 'isLoading'
      ];
      return !internalKeys.includes(key);
    });

  const filteredPoints = availablePoints.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div style={styles.panelContainer} className="node-property-editor">
      <div style={styles.wrapper}>
        {/* Header Section */}
        <div style={styles.sectionHeader}>
          <span style={styles.titleText}>Node Inspector</span>
          <InfoIcon style={{ color: '#999' }} />
        </div>

        {/* Content Section */}
        <div style={styles.sectionBody}>
          {/* Label Field */}
          <div>
            <div style={styles.labelText}>NODE LABEL</div>
            <input 
              style={styles.input}
              value={node.data.label || ''} 
              onChange={(e) => onUpdate(node.id, { label: e.target.value })}
              placeholder="Enter node label..."
            />
          </div>

          {/* Type Info */}
          <div style={styles.row}>
            <div>
              <div style={styles.labelText}>TYPE</div>
              <div style={styles.valueText}>{node.type}</div>
            </div>
            <div>
              <div style={styles.labelText}>STATUS</div>
              <div style={{ ...styles.valueText, color: '#22c55e' }}>Connected</div>
            </div>
          </div>

          {/* ID Field (readonly) */}
          <div>
            <div style={styles.labelText}>UNIQUE ID</div>
            <div style={{ ...styles.valueText, fontSize: '10px', color: '#666', background: '#111', padding: '4px 8px', borderRadius: '4px', border: '1px solid #222' }}>
              {node.id}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#3a3a3a', margin: '4px 0' }} />

          {/* Text Element Content Section (only for TextElementNode) */}
          {node.type === 'textElement' && (
            <div>
              <div
                onClick={() => setIsDataExpanded(!isDataExpanded)}
                style={{
                  ...styles.titleText,
                  marginBottom: isDataExpanded ? '10px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronDownIcon expanded={isDataExpanded} style={{ color: '#666' }} />
                  TEXT ELEMENT SETTINGS
                </div>
              </div>

              {isDataExpanded && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      Base Text Color
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={node.data.textColor || '#e0e0e0'}
                        onChange={(e) => onUpdate(node.id, { textColor: e.target.value })}
                        style={{ width: '30px', height: '24px', padding: 0, border: '1px solid #333', background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={node.data.textColor || '#e0e0e0'}
                        onChange={(e) => onUpdate(node.id, { textColor: e.target.value })}
                        style={{ ...styles.input, flex: 1, fontSize: '11px', padding: '4px 8px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      Background Color
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={node.data.bgColor || '#00000000'}
                        onChange={(e) => onUpdate(node.id, { bgColor: e.target.value })}
                        style={{ width: '30px', height: '24px', padding: 0, border: '1px solid #333', background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={node.data.bgColor || 'transparent'}
                        onChange={(e) => onUpdate(node.id, { bgColor: e.target.value })}
                        style={{ ...styles.input, flex: 1, fontSize: '11px', padding: '4px 8px' }}
                        placeholder="transparent or hex..."
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ ...styles.labelText, marginBottom: '6px' }}>
                      HTML Source
                    </div>
                    <textarea
                      style={{
                        ...styles.input,
                        minHeight: '100px',
                        maxHeight: '200px',
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        lineHeight: '1.4',
                        resize: 'vertical'
                      }}
                      value={node.data.text || ''}
                      onChange={(e) => onUpdate(node.id, { text: e.target.value })}
                      placeholder="HTML content..."
                    />
                  </div>
                  <div style={{ ...styles.labelText, marginTop: '2px', fontStyle: 'italic' }}>
                    Tip: Double-click the node on canvas for rich text editing
                  </div>
                </div>
              )}
            </div>
          )}

          {/* API In-Out Points Section */}
          <div>
            <div 
              onClick={() => setIsPointsExpanded(!isPointsExpanded)}
              style={{ 
                ...styles.titleText, 
                marginBottom: isPointsExpanded ? '10px' : '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronDownIcon expanded={isPointsExpanded} style={{ color: '#666' }} />
                API IN-OUT POINTS
                <span style={{ fontSize: '10px', fontWeight: '400', color: '#666' }}>
                  ({availablePoints.length})
                </span>
              </div>
            </div>
            
            {isPointsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <InEndPointSearch value={searchQuery} onChange={setSearchQuery} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredPoints.map(key => {
                    const isPublished = node.data.publishedPoints?.includes(key);
                    const isOutput = key.startsWith('output');
                    
                    return (
                      <div key={key} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: '#222',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: isOutput ? '#ec4899' : '#3b82f6',
                            flexShrink: 0
                          }} />
                          <span style={{ fontSize: '11px', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={key}>{key}</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const currentPoints = node.data.publishedPoints || [];
                            const newPoints = isPublished 
                              ? currentPoints.filter(p => p !== key)
                              : [...currentPoints, key];
                            onUpdate(node.id, { publishedPoints: newPoints });
                          }}
                          style={{
                            background: isPublished ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: isPublished ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid #444',
                            borderRadius: '3px',
                            color: isPublished ? '#3b82f6' : '#666',
                            fontSize: '9px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0
                          }}
                        >
                          <PublishIcon active={isPublished} style={{ width: '10px', height: '10px' }} />
                          {isPublished ? 'PUBLISHED' : 'PUBLISH'}
                        </button>
                      </div>
                    );
                  })}
                  
                  {availablePoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No API points available
                    </div>
                  )}

                  {availablePoints.length > 0 && filteredPoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No matching results
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
