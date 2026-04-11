const fs = require('fs');
const file = 'frontend/src/components/ChatUI.jsx';
let content = fs.readFileSync(file, 'utf8');

// Create a renderMessageContent helper function
const renderFunction = `
  const renderMessageContent = (content, isActive) => {
    const parts = [];
    const jsonRegex = /\`\`\`(?:json)?\\n([\\s\\S]*?)\\n\`\`\`/g;
    let lastIndex = 0;
    let match;

    while ((match = jsonRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      }
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.nodes || (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type)) {
          parts.push({ type: 'workflow', data: parsed });
        } else {
          parts.push({ type: 'code', content: match[0] });
        }
      } catch (e) {
        parts.push({ type: 'code', content: match[0] });
      }
      lastIndex = jsonRegex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content });
    }

    return parts.map((part, i) => {
      if (part.type === 'text') {
        return isActive ? <DecodedText key={i} text={part.content} active={true} /> : <span key={i}>{part.content}</span>;
      } else if (part.type === 'workflow') {
        return (
          <div key={i} style={{ marginTop: 12, marginBottom: 12, padding: '12px', background: '#111', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>✨ AI Generated Workflow</div>
            <button
              onClick={() => {
                const nodes = part.data.nodes || part.data;
                const edges = part.data.edges || [];
                if (onSetNodes) onSetNodes(nodes);
                if (onSetEdges) onSetEdges(edges);
                if (onNotify) onNotify(\`Imported \${nodes.length} nodes to canvas\`, 'success');
              }}
              style={{
                background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px',
                borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: 12,
                display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Import Workflow to Canvas
            </button>
          </div>
        );
      } else {
        return (
          <pre key={i} style={{ background: '#111', padding: '8px', borderRadius: '4px', overflowX: 'auto', fontSize: '11px', marginTop: '8px', marginBottom: '8px' }}>
            <code>{part.content}</code>
          </pre>
        );
      }
    });
  };
`;

// Insert the helper function before the return statement of ChatUI
content = content.replace(
  /const handleImageClick = \(\) => \{/,
  renderFunction + '\n  const handleImageClick = () => {'
);

// Replace the message rendering
content = content.replace(
  /\{!isUser && idx === messages\.length - 1 \?\s*\(\s*<DecodedText text=\{msg\.content\} active=\{true\} \/>\s*\)\s*:\s*\(\s*msg\.content\s*\)\}/,
  "{isUser ? msg.content : renderMessageContent(msg.content, idx === messages.length - 1)}"
);

fs.writeFileSync(file, content);
console.log('Patched ChatUI.jsx to render workflow JSON imports');
