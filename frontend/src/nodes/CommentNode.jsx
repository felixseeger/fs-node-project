import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeResizer } from '@xyflow/react';

export default function CommentNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(!data.text);
  const [localText, setLocalText] = useState(data.text || '');
  const textRef = useRef(null);

  useEffect(() => {
    if (!isEditing && data.text !== undefined && data.text !== localText) {
      setLocalText(data.text);
    }
  }, [data.text, isEditing]);

  const handleTextChange = useCallback((e) => {
    const val = e.target.value;
    setLocalText(val);
    data.onUpdate?.(id, { text: val });
  }, [id, data]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  return (
    <>
      <NodeResizer
        color="#eab308"
        isVisible={selected}
        minWidth={150}
        minHeight={80}
      />
      <div style={{
        width: '100%',
        height: '100%',
        minWidth: 150,
        minHeight: 80,
        backgroundColor: '#2a2416',
        border: `1px solid ${selected ? '#eab308' : '#5a4a1a'}`,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '"JetBrains Mono", ui-monospace, "Cascadia Code", Menlo, Consolas, monospace',
        boxShadow: selected ? '0 0 0 1px #eab308' : 'none',
      }}>
        {/* Label strip */}
        <div style={{
          padding: '4px 10px',
          borderBottom: '1px solid #3a3010',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#7a6520',
          textTransform: 'uppercase',
          userSelect: 'none',
          flexShrink: 0,
        }}>
          Comment
        </div>

        {/* Body */}
        <div
          style={{ flex: 1, padding: '8px 10px', overflow: 'auto', cursor: 'default' }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <textarea
              ref={textRef}
              value={localText}
              onChange={handleTextChange}
              onBlur={() => setIsEditing(false)}
              className="nodrag nopan"
              style={{
                width: '100%',
                height: '100%',
                resize: 'none',
                background: 'transparent',
                border: 'none',
                color: '#f5d87a',
                fontSize: 13,
                lineHeight: 1.6,
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="Write a comment..."
            />
          ) : (
            <div style={{
              whiteSpace: 'pre-wrap',
              color: localText ? '#f5d87a' : '#4a3c10',
              fontSize: 13,
              lineHeight: 1.6,
              fontStyle: localText ? 'normal' : 'italic',
              userSelect: 'none',
            }}>
              {localText || 'Double-click to comment...'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
