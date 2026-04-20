import sys
import re

filepath = 'frontend/src/TopBar.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Remove useStorage import
content = re.sub(r"import \{ useStorage \} from './hooks/useStorage';\n", '', content)

# Remove the hook usage
content = re.sub(r"  const \{ usage \} = useStorage\(\);\n", '', content)

# Remove the actual storage pill JSX block
# We'll use a regex that matches the div containing the storage pill
storage_pill_regex = r"          <div style=\{\{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 16 \}\}>\n\s*\{usage && \(\n\s*<div\s+title=\{`Storage: \$\{usage\.count\} / \$\{usage\.limitCount\} Assets`\}\s+style=\{\{\s*display: 'flex',\s*flexDirection: 'column',\s*gap: 4,\s*width: 120,\s*padding: '6px 12px',\s*background: 'var\(--color-surface\)',\s*border: '1px solid var\(--color-border\)',\s*borderRadius: 16\s*\}\}\n\s*>\n\s*<div style=\{\{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var\(--color-text-dim\)', fontWeight: 600 \}\}>\n\s*<span>Storage</span>\n\s*<span>\{Math\.round\(\(usage\.count / usage\.limitCount\) \* 100\)\}%</span>\n\s*</div>\n\s*<div style=\{\{ width: '100%', height: 4, background: 'var\(--color-bg\)', borderRadius: 2, overflow: 'hidden' \}\}>\n\s*<div style=\{\{\s*height: '100%',\s*background: usage\.count >= usage\.limitCount \? '#ef4444' : 'var\(--color-brand-blue\)',\s*width: `\$\{Math\.min\(100, \(usage\.count / usage\.limitCount\) \* 100\)\}%`,\s*transition: 'width 0\.3s ease-out, background-color 0\.3s ease'\s*\}\} />\n\s*</div>\n\s*</div>\n\s*\)\}\n\s*</div>"

content = re.sub(storage_pill_regex, '', content, flags=re.MULTILINE)

with open(filepath, 'w') as f:
    f.write(content)

print("Removed storage pill")
