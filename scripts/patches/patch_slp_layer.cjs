const fs = require('fs');

const path = 'frontend/src/components/SystemLoadingProcess.tsx';
let code = fs.readFileSync(path, 'utf8');

// The original SVG
const svgTagOrig = `<svg 
            ref={logoRef as any} 
            className="slp-logo" 
            width="113" 
            height="112" 
            viewBox="0 0 113 112" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
            <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
            <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
          </svg>`;

const svgTagNew = `<svg 
            ref={logoRef as any} 
            className="slp-logo" 
            width="113" 
            height="112" 
            viewBox="0 0 113 112" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ mixBlendMode: 'screen' }}
          >
            {/* Cyan Layer */}
            <g className="slp-logo-cyan" style={{ transformOrigin: 'center', transform: 'translate(-3px, -2px) scale(1.02)' }}>
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="#00f3ff" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
            {/* Magenta Layer */}
            <g className="slp-logo-magenta" style={{ transformOrigin: 'center', transform: 'translate(3px, 2px) scale(0.98)' }}>
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="#ff00e5" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
            {/* Main Layer */}
            <g className="slp-logo-main">
              <path className="slp-logo-path" d="M30.3918 105.99V49.9899C30.3918 47.9111 32.3859 46.1434 35.0632 45.8182L47.4157 44.3758C49.9453 44.0788 52.2163 45.5778 52.2163 47.5434V51.4606L68.317 50.5556" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M95.4222 11.9071L84.4546 13.1091V11.2141C84.4546 8.7394 81.6296 6.8303 78.4353 7.12727L69.868 7.93333C67.1168 8.18788 65.0489 9.98384 65.0489 12.1051V21.4667C65.0489 22.895 65.5659 24.3091 66.526 25.5253L82.8482 46.3273C83.9007 47.6707 84.4546 49.198 84.4546 50.7535V61.5859C84.4546 63.5798 82.4974 65.2768 79.9124 65.5172L65.0489 66.903V56.9616" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
              <path className="slp-logo-path" d="M33.2353 78.3576L41.7657 77.6081" stroke="white" strokeWidth="9" strokeMiterlimit="10"/>
            </g>
          </svg>`;

code = code.replace(svgTagOrig, svgTagNew);

// Original script animation
const tlSetupOrig = `const paths = logoRef.current?.querySelectorAll('.slp-logo-path');
    if (paths) {
      paths.forEach(p => {
        const length = (p as SVGPathElement).getTotalLength();
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
      });
      tl.to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.15 }, '<');
    }`;

const tlSetupNew = `const cyanPaths = logoRef.current?.querySelectorAll('.slp-logo-cyan .slp-logo-path');
    const magentaPaths = logoRef.current?.querySelectorAll('.slp-logo-magenta .slp-logo-path');
    const mainPaths = logoRef.current?.querySelectorAll('.slp-logo-main .slp-logo-path');
    
    if (cyanPaths && magentaPaths && mainPaths) {
      [cyanPaths, magentaPaths, mainPaths].forEach(group => {
        group.forEach(p => {
          const length = (p as SVGPathElement).getTotalLength();
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });
      });
      
      tl.to(cyanPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.0')
        .to(magentaPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.1')
        .to(mainPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.15 }, '<0.1')
        .to('.slp-logo-cyan', { opacity: 0, scale: 1.05, filter: 'blur(2px)', duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .to('.slp-logo-magenta', { opacity: 0, scale: 0.95, filter: 'blur(2px)', duration: 0.6, ease: 'power2.out' }, '<');
    }`;

code = code.replace(tlSetupOrig, tlSetupNew);

fs.writeFileSync(path, code);
console.log("Patched layered offset successfully!");
