const fs = require('fs');
const path = 'frontend/src/projectsDashboard/ProjectsDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add GSAP imports
const gsapImports = `import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
`;

if (!code.includes("import gsap from 'gsap';")) {
  code = code.replace("import React,", gsapImports + "import React,");
}

// 2. Add refs for animation
const refsCode = `  const dashboardRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(sidebarRef.current, { x: -50, opacity: 0 });
    gsap.set(headerRef.current, { y: -20, opacity: 0 });
    gsap.set(tabsRef.current, { y: 20, opacity: 0 });
    
    // Card elements (if any exist immediately)
    if (gridRef.current) {
      gsap.set(gridRef.current.children, { y: 30, opacity: 0, scale: 0.95 });
    }

    // Animation sequence
    tl.to(sidebarRef.current, { x: 0, opacity: 1, duration: 0.6 })
      .to(headerRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4")
      .to(tabsRef.current, { y: 0, opacity: 1, duration: 0.4 }, "-=0.3");

    // Stagger cards in
    if (gridRef.current && gridRef.current.children.length > 0) {
      tl.to(gridRef.current.children, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.2)"
      }, "-=0.2");
    }
  }, { scope: dashboardRef });

`;

if (!code.includes("const dashboardRef = React.useRef")) {
  // Find where to insert refs: inside the component, after the initial hooks
  code = code.replace(/(export const ProjectsDashboard: FC<ProjectsDashboardProps> = \({[^]*?}\) => {\n)/m, "$1" + refsCode);
}

// 3. Add refs to the JSX elements
code = code.replace(
  /<div\n\s*style={{ display: 'flex', height: '100vh', width: '100vw'/m,
  "<div\n      ref={dashboardRef}\n      style={{ display: 'flex', height: '100vh', width: '100vw'"
);

code = code.replace(
  /<aside\n\s*style={{/m,
  "<aside\n          ref={sidebarRef}\n          style={{"
);

code = code.replace(
  /<main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>\n\s*<header/m,
  "<main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>\n          <header\n            ref={headerRef}"
);

code = code.replace(
  /<div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>/m,
  "<div ref={tabsRef} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>"
);

code = code.replace(
  /<div\n\s*style={{\n\s*display: 'grid',\n\s*gridTemplateColumns: 'repeat\(auto-fill, minmax\(280px, 1fr\)\)',\n\s*gap: 20,\n\s*}}\n\s*>/m,
  "<div\n                  ref={gridRef}\n                  style={{\n                    display: 'grid',\n                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',\n                    gap: 20,\n                  }}\n                >"
);

fs.writeFileSync(path, code);
console.log("Patched ProjectsDashboard.tsx for GSAP animations");
