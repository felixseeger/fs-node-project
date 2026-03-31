import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeResizer } from '@xyflow/react';

export default function CommentNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(!data.text);
  const [dimensions, setDimensions] = useState({ width: 250, height: 150 });
  const textRef = useRef(null);

  const handleTextChange = useCallback((e) => {
    data.onUpdate?.(id, { text: e.target.value });
  }, [id, data]);

  const toggleDone = useCallback((e) => {
    e.stopPropagation();
    data.onUpdate?.(id, { isDone: !data.isDone });
  }, [id, data]);

  const toggleEdit = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(prev => !prev);
  }, []);

  // auto-focus when editing
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const isDone = data.isDone;

  const bgStyle = isDone ? '#2c2c2c' : '#4a3f1c';
  const borderStyle = isDone ? '#444' : '#856f24';
  const headerBgStyle = isDone ? '#1e1e1e' : '#362e15';
  const textStyle = isDone ? '#888' : '#ffe4b5';

  return (
    <>
      <NodeResizer 
        color="#eab308" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={100}
        onResize={(e, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
      />
      <div style={{ 
        width: dimensions.width, height: dimensions.height, 
        minWidth: 150,
        minHeight: 100,
        backgroundColor: bgStyle, 
        border: `1px solid ${selected ? '#eab308' : borderStyle}`,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: isDone ? 0.75 : 1,
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 0 1px #eab308' : '0 4px 6px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: headerBgStyle,
          borderBottom: `1px solid ${borderStyle}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: textStyle }}>
            {isDone ? 'Comment (Done)' : 'Comment'}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={toggleEdit}
              style={{
                background: 'transparent', 
                border: 'none', 
                color: textStyle, 
                cursor: 'pointer', 
                fontSize: 11, 
                padding: '2px 6px', 
                borderRadius: 4,
                transition: 'background 0.1s'
              }}
              title="Edit Comment"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={toggleDone}
              style={{
                background: isDone ? '#10b981' : 'transparent',
                border: `1px solid ${isDone ? '#10b981' : borderStyle}`,
                color: isDone ? '#fff' : textStyle,
                cursor: 'pointer', 
                fontSize: 11, 
                padding: '2px 6px', 
                borderRadius: 4,
                transition: 'all 0.1s'
              }}
              title={isDone ? 'Mark Undone' : 'Mark Done'}
              onMouseEnter={(e) => {
                if (!isDone) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!isDone) e.currentTarget.style.background = 'transparent';
              }}
            >
              {isDone ? 'Done' : 'Mark Done'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 12, overflow: 'auto', cursor: 'text' }} onDoubleClick={() => setIsEditing(true)}>
          {isEditing ? (
            <textarea
              ref={textRef}
              value={data.text || ''}
              onChange={handleTextChange}
              onBlur={() => setIsEditing(false)}
              className="nodrag nopan"
              style={{
                width: '100%', 
                height: '100%', 
                resize: 'none', 
                background: 'transparent', 
                border: 'none',
                color: '#fff', 
                fontSize: 14, 
                lineHeight: 1.5,
                outline: 'none', 
                fontFamily: 'inherit'
              }}
              placeholder="Write your comment here..."
            />
          ) : (
            <div style={{
              whiteSpace: 'pre-wrap', 
              color: isDone ? '#888' : '#fff', 
              fontSize: 14,
              lineHeight: 1.5,
              textDecoration: isDone ? 'line-through' : 'none',
              minHeight: '100%'
            }}>
              {data.text || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Double-click to edit...</span>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
