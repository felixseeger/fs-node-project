import { useState, useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';

export interface EditableNodeTitleProps {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: CSSProperties;
  /** Max width for ellipsis; default 200 */
  maxWidth?: number | string;
  /** Smaller variant for compact toolbars (e.g. image generator bar) */
  size?: 'md' | 'sm';
}

const mdText: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.01em',
};

const smText: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.03em',
};

/**
 * Inline node title: double-click to edit. Commits on blur or Enter; Escape cancels.
 * Uses nodrag/nopan and stops pointer propagation so React Flow does not steal focus.
 */
export default function EditableNodeTitle({
  value,
  onCommit,
  placeholder = 'Untitled',
  disabled = false,
  style,
  maxWidth = 200,
  size = 'md',
}: EditableNodeTitleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const baseText = size === 'sm' ? smText : mdText;

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    onCommit(draft.trim());
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const display = value.trim() || placeholder;

  const baseStyle: CSSProperties = {
    ...baseText,
    color: '#f8fafc',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    ...style,
  };

  if (disabled) {
    return (
      <span style={{...baseStyle, opacity: 0.6}} title={display}>
        {display}
      </span>
    );
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="nodrag nopan"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        style={{
          ...baseStyle,
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(59, 130, 246, 0.6)',
          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2), inset 0 1px 2px rgba(0,0,0,0.2)',
          borderRadius: 6,
          padding: size === 'sm' ? '2px 6px' : '4px 8px',
          outline: 'none',
          minWidth: 100,
          textShadow: 'none',
        }}
        aria-label="Node title"
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className="nodrag nopan"
      style={{
        ...baseStyle,
        cursor: 'text',
        color: value.trim() ? baseStyle.color : 'rgba(255, 255, 255, 0.4)',
        padding: size === 'sm' ? '2px 6px' : '4px 8px',
        borderRadius: 6,
        margin: size === 'sm' ? '-2px -6px' : '-4px -8px',
        background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
      }}
      title={`${display} — double-click to edit`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setEditing(true);
        }
      }}
    >
      {display}
      {isHovered && !value.trim() && (
        <span style={{ fontSize: 10, marginLeft: 6, color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Edit title</span>
      )}
    </span>
  );
}
