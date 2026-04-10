import React, { useCallback, useEffect, useRef, useState, FC, PointerEvent, CSSProperties } from 'react';
import AnnotationMenu, { ANNOTATION_COLORS } from './AnnotationMenu';

const defaultColor = ANNOTATION_COLORS[0].hex;

interface Point {
  x: number;
  y: number;
}

interface Path {
  color: string;
  lineWidth: number;
  points: Point[];
}

interface TextAnnotation {
  x: number;
  y: number;
  text: string;
  color: string;
  fontPx: number;
}

interface Snapshot {
  paths: Path[];
  texts: TextAnnotation[];
}

interface AnnotationModalProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

/**
 * Fullscreen image annotation: draw, text, pan; composite export as PNG data URL.
 */
const AnnotationModal: FC<AnnotationModalProps> = ({ imageUrl, onSave, onClose }) => {
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState(defaultColor);
  const [paths, setPaths] = useState<Path[]>([]);
  const [texts, setTexts] = useState<TextAnnotation[]>([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [toastMessage, setToastMessage] = useState('');
  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<Path | null>(null);
  const panRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const toastTimerRef = useRef<any>(null);
  const pathsRef = useRef(paths);
  const textsRef = useRef(texts);

  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  useEffect(() => {
    textsRef.current = texts;
  }, [texts]);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  const pushHistory = useCallback(() => {
    const snapshot: Snapshot = {
      paths: pathsRef.current,
      texts: textsRef.current,
    };
    setUndoStack((prev) => [...prev, snapshot].slice(-100));
    setRedoStack([]);
  }, []);

  const applyNextState = useCallback((nextPaths: Path[], nextTexts: TextAnnotation[]) => {
    setPaths(nextPaths);
    setTexts(nextTexts);
  }, []);

  const handleUndo = useCallback(() => {
    if (!undoStack.length) return;
    const previous = undoStack[undoStack.length - 1];
    const current: Snapshot = {
      paths: pathsRef.current,
      texts: textsRef.current,
    };
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, current].slice(-100));
    applyNextState(previous.paths, previous.texts);
  }, [applyNextState, undoStack]);

  const handleRedo = useCallback(() => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    const current: Snapshot = {
      paths: pathsRef.current,
      texts: textsRef.current,
    };
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, current].slice(-100));
    applyNextState(next.paths, next.texts);
  }, [applyNextState, redoStack]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const w = img.clientWidth;
    const h = img.clientHeight;
    if (w < 2 || h < 2) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (const path of paths) {
      if (path.points.length < 2) continue;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      path.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
    for (const t of texts) {
      ctx.fillStyle = t.color;
      ctx.font = `${t.fontPx}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(t.text, t.x, t.y);
    }
  }, [paths, texts]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const layoutCanvas = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.clientWidth;
    const h = img.clientHeight;
    if (w < 2 || h < 2) return;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    redraw();
  }, [redraw]);

  useEffect(() => {
    window.addEventListener('resize', layoutCanvas);
    return () => window.removeEventListener('resize', layoutCanvas);
  }, [layoutCanvas]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRedo, handleUndo, onClose]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const canvasPoint = (e: PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const onCanvasPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (tool === 'draw') {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const p = canvasPoint(e);
      drawingRef.current = { color, lineWidth: 3, points: [p] };
    } else if (tool === 'text') {
      const p = canvasPoint(e);
      const label = window.prompt('Annotation text');
      if (label && label.trim()) {
        pushHistory();
        applyNextState(
          pathsRef.current,
          [...textsRef.current, { x: p.x, y: p.y, text: label.trim(), color, fontPx: 22 }]
        );
      }
    }
  };

  const onCanvasPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (tool !== 'draw' || !drawingRef.current) return;
    const p = canvasPoint(e);
    const d = drawingRef.current;
    d.points.push(p);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pts = d.points;
    if (pts.length >= 2) {
      const a = pts[pts.length - 2];
      const b = pts[pts.length - 1];
      ctx.strokeStyle = d.color;
      ctx.lineWidth = d.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  };

  const endDraw = (e: PointerEvent<HTMLCanvasElement>) => {
    if (tool !== 'draw' || !drawingRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const d = drawingRef.current;
    drawingRef.current = null;
    if (d.points.length >= 2) {
      pushHistory();
      applyNextState([...pathsRef.current, d], textsRef.current);
    }
  };

  const onViewportPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pan') return;
    e.preventDefault();
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: pan.x,
      oy: pan.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onViewportPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pan' || !panRef.current) return;
    const pr = panRef.current;
    setPan({
      x: pr.ox + (e.clientX - pr.startX),
      y: pr.oy + (e.clientY - pr.startY),
    });
  };

  const onViewportPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!panRef.current) return;
    panRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth < 2) {
      showToast('Failed to save annotation');
      return;
    }
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const dispW = img.clientWidth;
    const dispH = img.clientHeight;
    if (dispW < 2 || dispH < 2) {
      showToast('Failed to save annotation');
      return;
    }
    const sx = natW / dispW;
    const sy = natH / dispH;
    const scale = (sx + sy) / 2;

    const out = document.createElement('canvas');
    out.width = natW;
    out.height = natH;
    const octx = out.getContext('2d');
    if (!octx) return;
    octx.drawImage(img, 0, 0, natW, natH);

    for (const path of paths) {
      if (path.points.length < 2) continue;
      octx.strokeStyle = path.color;
      octx.lineWidth = path.lineWidth * scale;
      octx.lineCap = 'round';
      octx.lineJoin = 'round';
      octx.beginPath();
      path.points.forEach((p, i) => {
        const x = p.x * sx;
        const y = p.y * sy;
        if (i === 0) octx.moveTo(x, y);
        else octx.lineTo(x, y);
      });
      octx.stroke();
    }
    for (const t of texts) {
      octx.fillStyle = t.color;
      octx.font = `${Math.round(t.fontPx * scale)}px system-ui, -apple-system, sans-serif`;
      octx.fillText(t.text, t.x * sx, t.y * sy);
    }

    try {
      const dataUrl = out.toDataURL('image/png');
      onSave(dataUrl);
    } catch (err) {
      console.error('annotation export failed', err);
      showToast('Failed to save annotation');
    }
  };

  const headerBtn: CSSProperties = {
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(10,10,10,0.94)',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none',
      }}
      className="nopan nodrag"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{ ...headerBtn, background: 'rgba(255,255,255,0.08)', color: '#e5e5e5' }}
        >
          Close
        </button>
        <span style={{ color: '#a3a3a3', fontSize: 13 }}>Annotate image</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!undoStack.length}
            style={{
              ...headerBtn,
              background: undoStack.length ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              color: undoStack.length ? '#e5e5e5' : '#777',
              cursor: undoStack.length ? 'pointer' : 'not-allowed',
            }}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!redoStack.length}
            style={{
              ...headerBtn,
              background: redoStack.length ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              color: redoStack.length ? '#e5e5e5' : '#777',
              cursor: redoStack.length ? 'pointer' : 'not-allowed',
            }}
          >
            Redo
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{ ...headerBtn, background: '#2563eb', color: '#fff' }}
        >
          Done
        </button>
      </div>

      <div
        role="presentation"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: tool === 'pan' ? 'grab' : 'default',
        }}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerCancel={onViewportPointerUp}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          <div
            ref={wrapRef}
            style={{ position: 'relative', display: 'inline-block', maxWidth: '92vw', maxHeight: 'calc(100vh - 200px)' }}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt=""
              draggable={false}
              style={{
                display: 'block',
                maxWidth: '92vw',
                maxHeight: 'calc(100vh - 200px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              onLoad={layoutCanvas}
            />
            <canvas
              ref={canvasRef}
              className={tool === 'draw' || tool === 'text' ? 'nopan nodrag' : ''}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: tool === 'draw' || tool === 'text' ? 'auto' : 'none',
                touchAction: 'none',
              }}
              onPointerDown={onCanvasPointerDown}
              onPointerMove={onCanvasPointerMove}
              onPointerUp={endDraw}
              onPointerCancel={endDraw}
            />
          </div>
        </div>
      </div>

      <AnnotationMenu selectedColorHex={color} onColorChange={setColor} tool={tool} onToolChange={setTool} />
      {toastMessage ? (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 112,
            transform: 'translateX(-50%)',
            zIndex: 100003,
            background: 'rgba(190, 24, 24, 0.92)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            pointerEvents: 'none',
          }}
        >
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
};

export default AnnotationModal;
