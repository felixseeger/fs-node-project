const fs = require('fs');
const file = 'src/AuthPage.jsx';
let content = fs.readFileSync(file, 'utf-8');

const oldStr = `function Checkbox({ label, checked, onChange }) {
  const [hovered, setHovered] = useState(false);
  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', fontSize: 13, color: '#888', lineHeight: 1.4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={(e) => { e.preventDefault(); onChange(!checked); }}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
          background: checked ? '#3b82f6' : hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: \`1px solid \${checked ? '#3b82f6' : 'rgba(255,255,255,0.12)'}\`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-out',
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}`;

const newStr = `function Checkbox({ label, checked, onChange }) {
  const [hovered, setHovered] = useState(false);
  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', fontSize: 13, color: '#888', lineHeight: 1.4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
          background: checked ? '#3b82f6' : hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: \`1px solid \${checked ? '#3b82f6' : 'rgba(255,255,255,0.12)'}\`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-out',
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span>{label}</span>
      <input type="checkbox" checked={checked} readOnly style={{ display: 'none' }} />
    </label>
  );
}`;

if(content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content, 'utf-8');
  console.log('Fixed Checkbox component successfully.');
} else {
  console.log('Error: Could not find old string in the file.');
}
