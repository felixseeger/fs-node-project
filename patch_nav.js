const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// Replace left side of TopBar to match the reference navigation links.
const newNav = `      {/* Left — Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '-0.5px'
          }}
        >
          Enhancor
        </button>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>How It Works</a>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Nodes</a>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>API</a>
          <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Pricing</a>
        </div>
      </div>

      {/* Right — Interface / Node Editor toggle + Login / Get Started */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#" style={{ color: '#a9a9a9', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Log In</a>
            <button 
              style={{
                background: '#3B3BFF',
                color: '#fff',
                border: 'none',
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 9999,
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
          </div>
        )}

        {currentPage === 'editor' && (
`;

// But wait, the TopBar is shared across Editor and Home. In the Editor we need the dropdown.
// Let's check how TopBar currently renders the Left side.
