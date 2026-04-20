import os

filepath = 'frontend/src/components/ChatUI.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Width
content = content.replace('width: 340', 'width: 380')

# 2. Focus styles
content = content.replace("borderColor = '#8b5cf6'", "borderColor = '#4a4a4a'")
content = content.replace("boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'", "boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.05)'")

# 3. Send button
content = content.replace("? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#2a2a2a'", "? '#e0e0e0' : '#2a2a2a'")
content = content.replace("color: inputValue.trim() && !isGenerating && !disabled ? '#fff' : '#444'", "color: inputValue.trim() && !isGenerating && !disabled ? '#000' : '#555'")

# 4. User message bubble
content = content.replace("background: isUser ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1a1a1a'", "background: isUser ? '#2a2a2a' : '#1a1a1a'")
content = content.replace("border: isUser ? 'none' : '1px solid #2a2a2a'", "border: isUser ? '1px solid #3a3a3a' : '1px solid #2a2a2a'")

# 5. Attachment buttons (remove borders)
content = content.replace("border: referenceImages.length > 0 ? '1px solid #22c55e44' : '1px solid #2a2a2a'", "border: 'none'")
content = content.replace("border: '1px solid #2a2a2a'", "border: 'none'")
content = content.replace("border: isAssetPickerOpen ? '1px solid #3b82f644' : '1px solid #2a2a2a'", "border: 'none'")

# 6. Import/Export buttons & In-chat action buttons
content = content.replace("background: lastGeneratedWorkflow ? '#22c55e' : '#2a2a2a'", "background: lastGeneratedWorkflow ? '#333' : '#1a1a1a'")
content = content.replace("background: messages.length > 0 ? '#10b981' : 'transparent'", "background: messages.length > 0 ? '#333' : 'transparent'")
content = content.replace("background: messages.length > 0 ? '#059669' : 'transparent'", "background: messages.length > 0 ? '#333' : 'transparent'")
content = content.replace("background: '#3b82f6'", "background: '#333'")
content = content.replace("background: '#8b5cf6'", "background: '#333'")
content = content.replace("background: '#2563eb'", "background: '#2a2a2a'")

# 7. Thinking animation & Empty state icon
content = content.replace('stroke="#a78bfa"', 'stroke="#888"')

# 8. Suggestion pills
content = content.replace("'rgba(139, 92, 246, 0.1)'", "'rgba(255, 255, 255, 0.05)'")
content = content.replace("'1px solid rgba(139, 92, 246, 0.25)'", "'1px solid rgba(255, 255, 255, 0.1)'")
content = content.replace("color: '#a78bfa'", "color: '#bbb'")
content = content.replace("'rgba(139, 92, 246, 0.2)'", "'rgba(255, 255, 255, 0.1)'")
content = content.replace("'rgba(139, 92, 246, 0.4)'", "'rgba(255, 255, 255, 0.2)'")

with open(filepath, 'w') as f:
    f.write(content)
print("Updated successfully")
