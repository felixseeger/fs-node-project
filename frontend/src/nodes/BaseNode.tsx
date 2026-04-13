import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surface, border, sp, radius, text, ui } from './nodeTokens';
import { type BaseNodeProps, type NodeStatus } from './BaseNode.types';
import NodeGenerateButton from './NodeGenerateButton';
import NodeDownloadButton from './NodeDownloadButton';
import EditableNodeTitle from './EditableNodeTitle';

/**
 * BaseNode: The foundational UI wrapper for all nodes in the workflow.
 * Implements NodeBanana-inspired patterns including resizing,
 * execution state indicators, and animated settings panels.
 */
export default function BaseNode({
  id,
  label,
  editableTitle,
  children,
  selected = false,
  status = "idle",
  dotColor,
  isExecuting,
  hasError,
  minWidth = 240,
  minHeight = 120,
  settingsExpanded = false,
  settingsPanel,
  onDisconnect,
  onEdit,
  onGenerate,
  onToggleSettings,
  downloadUrl,
  downloadType = 'image',
  modelName,
}: BaseNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const accentAlpha = dotColor ? `${dotColor}14` : 'transparent';
  const effectiveStatus = isExecuting ? "loading" : (hasError ? "error" : status);

  // Status colors mapping
  const statusColors: Record<NodeStatus, string> = {
    idle: border.subtle,
    loading: '#3b82f6', // Blue
    complete: '#22c55e', // Green
    error: '#ef4444', // Red
    skipped: '#94a3b8', // Slate
  };

  return (
    <div
      className="base-node-container"
      data-node-id={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: surface.base,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1.5px solid ${selected ? border.active : (isHovered ? border.hover : statusColors[effectiveStatus])}`,
        boxShadow: selected
          ? `0 0 0 1px ${border.active}40, 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${border.active}30`
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        borderRadius: radius.lg,
        minWidth,
        minHeight,
        fontFamily: 'var(--font-body)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: selected ? 10 : 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Execution Progress Bar (Top Edge) */}
      {effectiveStatus === "loading" && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 2,
          background: statusColors.loading,
          zIndex: 20,
          animation: 'node-progress-bar 2s linear infinite',
          width: '100%',
        }} />
      )}

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${sp[4]}px ${sp[6]}px`,
          borderBottom: `1px solid ${effectiveStatus === "error" ? ui.errorBorder : border.subtle}`,
          background: effectiveStatus === "error"
            ? `linear-gradient(135deg, ${ui.errorBg}, transparent), linear-gradient(135deg, ${accentAlpha}, transparent)`
            : `linear-gradient(135deg, ${accentAlpha}, transparent)`,
          cursor: 'grab',
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
          {editableTitle ? (
            <EditableNodeTitle
              value={editableTitle.value}
              onCommit={editableTitle.onCommit}
              placeholder={editableTitle.placeholder ?? (label || 'Untitled')}
              disabled={editableTitle.disabled}
              maxWidth={200}
            />
          ) : (
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: '#f8fafc',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>{label || 'Untitled'}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center', position: 'relative' }}>
          <AnimatePresence>
            {onGenerate && (isHovered || isExecuting) && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 10, zIndex: 100 }}
              >
                <div style={{
                  background: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: `1.5px solid ${border.active}80`,
                  borderRadius: radius.md,
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>RUN NODE</span>
                  <NodeGenerateButton 
                    onGenerate={onGenerate} 
                    isGenerating={isExecuting} 
                    size="sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {downloadUrl && (
            <NodeDownloadButton
              url={downloadUrl}
              type={downloadType === 'svg' ? 'image' : downloadType}
              nodeLabel={label}
              modelName={modelName}
              size="sm"
            />
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              title="Edit Element"
              aria-label="Edit node"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
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
              aria-label="Disconnect all connections"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
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
          {onToggleSettings && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSettings(); }}
              title="Settings"
              style={{
                background: 'transparent',
                border: 'none',
                color: settingsExpanded ? 'var(--color-text)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                borderRadius: 4,
                transition: 'all 0.1s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 18.82 1.65 1.65 0 0 0 7.35 18.2a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1-.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 12 3.18a1.65 1.65 0 0 0 1-.51V3a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 .51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1 .51V15z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div style={{
        padding: `${sp[5]}px ${sp[6]}px`,
        color: text.secondary,
        fontSize: 13,
        lineHeight: 1.6,
        position: 'relative',
        flex: 1,
      }}>
        {children}
      </div>

      {/* Settings Panel (Animated) */}
      {settingsPanel && (
        <div style={{
          overflow: 'hidden',
          maxHeight: settingsExpanded ? '400px' : '0px',
          transition: 'max-height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          borderTop: settingsExpanded ? `1px solid ${border.subtle}` : 'none',
          background: `${surface.base}CC`,
        }}>
          <div style={{ padding: `${sp[4]}px ${sp[6]}px` }}>
            {settingsPanel}
          </div>
        </div>
      )}

      {/* Footer Status Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: `${sp[2]}px ${sp[4]}px`,
        opacity: 0.6,
      }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: statusColors[effectiveStatus],
          boxShadow: `0 0 4px ${statusColors[effectiveStatus]}`,
        }} />
      </div>
    </div>
  );
}
