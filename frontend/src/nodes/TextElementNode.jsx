import React, { useState, useRef, useEffect } from 'react';
import { NodeResizer } from '@xyflow/react';

const IconButton = ({ icon, onClick, title }) => (
    <button
        type="button"
        onMouseDown={onClick}
        title={title}
        style={{
            background: 'transparent', border: 'none', color: '#a0a0a0',
            cursor: 'pointer', padding: '6px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', height: '28px', width: '28px'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a0a0a0'; }}
    >
        {icon}
    </button>
);

const Divider = () => <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />;

export default function TextElementNode({ id, data, selected }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: -45 });
    const contentRef = useRef(null);
    const [html, setHtml] = useState(data.text || '<p>Double click or right-click to edit text...</p>');

    useEffect(() => {
        if (!isEditing && data.text) {
            // Only update html from server if it differs significantly from our local state
            if (contentRef.current && contentRef.current.innerHTML !== data.text) {
                setHtml(data.text);
            } else if (!contentRef.current && data.text !== html) {
                setHtml(data.text);
            }
        }
    }, [data.text, isEditing]);

    useEffect(() => {
        if (!selected) {
            setIsEditing(false);
            setShowToolbar(false);
            if (contentRef.current && data.onUpdate) {
                const currentText = contentRef.current.innerHTML;
                if (currentText !== data.text) {
                    data.onUpdate(id, { text: currentText });
                }
            }
        }
    }, [selected, id, data.onUpdate, data.text]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
        setShowToolbar(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setToolbarPos({
            x: Math.max(0, e.clientX - rect.left - 100),
            y: Math.max(-45, e.clientY - rect.top - 50)
        });
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.focus();
            }
        }, 50);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setShowToolbar(true);
        setToolbarPos({ x: 0, y: -45 });
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.focus();
                if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
                    const range = document.createRange();
                    range.selectNodeContents(contentRef.current);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }, 50);
    };

    const exec = (e, cmd, val = null) => {
        e.preventDefault();
        document.execCommand(cmd, false, val);
        if (contentRef.current && data.onUpdate) {
            data.onUpdate(id, { text: contentRef.current.innerHTML });
        }
    };

    return (
        <div
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClick}
            style={{
                padding: '16px 20px',
                minWidth: 200,
                minHeight: 60,
                background: data.bgColor || (isEditing || selected ? 'rgba(0,0,0,0.5)' : 'transparent'),
                border: selected ? '1px solid #3b82f6' : '1px solid transparent',
                borderRadius: 12,
                position: 'relative',
                boxSizing: 'border-box'
            }}
        >
            <NodeResizer color="#3b82f6" isVisible={selected} minWidth={150} minHeight={50} />

            {showToolbar && (
                <div
                    className="nodrag"
                    style={{
                        position: 'absolute',
                        top: toolbarPos.y,
                        left: toolbarPos.x,
                        background: '#1e1e1e',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 8,
                        padding: '4px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        zIndex: 1000,
                        width: 'max-content'
                    }}
                    onMouseDown={e => e.stopPropagation()}
                >
                    <IconButton title="Bold" onClick={e => exec(e, 'bold')} icon={<span style={{ fontWeight: 'bold', fontSize: 13 }}>B</span>} />
                    <IconButton title="Italic" onClick={e => exec(e, 'italic')} icon={<span style={{ fontStyle: 'italic', fontSize: 13, fontFamily: 'serif' }}>I</span>} />
                    <IconButton title="Underline" onClick={e => exec(e, 'underline')} icon={<span style={{ textDecoration: 'underline', fontSize: 13 }}>U</span>} />
                    <IconButton title="Strikethrough" onClick={e => exec(e, 'strikeThrough')} icon={<span style={{ textDecoration: 'line-through', fontSize: 13 }}>S</span>} />
                    <Divider />
                    <IconButton title="Heading 1" onClick={e => exec(e, 'formatBlock', 'H1')} icon={<span style={{ fontSize: 12, fontWeight: 'bold' }}>H1</span>} />
                    <IconButton title="Heading 2" onClick={e => exec(e, 'formatBlock', 'H2')} icon={<span style={{ fontSize: 12, fontWeight: 'bold' }}>H2</span>} />
                    <IconButton title="Paragraph" onClick={e => exec(e, 'formatBlock', 'P')} icon={<span style={{ fontSize: 12 }}>P</span>} />
                    <Divider />
                    <IconButton title="Align Left" onClick={e => exec(e, 'justifyLeft')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>} />
                    <IconButton title="Align Center" onClick={e => exec(e, 'justifyCenter')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>} />
                    <IconButton title="Align Right" onClick={e => exec(e, 'justifyRight')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>} />
                    <Divider />
                    <IconButton title="Bullet List" onClick={e => exec(e, 'insertUnorderedList')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>} />
                    <IconButton title="Numbered List" onClick={e => exec(e, 'insertOrderedList')} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>} />
                    <Divider />
                    <label style={{ cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' }} title="Text Color">
                        <input
                            type="color"
                            defaultValue="#e0e0e0"
                            onChange={e => {
                                document.execCommand('foreColor', false, e.target.value);
                                if (contentRef.current && data.onUpdate) data.onUpdate(id, { text: contentRef.current.innerHTML });
                            }}
                            style={{ width: 18, height: 18, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
                        />
                    </label>
                </div>
            )}

            <div
                ref={contentRef}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                className={isEditing ? 'nodrag nopan nowheel' : ''}
                onBlur={() => {
                    if (data.onUpdate) data.onUpdate(id, { text: contentRef.current.innerHTML });
                }}
                style={{
                    outline: 'none',
                    color: data.textColor || '#e0e0e0',
                    cursor: isEditing ? 'text' : (selected ? 'move' : 'pointer'),
                    fontFamily: 'Inter, system-ui, sans-serif',
                    height: '100%',
                    width: '100%',
                    wordBreak: 'break-word',
                    lineHeight: 1.5,
                    fontSize: 14,
                    userSelect: isEditing ? 'text' : 'none',
                    WebkitUserSelect: isEditing ? 'text' : 'none',
                    pointerEvents: 'auto'
                }}
                onKeyDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => { if (isEditing) e.stopPropagation(); }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            <style>{`
        div[contentEditable] ul, div[contentEditable] ol { margin-top: 4px; margin-bottom: 4px; margin-left: 20px; padding-left: 0; }
        div[contentEditable] h1 { font-size: 24px; font-weight: 700; margin: 8px 0; }
        div[contentEditable] h2 { font-size: 20px; font-weight: 600; margin: 8px 0; }
        div[contentEditable] p { margin: 0 0 8px 0; }
        div[contentEditable] p:last-child { margin-bottom: 0; }
        div[contentEditable] a { color: #3b82f6; text-decoration: underline; }
      `}</style>
        </div>
    );
}