const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/WorkflowsPage.jsx', 'utf8');

const newHero = `
        {/* Hero section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 24,
          marginBottom: 80,
          position: 'relative'
        }}>
          {/* Subtle background glow behind the text */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            filter: 'blur(100px)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <div style={{ flex: 1, maxWidth: 650, zIndex: 1, position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 999, marginBottom: 24, fontSize: 13, color: '#aaa', fontWeight: 500 }}>
               ✨ Enhancor 2.0 is now live
            </div>
            
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.05,
              margin: '0 0 24px',
              letterSpacing: '-0.03em'
            }}>
              Drag.<br />
              Connect.<br />
              Deploy.
            </h1>
            <p style={{
              fontSize: 18,
              color: '#A9A9A9',
              lineHeight: 1.6,
              margin: '0 auto 40px',
              maxWidth: 580
            }}>
              The node-based editor for AI workflows. Connect vision models, generators, and enhancers visually, then deploy each workflow as a live API. No code required.
            </p>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => setShowNewModal(true)}
                style={{
                  background: '#3B3BFF',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 9999,
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(59, 59, 255, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(59, 59, 255, 0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(59, 59, 255, 0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Start building
              </button>
              
              <button
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 9999,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = '#666'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#444'; }}
              >
                See how it works &rarr;
              </button>
            </div>
          </div>
          
          {/* Visual Graphic */}
          <div style={{ zIndex: 1, marginTop: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img src="/hero_img.jpg" alt="AI workflow node editor" style={{ width: '100%', maxWidth: '1000px', borderRadius: 16, border: '1px solid #222', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }} />
          </div>
        </div>`;

const oldHeroRegex = /\{\/\* Hero section \*\/\}\n\s*<div style=\{\{\n\s*display: 'flex',\n\s*justifyContent: 'space-between',\n\s*alignItems: 'flex-start',\n\s*gap: 60,\n\s*marginBottom: 80,\n\s*\}\}>\n\s*<div style=\{\{ flex: 1, maxWidth: 520 \}\}>\n\s*<h1 style=\{\{\n\s*fontSize: 36,\n\s*fontWeight: 700,\n\s*color: '#f0f0f0',\n\s*lineHeight: 1\.2,\n\s*margin: '0 0 16px',\n\s*\}\}>\n\s*Build AI Image Pipelines, Deploy as API\n\s*<\/h1>\n\s*<p style=\{\{\n\s*fontSize: 15,\n\s*color: '#888',\n\s*lineHeight: 1\.6,\n\s*margin: 0,\n\s*\}\}>\n\s*Connect vision models, prompt enhancers, and image generators into workflows\n\s*— then deploy them as API endpoints and add AI image features to any app\.\n\s*<\/p>\n\s*<\/div>\n\s*<HeroPreview \/>\n\s*<\/div>/;

jsx = jsx.replace(oldHeroRegex, newHero);

fs.writeFileSync('frontend/src/WorkflowsPage.jsx', jsx);
console.log("Patched Hero section");
