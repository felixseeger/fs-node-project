import sys

filepath = 'frontend/src/components/ChatUI.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Remove state variable
content = content.replace("  const [showImportExport, setShowImportExport] = useState(false);\n", "")

old_block = """        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={onStartNewConversation}
            className="nodrag nopan"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}
            title="New Conversation"
            aria-label="Start new conversation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>          <button 
            onClick={() => setShowImportExport(!showImportExport)}
            className="nodrag nopan"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ width: 28, height: 28, borderRadius: 8, background: showImportExport ? '#2a2a2a' : 'transparent', border: 'none', color: showImportExport ? '#aaa' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}
            title="Import/Export"
            aria-label="Toggle Import/Export options"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </button>
          <button 
            onClick={onClose}
            className="nodrag nopan"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
            title="Close"
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {showImportExport && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={handleExportWorkflow} disabled={!lastGeneratedWorkflow}
            className="nodrag nopan flex items-center gap-1.5"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ padding: '5px 10px', borderRadius: 6, background: lastGeneratedWorkflow ? '#333' : '#1a1a1a', border: 'none', color: lastGeneratedWorkflow ? '#fff' : '#555', fontSize: 11, fontWeight: 500, cursor: lastGeneratedWorkflow ? 'pointer' : 'default' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Workflow
          </button>
          <div style={{ display: 'flex', gap: 2, background: '#2a2a2a', borderRadius: 6, padding: 2 }}>
            <button onClick={handleExportChatMarkdown} disabled={messages.length === 0}
              className="nodrag nopan"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ padding: '3px 8px', borderRadius: 4, background: messages.length > 0 ? '#333' : 'transparent', border: 'none', color: messages.length > 0 ? '#fff' : '#555', fontSize: 10, fontWeight: 500, cursor: messages.length > 0 ? 'pointer' : 'default' }}>
              MD
            </button>
            <button onClick={handleExportChatJSON} disabled={messages.length === 0}
              className="nodrag nopan"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ padding: '3px 8px', borderRadius: 4, background: messages.length > 0 ? '#333' : 'transparent', border: 'none', color: messages.length > 0 ? '#fff' : '#555', fontSize: 10, fontWeight: 500, cursor: messages.length > 0 ? 'pointer' : 'default' }}>
              JSON
            </button>
          </div>
          <button onClick={handleImportWorkflow}
            className="nodrag nopan flex items-center gap-1.5"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ padding: '5px 10px', borderRadius: 6, background: '#333', border: 'none', color: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Import
          </button>
          <button onClick={handleTestRoundTrip}
            className="nodrag nopan flex items-center gap-1.5"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ padding: '5px 10px', borderRadius: 6, background: '#333', border: 'none', color: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 22h6"></path>
              <path d="M4.83 4.83a10 10 0 0 0 14.34 0"></path>
              <path d="M12 2v20"></path>
            </svg>
            Test
          </button>
        </div>
      )}"""

new_block = """        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button 
            onClick={onClose}
            className="nodrag nopan"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
            title="Close"
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Successfully replaced block")
else:
    print("Could not find the block to replace!")
    sys.exit(1)
