import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { IMAGE_UNIVERSAL_MODEL_DEFS } from '../nodes/imageUniversalGeneratorModels';
import { VIDEO_UNIVERSAL_MODEL_DEFS } from '../nodes/videoUniversalGeneratorModels';
import { getUniversalModelLogo } from '../utils/universalModelLogo';

/** Shared shape for catalog entries from image/video universal defs */
export interface UniversalCatalogDef {
  name?: string;
  provider?: string;
  description?: string;
  type?: string;
  supportsImageInput?: boolean;
}

type CatalogRow =
  | {
      key: string;
      kind: 'image';
      def: UniversalCatalogDef;
      flow: 't2i' | 'i2i';
    }
  | {
      key: string;
      kind: 'video';
      def: UniversalCatalogDef;
      flow: 't2v';
      i2v: boolean;
    };

interface BadgeStyle {
  bg: string;
  color: string;
}

function slugifyKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._/-]/g, '');
}

function providerPillStyle(provider: string | undefined): BadgeStyle {
  const p = (provider || '').toLowerCase();
  if (p.includes('google') || p.includes('gemini') || p.includes('freepik')) return { bg: 'rgba(34,197,94,0.2)', color: '#4ade80' };
  if (p.includes('kling') || p.includes('runway') || p.includes('pix')) return { bg: 'rgba(20,184,166,0.2)', color: '#2dd4bf' };
  if (p.includes('editing')) return { bg: 'rgba(249,115,22,0.2)', color: '#fb923c' };
  if (p.includes('system')) return { bg: 'rgba(148,163,184,0.2)', color: '#94a3b8' };
  return { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' };
}

function capabilityBadges(entry: CatalogRow): { label: string; style: BadgeStyle }[] {
  const { kind, def } = entry;
  if (kind === 'image') {
    if (def.type === 'generation') {
      if (String(entry.key).includes('quiver-text')) return [{ label: 'txt→svg', style: { bg: 'rgba(139,92,246,0.2)', color: '#c4b5fd' } }];
      return [{ label: 'txt→img', style: { bg: 'rgba(34,197,94,0.2)', color: '#4ade80' } }];
    }
    if (String(entry.key).includes('quiver-image')) {
      return [{ label: 'img→svg', style: { bg: 'rgba(139,92,246,0.2)', color: '#c4b5fd' } }];
    }
    return [{ label: 'img→img', style: { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' } }];
  }
  const badges: { label: string; style: BadgeStyle }[] = [{ label: 'txt→vid', style: { bg: 'rgba(139,92,246,0.2)', color: '#c4b5fd' } }];
  if (def.supportsImageInput) {
    badges.push({ label: 'img→vid', style: { bg: 'rgba(236,72,153,0.2)', color: '#f472b6' } });
  }
  return badges;
}

function buildCatalog(): CatalogRow[] {
  const rows: CatalogRow[] = [];
  for (const [key, def] of Object.entries(IMAGE_UNIVERSAL_MODEL_DEFS)) {
    if (key === 'Auto') continue;
    const d = def as UniversalCatalogDef;
    rows.push({
      key,
      kind: 'image',
      def: d,
      flow: d.type === 'generation' ? 't2i' : 'i2i',
    });
  }
  for (const [key, def] of Object.entries(VIDEO_UNIVERSAL_MODEL_DEFS)) {
    if (key === 'Auto') continue;
    const d = def as UniversalCatalogDef;
    rows.push({
      key,
      kind: 'video',
      def: d,
      flow: 't2v',
      i2v: Boolean(d.supportsImageInput),
    });
  }
  return rows;
}

const TYPE_FILTER_OPTIONS = [
  { id: 'all', label: 'All types' },
  { id: 't2i', label: 'Text → image' },
  { id: 'i2i', label: 'Image → image' },
  { id: 't2v', label: 'Text → video' },
  { id: 'i2v', label: 'Image → video' },
] as const;

type TypeFilterId = (typeof TYPE_FILTER_OPTIONS)[number]['id'];

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  zIndex: 12000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
};

const modalStyle: CSSProperties = {
  width: 'min(920px, 100%)',
  maxHeight: 'min(88vh, 720px)',
  background: '#1f1f1f',
  border: '1px solid #333',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
  overflow: 'hidden',
};

export interface MegaMenuModelSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (kind: 'image' | 'video', modelKey: string) => void;
}

/**
 * Full-screen Browse Models modal (search, filters, grid). Applies model to all universal generator nodes via onSelect.
 */
export default function MegaMenuModelSearch({ open, onClose, onSelect }: MegaMenuModelSearchProps) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'image' | 'video'>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilterId>('all');

  const catalog = useMemo(() => buildCatalog(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setScope('all');
      setTypeFilter('all');
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((row) => {
      if (scope === 'image' && row.kind !== 'image') return false;
      if (scope === 'video' && row.kind !== 'video') return false;

      if (typeFilter === 't2i') {
        if (row.kind !== 'image' || row.flow !== 't2i') return false;
      } else if (typeFilter === 'i2i') {
        if (row.kind !== 'image' || row.flow !== 'i2i') return false;
      } else if (typeFilter === 't2v') {
        if (row.kind !== 'video') return false;
      } else if (typeFilter === 'i2v') {
        if (row.kind !== 'video' || !row.i2v) return false;
      }

      if (!q) return true;
      const name = (row.def.name || row.key).toLowerCase();
      const prov = (row.def.provider || '').toLowerCase();
      const id = slugifyKey(row.key);
      return name.includes(q) || prov.includes(q) || id.includes(q) || row.key.toLowerCase().includes(q);
    });
  }, [catalog, query, scope, typeFilter]);

  const handlePick = useCallback(
    (row: CatalogRow) => {
      onSelect(row.kind, row.key);
      onClose();
    },
    [onSelect, onClose]
  );

  if (!open) return null;

  return createPortal(
    <div
      style={overlayStyle}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="browse-models-title">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid #2a2a2a',
          }}
        >
          <h2 id="browse-models-title" style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#f0f0f0' }}>
            Browse models
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '12px 18px', borderBottom: '1px solid #2a2a2a', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              flex: '1 1 220px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#141414',
              border: '1px solid #333',
              borderRadius: 8,
              padding: '8px 12px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search models…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#e0e0e0',
                fontSize: 14,
                minWidth: 0,
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {(
              [
                { id: 'all' as const, label: 'All' },
                { id: 'image' as const, label: 'Image' },
                { id: 'video' as const, label: 'Video' },
              ] as const
            ).map((seg) => (
              <button
                key={seg.id}
                type="button"
                onClick={() => setScope(seg.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: scope === seg.id ? '#333' : 'transparent',
                  color: scope === seg.id ? '#fff' : '#aaa',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {seg.label}
              </button>
            ))}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilterId)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#141414',
                color: '#e0e0e0',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {TYPE_FILTER_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              title="Reset filters"
              onClick={() => {
                setQuery('');
                setScope('all');
                setTypeFilter('all');
              }}
              style={{
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#141414',
                color: '#aaa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 10,
            }}
          >
            {filtered.map((row) => {
              const logo = getUniversalModelLogo(row.key);
              const provStyle = providerPillStyle(row.def.provider);
              const caps = capabilityBadges(row);
              return (
                <button
                  key={`${row.kind}-${row.key}`}
                  type="button"
                  onClick={() => handlePick(row)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: 12,
                    background: '#252525',
                    border: '1px solid #333',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {logo ? (
                      <img src={logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: 10, color: '#555' }}>AI</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#f0f0f0', fontSize: 14 }}>{row.def.name || row.key}</div>
                    <div style={{ fontSize: 11, color: '#666', fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{slugifyKey(row.key)}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 4,
                          ...provStyle,
                        }}
                      >
                        {row.def.provider || 'Model'}
                      </span>
                      {caps.map((c) => (
                        <span
                          key={c.label}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: c.style.bg,
                            color: c.style.color,
                          }}
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                    {row.def.description ? (
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8, lineHeight: 1.45 }}>{row.def.description}</div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: 32, fontSize: 14 }}>No models match your filters.</div>
          ) : null}
        </div>

        <div style={{ padding: '10px 18px', borderTop: '1px solid #2a2a2a', fontSize: 12, color: '#888' }}>
          {filtered.length} model{filtered.length === 1 ? '' : 's'} found
        </div>
      </div>
    </div>,
    document.body
  );
}
