import React, { useEffect, useRef, useState, useMemo, FC } from 'react';
// @ts-ignore
import { NODE_DATA, SECTIONS_META, getHandleDot } from '../data/nodeMetadata';

const CONFIG = {
  zGap: 800,
  camSpeed: 3.5,
  starCount: 150,
  colors: ['#ff003c', '#00f3ff', '#ccff00', '#ffffff'],
  texts: ["IMAGE", "VELOCITY", "BRUTAL", "SYSTEM", "FUTURE", "VIDEO", "AUDIO", "PIXEL", "HYPER", "NEON", "VOID"]
};

interface Item3D {
  el: HTMLDivElement;
  type: 'text' | 'card' | 'star';
  x: number;
  y: number;
  rot: number;
  baseZ: number;
}

interface State3D {
  scroll: number;
  targetScroll: number;
  velocity: number;
  mouseX: number;
  mouseY: number;
  lastScroll: number;
}

const Nodes3DScroll: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);
  const [velocity, setVelocity] = useState('0.00');
  const [coord, setCoord] = useState('000');

  // Flatten node data for display
  const allNodes = useMemo(() => {
    const nodes: any[] = [];
    NODE_DATA.forEach((section: any) => {
      section.items.forEach((item: any) => {
        nodes.push({ ...item, section: section.section });
      });
    });
    return nodes;
  }, []);

  const itemCount = allNodes.length * 2; 
  const loopSize = itemCount * CONFIG.zGap;

  useEffect(() => {
    if (!viewportRef.current || !worldRef.current || !containerRef.current) return undefined;

    const state: State3D = {
      scroll: 0,
      targetScroll: 0,
      velocity: 0,
      mouseX: 0,
      mouseY: 0,
      lastScroll: 0
    };

    const handleMouseMove = (e: MouseEvent) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // IntersectionObserver to only animate when in view
    let isInView = false;
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(containerRef.current);

    // Function to find scroll parent
    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (!node) return window;
      const overflowY = window.getComputedStyle(node).overflowY;
      const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
      if (isScrollable && node.scrollHeight > node.clientHeight) return node;
      return getScrollParent(node.parentElement);
    };

    const scrollParent = getScrollParent(containerRef.current);

    const handleScroll = () => {
      if (!isInView || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight;
      
      const progress = -rect.top / (totalHeight - window.innerHeight);
      state.targetScroll = Math.max(0, progress) * (loopSize / CONFIG.camSpeed);

      const currentY = scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
      state.velocity = (currentY - state.lastScroll) * 0.1;
      state.lastScroll = currentY;
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize Items
    const items: Item3D[] = [];
    const world = worldRef.current;
    world.innerHTML = ''; 

    for (let i = 0; i < itemCount; i++) {
      const el = document.createElement('div');
      el.className = 'item-3d';
      
      const nodeIndex = i % allNodes.length;
      const node = allNodes[nodeIndex];
      const sectionMeta = SECTIONS_META[node.section];

      if (i % 5 === 0) {
        const txt = document.createElement('div');
        txt.className = 'big-text-3d';
        
        let headline = CONFIG.texts[i % CONFIG.texts.length];
        if (node.section === 'Image Generation' || node.section === 'Image Editing') headline = "IMAGE";
        else if (node.section === 'Video Generation' || node.section === 'Video Editing') headline = "VIDEO";
        else if (node.section === 'Audio Generation') headline = "AUDIO";
        else if (node.section === 'Vision' || node.section === 'LLMs') headline = "VISION";
        
        txt.innerText = headline;
        el.appendChild(txt);
        items.push({
          el, type: 'text',
          x: 0, y: 0, rot: (Math.random() - 0.5) * 10,
          baseZ: -i * CONFIG.zGap
        });
      } else {
        const card = document.createElement('div');
        card.className = 'node-card-3d';
        card.style.borderColor = sectionMeta.color + '44';
        
        const accentLine = document.createElement('div');
        accentLine.className = 'accent-line-3d';
        accentLine.style.background = sectionMeta.color;
        card.appendChild(accentLine);

        const header = document.createElement('div');
        header.className = 'card-header-3d';
        header.innerHTML = `
          <span class="card-id-3d" style="color: ${sectionMeta.color}">${node.section.toUpperCase()}</span>
          <div style="width: 8px; height: 8px; background: ${sectionMeta.color}; border-radius: 2px;"></div>
        `;
        card.appendChild(header);

        const title = document.createElement('h2');
        title.className = 'card-title-3d';
        title.innerText = node.label;
        card.appendChild(title);

        const ioContainer = document.createElement('div');
        ioContainer.className = 'io-container-3d';
        
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'handles-3d';
        node.inputs.forEach((h: string) => {
          const row = document.createElement('div');
          row.className = 'handle-row-3d';
          row.innerHTML = `<span class="dot-3d" style="background: ${getHandleDot(h)}"></span><span class="label-3d">${h.replace(/-in$/, '')}</span>`;
          inputsDiv.appendChild(row);
        });
        ioContainer.appendChild(inputsDiv);

        const sep = document.createElement('div');
        sep.className = 'sep-3d';
        ioContainer.appendChild(sep);

        const outputsDiv = document.createElement('div');
        outputsDiv.className = 'handles-3d';
        node.outputs.forEach((h: string) => {
          const row = document.createElement('div');
          row.className = 'handle-row-3d';
          row.innerHTML = `<span class="dot-3d" style="background: ${getHandleDot(h)}"></span><span class="label-3d">${h.replace(/-out$/, '')}</span>`;
          outputsDiv.appendChild(row);
        });
        ioContainer.appendChild(outputsDiv);

        card.appendChild(ioContainer);
        el.appendChild(card);

        const angle = (i / itemCount) * Math.PI * 8;
        const x = Math.cos(angle) * (window.innerWidth * 0.25);
        const y = Math.sin(angle) * (window.innerHeight * 0.2);
        const rot = (Math.random() - 0.5) * 20;

        items.push({
          el, type: 'card',
          x, y, rot,
          baseZ: -i * CONFIG.zGap
        });
      }
      world.appendChild(el);
    }

    // Stars
    for (let i = 0; i < CONFIG.starCount; i++) {
        const el = document.createElement('div');
        el.className = 'star-3d';
        world.appendChild(el);
        items.push({
            el, type: 'star',
            x: (Math.random() - 0.5) * 3000,
            y: (Math.random() - 0.5) * 3000,
            rot: 0,
            baseZ: -Math.random() * loopSize
        });
    }

    let lastTime = 0;
    let frameCount = 0;

    const raf = (time: number) => {
      if (!isInView) {
        requestAnimationFrame(raf);
        return;
      }

      const delta = time - lastTime;
      lastTime = time;
      frameCount++;
      
      if (frameCount % 30 === 0) setFps(Math.round(1000 / delta));

      const lastX = state.scroll;
      state.scroll += (state.targetScroll - state.scroll) * 0.08;
      
      const currentVelocity = (state.scroll - lastX) * 0.15;
      state.velocity += (currentVelocity - state.velocity) * 0.1;
      
      if (frameCount % 5 === 0) {
        setVelocity(Math.abs(state.velocity * 5).toFixed(2));
        setCoord(Math.floor(state.scroll).toString().padStart(3, '0'));
      }

      const tiltX = state.mouseY * 4 - state.velocity * 0.4;
      const tiltY = state.mouseX * 4;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      const baseFov = 1000;
      const fov = baseFov - Math.min(Math.abs(state.velocity) * 12, 600);
      if (viewportRef.current) viewportRef.current.style.perspective = `${fov}px`;

      const cameraZ = state.scroll * CONFIG.camSpeed;

      items.forEach(item => {
          let relZ = item.baseZ + cameraZ;
          let vizZ = ((relZ % loopSize) + loopSize) % loopSize;
          if (vizZ > 500) vizZ -= loopSize;

          let alpha = 1;
          if (vizZ < -3500) alpha = 0;
          else if (vizZ < -2500) alpha = (vizZ + 3500) / 1000;
          if (vizZ > 150 && item.type !== 'star') alpha = 1 - ((vizZ - 150) / 450);
          if (alpha < 0) alpha = 0;

          item.el.style.opacity = alpha.toString();

          if (alpha > 0) {
              let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

              if (item.type === 'star') {
                  const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.15, 12));
                  trans += ` scale3d(1, 1, ${stretch})`;
              } else if (item.type === 'text') {
                  trans += ` rotateZ(${item.rot}deg)`;
                  if (Math.abs(state.velocity) > 1.5) {
                      const offset = state.velocity * 2.5;
                      item.el.style.textShadow = `${offset}px 0 rgba(255,0,60,0.5), ${-offset}px 0 rgba(0,243,255,0.5)`;
                  } else {
                      item.el.style.textShadow = 'none';
                  }
              } else {
                  const t = time * 0.0008;
                  const float = Math.sin(t + item.x * 0.01) * 8;
                  trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
              }

              item.el.style.transform = trans;
          }
      });

      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      scrollParent.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [allNodes, itemCount, loopSize]);

  return (
    <div className="nodes-3d-wrapper" ref={containerRef} style={{ height: '500vh' }}>
      <div className="nodes-3d-sticky">
        <div className="nodes-3d-viewport" ref={viewportRef}>
          <div className="nodes-3d-world" ref={worldRef}></div>
        </div>

        {/* OVERLAYS */}
        <div className="scanlines-3d"></div>
        <div className="vignette-3d"></div>
        <div className="noise-3d"></div>

        {/* HUD */}
        <div className="hud-3d">
            <div className="hud-top-3d">
            <span>NODESPACE.CORE_OS [ACTIVE]</span>
            <div className="hud-line-3d"></div>
            <span>FPS: <strong>{fps}</strong></span>
            </div>
            <div className="velocity-hud-3d">
            SCROLL_VECTORS // <strong>{velocity}</strong>
            </div>
            <div className="hud-bottom-3d">
            <span>OFFSET_Z: <strong>{coord}</strong></span>
            <div className="hud-line-3d"></div>
            <span>NODE_ENV::PRODUCTION</span>
            </div>
        </div>
      </div>

      <style>{`
        .nodes-3d-wrapper {
          position: relative;
          background: var(--color-bg, #000);
        }

        .nodes-3d-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--color-bg-alt, #030303);
        }

        .nodes-3d-viewport {
          position: absolute;
          inset: 0;
          perspective: 1000px;
          overflow: hidden;
          z-index: 1;
        }

        .nodes-3d-world {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .item-3d {
          position: absolute;
          left: 0;
          top: 0;
          backface-visibility: hidden;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .node-card-3d {
          width: 280px;
          height: 380px;
          background: rgba(12, 12, 12, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
          transform: translate(-50%, -50%);
          position: relative;
        }

        .accent-line-3d {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0.8;
        }

        .card-header-3d {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-id-3d {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .card-title-3d {
          font-size: 2rem;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #fff;
          mix-blend-mode: lighten;
        }

        .io-container-3d {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .handles-3d {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .handle-row-3d {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot-3d {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .label-3d {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sep-3d {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .big-text-3d {
          font-size: 10vw;
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.12);
          text-transform: uppercase;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          pointer-events: none;
          letter-spacing: -0.02em;
          mix-blend-mode: overlay;
        }

        .star-3d {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          transform: translate(-50%, -50%);
        }

        .scanlines-3d {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.3));
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
        }

        .vignette-3d {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 40%, #000 140%);
          z-index: 11;
          pointer-events: none;
        }

        .noise-3d {
          position: absolute;
          inset: 0;
          z-index: 12;
          opacity: 0.08;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .hud-3d {
          position: absolute;
          inset: 2rem;
          z-index: 20;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }

        .hud-top-3d, .hud-bottom-3d {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hud-3d strong { color: #00f3ff; }

        .hud-line-3d {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 1.5rem;
          position: relative;
        }

        .hud-line-3d::after {
          content: '';
          position: absolute;
          right: 0;
          top: -2px;
          width: 5px;
          height: 5px;
          background: #ff003c;
        }

        .velocity-hud-3d {
          align-self: flex-start;
          margin: auto 0;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          letter-spacing: 0.2em;
        }

        /* Light theme: match landing page tokens; 3D zone was hardcoded dark */
        [data-theme='light'] .nodes-3d-wrapper {
          background: var(--color-bg);
        }

        [data-theme='light'] .nodes-3d-sticky {
          background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 45%, var(--color-bg-alt) 100%);
        }

        [data-theme='light'] .node-card-3d {
          background: rgba(255, 255, 255, 0.82);
          border-color: var(--color-border);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
        }

        [data-theme='light'] .card-header-3d {
          border-bottom-color: var(--color-border-subtle);
        }

        [data-theme='light'] .card-title-3d {
          color: var(--color-text);
          mix-blend-mode: normal;
        }

        [data-theme='light'] .label-3d {
          color: var(--color-text-muted);
        }

        [data-theme='light'] .sep-3d {
          background: var(--color-border-subtle);
        }

        [data-theme='light'] .big-text-3d {
          -webkit-text-stroke: 1.5px rgba(15, 23, 42, 0.12);
          mix-blend-mode: multiply;
        }

        [data-theme='light'] .star-3d {
          background: rgba(15, 23, 42, 0.35);
        }

        [data-theme='light'] .scanlines-3d {
          background: linear-gradient(
            to bottom,
            transparent,
            transparent 50%,
            rgba(15, 23, 42, 0.04) 50%,
            rgba(15, 23, 42, 0.04)
          );
          opacity: 0.5;
        }

        [data-theme='light'] .vignette-3d {
          background: radial-gradient(
            circle,
            transparent 35%,
            rgba(241, 245, 249, 0.65) 100%
          );
        }

        [data-theme='light'] .noise-3d {
          opacity: 0.04;
        }

        [data-theme='light'] .hud-3d {
          color: var(--color-text-dim);
        }

        [data-theme='light'] .hud-3d strong {
          color: var(--color-brand-teal);
        }

        [data-theme='light'] .hud-line-3d {
          background: var(--color-border);
        }

        [data-theme='light'] .hud-line-3d::after {
          background: var(--color-brand-pink);
        }
      `}</style>
    </div>
  );
};

export default Nodes3DScroll;
