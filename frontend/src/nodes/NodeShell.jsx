import { surface, border, sp, radius, font, text } from './nodeTokens';
import NodeGenerateButton from './NodeGenerateButton';
import NodeDownloadButton from './NodeDownloadButton';
import { Handle, Position } from '@xyflow/react';
import { getHandleColor } from '../utils/handleTypes';

/**
 * Node wrapper shell with category-aware visual identity.
 *
 * Props:
 *  - label:         Node display name
 *  - dotColor:      Category accent color (drives header tint + left border)
 *  - selected:      Whether the node is currently selected
 *  - children:      Node body content
 *  - onDisconnect:  Callback to disconnect all connections
 *  - onEdit:        Callback to edit the node
 *  - onGenerate:    Callback to generate/regenerate (shows generate button)
 *  - isGenerating:  Whether generation is in progress
 *  - downloadUrl:   URL for download button (shows download button if provided)
 *  - downloadType:  Type for download: 'image' | 'video' | 'audio' | 'svg'
 *  - data:          Node data (optional, for dynamic handles)
 */
export default function NodeShell({ 
  label, dotColor, selected, children, onDisconnect, onEdit, 
  onGenerate, isGenerating, downloadUrl, downloadType = 'image',
  data 
}) {
  const accentAlpha = dotColor ? `${dotColor}14` : 'transparent'; // 8% opacity hex

  return (
    <div
      className="glass-card"
      style={{
        background: surface.base,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1.5px solid ${selected ? border.active : border.subtle}`,
        boxShadow: selected 
          ? `0 0 0 1px ${border.active}40, 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${border.active}30` 
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        borderRadius: radius.lg,
        minWidth: 240,
        maxWidth: 400,
        fontFamily: 'var(--font-body)',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        zIndex: selected ? 10 : 1,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = border.hover;
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = border.subtle;
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        }
      }}
    >
      {/* Header bar with category tint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${sp[4]}px ${sp[6]}px`, // Increased padding
          borderBottom: `1px solid ${border.subtle}`,
          background: `linear-gradient(135deg, ${accentAlpha}, transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[3] }}>
          {dotColor && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: dotColor,
                flexShrink: 0,
                boxShadow: `0 0 12px ${dotColor}`,
              }}
            />
          )}
          <span style={{ 
            fontSize: 14, 
            fontWeight: 500, 
            letterSpacing: '0.02em',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>{label}</span>
        </div>

        
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Generate button - appears for AI nodes */}
          {onGenerate && (
            <NodeGenerateButton 
              onGenerate={onGenerate} 
              isGenerating={isGenerating} 
              size="sm"
            />
          )}
          {/* Download button - appears when there's a downloadUrl */}
          {downloadUrl && (
            <NodeDownloadButton 
              url={downloadUrl}
              type={downloadType}
              size="sm"
            />
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit Element"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: 14,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'all 0.1s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
          {onDisconnect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect();
            }}
            title="Disconnect all connections"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 14,
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: 'all 0.1s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.84 9.42l-1.42 1.42a4 4 0 1 1-5.66-5.66l1.42-1.42"></path>
              <path d="M5.16 14.58l1.42-1.42a4 4 0 0 1 5.66 5.66l-1.42 1.42"></path>
              <line x1="8" y1="16" x2="16" y2="8"></line>
            </svg>
          </button>
        )}
        </div>
      </div>

      {/* Body */}
      <div style={{ 
        padding: `${sp[5]}px ${sp[6]}px`, // Increased padding
        color: text.secondary,
        fontSize: 13,
        lineHeight: 1.6,
        position: 'relative'
      }}>
        {/* Dynamic Published Input Handles (Left) */}
        {data?.publishedPoints?.map((key, idx) => {
          if (key.startsWith('output')) return null;
          return (
            <div key={`in-${key}`} style={{ position: 'absolute', left: 0, top: 40 + (idx * 24), display: 'flex', alignItems: 'center' }}>
              <Handle
                type="target"
                position={Position.Left}
                id={`published-${key}`}
                style={{
                  background: getHandleColor(key),
                  width: 10, height: 10, border: 'none',
                  left: -5
                }}
              />
              <span style={{ fontSize: 9, color: '#666', marginLeft: 8, whiteSpace: 'nowrap', opacity: 0.8 }}>{key}</span>
            </div>
          );
        })}

        {/* Dynamic Published Output Handles (Right) */}
        {data?.publishedPoints?.map((key, idx) => {
          if (!key.startsWith('output')) return null;
          return (
            <div key={`out-${key}`} style={{ position: 'absolute', right: 0, top: 40 + (idx * 24), display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 9, color: '#666', marginRight: 8, whiteSpace: 'nowrap', opacity: 0.8 }}>{key}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={`published-${key}`}
                style={{
                  background: getHandleColor(key),
                  width: 10, height: 10, border: 'none',
                  right: -5
                }}
              />
            </div>
          );
        })}

        {children}
      </div>
    </div>
  );
}
