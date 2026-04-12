import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { border, font, radius, sp, surface, text } from './nodeTokens';

interface UniversalSimplifiedNodeChromeProps {
  title: string;
  selected: boolean;
  children: ReactNode;
  onRun?: () => void;
  runDisabled?: boolean;
  isRunning?: boolean;
  comment?: string;
  onCommentChange?: (newComment: string) => void;
  width?: number;
  /** Set false for passive nodes (e.g. sound output) that only show comment chrome */
  showRunButton?: boolean;
  onDownload?: () => void;
}

/**
 * Minimal node chrome: title row with comment + expandable Run on hover/selected,
 * comment modal, and children as the main body (preview area).
 */
export default function UniversalSimplifiedNodeChrome({
  title,
  selected,
  children,
  onRun,
  runDisabled = false,
  isRunning = false,
  comment = '',
  onCommentChange,
  width = 320,
  /** Set false for passive nodes (e.g. sound output) that only show comment chrome */
  showRunButton = true,
  onDownload,
}: UniversalSimplifiedNodeChromeProps) {
  const [hovered, setHovered] = useState(false);
  const [chromeHovered, setChromeHovered] = useState(false);
  const [runHovered, setRunHovered] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [draftComment, setDraftComment] = useState(comment || '');
  const runWrapRef = useRef<HTMLDivElement>(null);

  const showActions = selected || hovered || chromeHovered;

  const toggleCommentModal = useCallback((open: boolean) => {
    if (open) setDraftComment(comment || '');
    setCommentModalOpen(open);
  }, [comment]);

  const saveComment = useCallback(() => {
    onCommentChange?.(draftComment);
    setCommentModalOpen(false);
  }, [draftComment, onCommentChange]);

  const modal = commentModalOpen
    ? createPortal(
        <div
          className="nodrag nopan"
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100002,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: sp[6],
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) toggleCommentModal(false);
          }}
        >
          <div
            role="dialog"
            aria-labelledby="universal-node-comment-heading"
            aria-describedby="universal-node-comment-desc"
            style={{
              width: 'min(400px, 100%)',
              background: surface.deep,
              border: `1px solid ${border.default}`,
              borderRadius: radius.lg,
              padding: sp[5],
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
            >
            <h2
              id="universal-node-comment-heading"
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              Node comment
            </h2>
            <span id="universal-node-comment-desc" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Optional note for this node
            </span>
            <textarea
              id="universal-node-comment-body"
              className="nodrag nopan"
              aria-label="Add a comment"
              value={draftComment}
              onChange={(e) => setDraftComment(e.target.value)}
              placeholder="Add a comment..."
              rows={4}
              style={{
                width: '100%',
                resize: 'vertical',
                minHeight: 96,
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${border.subtle}`,
                borderRadius: radius.md,
                color: text.primary,
                ...font.sm,
                padding: sp[3],
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: sp[3],
                marginTop: sp[4],
              }}
            >
              <button
                type="button"
                className="nodrag nopan"
                onClick={() => toggleCommentModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: text.secondary,
                  ...font.sm,
                  cursor: 'pointer',
                  padding: `${sp[2]}px ${sp[3]}px`,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="nodrag nopan"
                onClick={saveComment}
                style={{
                  background: border.active,
                  border: 'none',
                  color: '#fff',
                  ...font.sm,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: `${sp[2]}px ${sp[4]}px`,
                  borderRadius: radius.md,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {modal}
      <div
        style={{ position: 'relative', width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {showActions && (
          <div
            style={{
              position: 'absolute',
              top: -44,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: sp[2],
              opacity: showActions ? 1 : 0,
              pointerEvents: showActions ? 'auto' : 'none',
              transition: 'opacity 0.12s ease',
              zIndex: 10,
            }}
          >
            <button
              type="button"
              title="Add comment"
              className="nodrag nopan"
              onClick={() => toggleCommentModal(true)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                border: `1px solid ${border.default}`,
                background: surface.base,
                color: text.secondary,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {onDownload && (
              <button
                type="button"
                title="Download"
                className="nodrag nopan"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: radius.md,
                  border: `1px solid ${border.default}`,
                  background: surface.base,
                  color: text.secondary,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}

            {showRunButton && (hovered || isRunning || chromeHovered) ? (
              <div
                ref={runWrapRef}
                style={{ position: 'relative' }}
                onMouseEnter={() => setRunHovered(true)}
                onMouseLeave={() => setRunHovered(false)}
              >
                <button
                  type="button"
                  disabled={runDisabled || isRunning}
                  className="nodrag nopan"
                  onClick={onRun}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: runHovered ? sp[2] : 0,
                    height: 32,
                    minWidth: 32,
                    paddingLeft: runHovered ? sp[3] : 0,
                    paddingRight: runHovered ? sp[3] : 0,
                    borderRadius: radius.md,
                    border: `1px solid ${border.default}`,
                    background: surface.base,
                    color: text.primary,
                    cursor: runDisabled || isRunning ? 'not-allowed' : 'pointer',
                    opacity: runDisabled && !isRunning ? 0.5 : 1,
                    transition: 'min-width 0.15s ease, padding 0.15s ease',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {isRunning ? (
                    <span
                      className="node-spinner"
                      style={{
                        width: 14,
                        height: 14,
                        border: `2px solid ${border.subtle}`,
                        borderTop: `2px solid ${border.active}`,
                        borderRadius: '50%',
                        animation: 'node-spin 1s linear infinite',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                  <span
                    style={{
                      ...font.xs,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      maxWidth: runHovered ? 120 : 0,
                      opacity: runHovered ? 1 : 0,
                      transition: 'max-width 0.15s ease, opacity 0.12s ease',
                      overflow: 'hidden',
                    }}
                  >
                    Run
                  </span>
                </button>
                {runHovered && !runDisabled && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      right: 0,
                      marginBottom: 6,
                      padding: `${sp[2]}px ${sp[3]}px`,
                      background: '#111',
                      color: '#fff',
                      ...font.xs,
                      borderRadius: radius.sm,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    Run this node
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        <div
          style={{
            background: surface.base,
            border: `1px solid ${selected ? border.active : border.subtle}`,
            borderRadius: radius.lg,
            fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: selected
              ? `0 0 0 1px ${border.active}, 0 8px 24px rgba(0,0,0,0.35)`
              : '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${sp[3]}px ${sp[4]}px`,
              borderBottom: `1px solid ${border.subtle}`,
              minHeight: 40,
            }}
            onMouseEnter={() => setChromeHovered(true)}
            onMouseLeave={() => setChromeHovered(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: sp[2], minWidth: 0 }}>
              <span style={{ color: text.muted, flexShrink: 0 }} aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.09 3.26L16 6l-2.91 1.74L12 11l-1.09-3.26L8 6l2.91-1.74L12 2zm0 13l1.09 3.26L16 17l-2.91 1.74L12 22l-1.09-3.26L8 17l2.91-1.74L12 15z" />
                </svg>
              </span>
              <span
                style={{
                  ...font.sm,
                  fontWeight: 700,
                  color: text.primary,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </span>
            </div>
          </div>

          <div style={{ padding: sp[4] }}>{children}</div>
        </div>
      </div>
    </>
  );
}
