const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// The original left side layout is:
/*
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* Logo with Dropdown *\/}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button ...>
            <img src="/logo-light.svg" ... />
            <svg>...</svg>
          </button>
          ... dropdown code
        </div>

        {/* Breadcrumb separator + Workflows link (always shown) *\/}
        <span style={{ color: '#444', margin: '0 12px', fontSize: 14, userSelect: 'none' }}>/</span>
        <button onClick={() => onNavigate('home')} ...>Workflows</button>
*/

// For the home page (currentPage === 'home'), we want the marketing nav links (How It Works, etc.)
// For the editor (currentPage === 'editor'), we want the regular breadcrumb and logo.

// Since the prompt asks to "edit Intro section on Homepage matching reference image", and TopBar is shared, 
// I will conditionally render the marketing links only on 'home' and remove the breadcrumb logic there.

const oldLeftSection = `<div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>`;
const newLeftSection = `<div style={{ display: 'flex', alignItems: 'center', gap: currentPage === 'home' ? 40 : 0 }}>`;
jsx = jsx.replace(oldLeftSection, newLeftSection);

// Add the marketing links right after the dropdown menu ends (which is the logo)
// The dropdown ends right before {/* Breadcrumb separator + Workflows link (always shown) */}
const oldBreadcrumb = `{/* Breadcrumb separator + Workflows link (always shown) */}`;
const newBreadcrumb = `
        {currentPage === 'home' && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>How It Works</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Nodes</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>API</a>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Pricing</a>
          </div>
        )}
        
        {currentPage !== 'home' && (
          <>
            {/* Breadcrumb separator + Workflows link (always shown) */}
`;
jsx = jsx.replace(oldBreadcrumb, newBreadcrumb);

// Close the breadcrumb conditional. The breadcrumb section ends right before {/* Workflow name (only in editor) */}
const oldWorkflowName = `{/* Workflow name (only in editor) */}`;
const newWorkflowName = `</>\n        )}\n\n        {/* Workflow name (only in editor) */}`;
jsx = jsx.replace(oldWorkflowName, newWorkflowName);

// Now add the "Log In / Get Started" to the right side.
// Find the right side container: `{/* Right — Interface / Node Editor toggle (only in editor) */}`
const oldRightSide = `{/* Right — Interface / Node Editor toggle (only in editor) */}`;
const newRightSide = `{currentPage === 'home' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#a9a9a9'}>Log In</a>
          <button 
            style={{
              background: '#3B3BFF',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 9999,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
            onMouseLeave={e => e.currentTarget.style.background = '#3B3BFF'}
          >
            Get Started
          </button>
        </div>
      )}

      {/* Right — Interface / Node Editor toggle (only in editor) */}`;
jsx = jsx.replace(oldRightSide, newRightSide);


fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched TopBar.jsx");
