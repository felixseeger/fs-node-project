const fs = require('fs');

let mob = fs.readFileSync('frontend/src/components/MobileNavigation.jsx', 'utf8');

if (!mob.includes('isLoginHovered')) {
  mob = mob.replace(
    /const timeline = useRef\(null\);/,
    `const timeline = useRef(null);\n  const [isLoginHovered, setIsLoginHovered] = useState(false);`
  );
}

const oldMobBtns = /<button \n\s*className="mob-nav-cta mob-nav-cta--outline"[\s\S]*?<\/button>\s*<button \n\s*className="mob-nav-cta"[\s\S]*?<\/button>/;
const newMobBtns = `<button 
            className="mob-nav-cta"
            onClick={() => { onNavigate?.('auth-login'); onClose(); }}
            title="Log in"
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <g style={{ transform: isLoginHovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease-in-out' }}>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </g>
            </svg>
            Log in
          </button>`;

if (mob.match(oldMobBtns)) {
  mob = mob.replace(oldMobBtns, newMobBtns);
}

fs.writeFileSync('frontend/src/components/MobileNavigation.jsx', mob);
console.log('Restored Mobile Nav animated login button');
