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
  fontWeight: 500,
  letterSpacing: '0.02em',
};

const smText: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.04em',
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
    color: 'var(--color-text)',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth,
    ...style,
  };

  if (disabled) {
    return (
      <span style={baseStyle} title={display}>
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
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
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
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 4,
          padding: size === 'sm' ? '2px 4px' : '2px 6px',
          outline: 'none',
          minWidth: 80,
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
        color: value.trim() ? baseStyle.color : 'var(--color-text-muted)',
      }}
      title={`${display} — double-click to edit`}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
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
    </span>
  );
}
