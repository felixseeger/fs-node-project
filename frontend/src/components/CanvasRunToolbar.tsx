import React, { useCallback, useEffect, useMemo, useRef, useState, FC, ReactNode, CSSProperties, MouseEvent } from 'react';
import { Edge } from '@xyflow/react';
// @ts-ignore
import { collectDownstreamNodeIds } from '../utils/workflowRunScope';

/**
 * SECURITY: Canvas toolbar for workflow execution with input validation
 * All user-provided data is sanitized before rendering or passing to callbacks
 */

// SECURITY: Maximum limits to prevent DoS
const MAX_NODE_ID_LENGTH = 128;
const MAX_SELECTED_NODES = 1000;
const MAX_SECTIONS = 50;
const MAX_ROWS_PER_SECTION = 100;
const MAX_LABEL_LENGTH = 100;
const MAX_TITLE_LENGTH = 50;

// SECURITY: Valid node type pattern (alphanumeric, dash, underscore)
const VALID_NODE_TYPE_PATTERN = /^[a-zA-Z0-9_-]+$/;

const barStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  background: '#2a2a2a',
  border: '1px solid #3a3a3a',
  borderRadius: 999,
  padding: '6px 8px 6px 12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

const itemBtn: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#c4c4c4',
  fontSize: 13,
  fontWeight: 500,
  padding: '6px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: 'inherit',
};

const divider: CSSProperties = {
  width: 1,
  height: 18,
  background: '#3a3a3a',
  margin: '0 4px',
  flexShrink: 0,
};

const menuPanel: CSSProperties = {
  position: 'absolute',
  bottom: '100%',
  left: 0,
  marginBottom: 8,
  minWidth: 200,
  maxHeight: 280,
  overflowY: 'auto',
  background: '#2a2a2a',
  border: '1px solid #3a3a3a',
  borderRadius: 10,
  padding: 6,
  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
  zIndex: 2100,
};

const allNodesMenuPanel: CSSProperties = {
  ...menuPanel,
  minWidth: 220,
  maxHeight: 360,
};

const sectionHeaderStyle: CSSProperties = {
  fontSize: 10,
  color: '#888',
  padding: '6px 10px 4px',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 600,
};

const sectionRuleStyle: CSSProperties = {
  border: 'none',
  borderTop: '1px solid #333',
  margin: '4px 4px',
};

const menuItem: CSSProperties = {
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  color: '#e0e0e0',
  fontSize: 13,
  padding: '8px 10px',
  borderRadius: 6,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const runScopeMenuPanel: CSSProperties = {
  ...menuPanel,
  minWidth: 248,
};

function menuRowStyle(enabled: boolean): CSSProperties {
  return {
    ...menuItem,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: enabled ? '#ffffff' : '#6b6b6b',
    cursor: enabled ? 'pointer' : 'not-allowed',
  };
}

/** Filled play — primary "run all" */
const IconPlayFilled: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

/** Double chevrons → (run from selected) */
const IconDoubleChevronRight: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
  </svg>
);

/** Outlined play (run single node only) */
const IconPlayOutline: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M8 5v14l11-7-11-7z" />
  </svg>
);

/** Two overlapping outlined plays (run multiple) */
const IconPlaysOutlineOverlap: FC = () => (
  <svg width="18" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M4 6v12l9-6-9-6z" />
    <path d="M12 6v12l9-6-9-6z" />
  </svg>
);

/**
 * SECURITY: Type-safe section row definition
 */
interface NodeSectionRow {
  key: string;
  label: string;
  type: string;
  dataPatch?: Record<string, unknown>;
}

/**
 * SECURITY: Type-safe section definition
 */
interface NodeSection {
  title?: string;
  rows: NodeSectionRow[];
}

/**
 * SECURITY: Validate and sanitize node section data
 */
function sanitizeNodeSections(sections: unknown): NodeSection[] {
  if (!Array.isArray(sections)) return [];
  if (sections.length > MAX_SECTIONS) {
    console.warn(`SECURITY: Limiting sections from ${sections.length} to ${MAX_SECTIONS}`);
  }
  
  return sections.slice(0, MAX_SECTIONS).map((section, idx): NodeSection => {
    // Validate section structure
    const validSection: NodeSection = {
      title: typeof section?.title === 'string' 
        ? section.title.slice(0, MAX_TITLE_LENGTH) 
        : undefined,
      rows: [],
    };
    
    // Validate rows
    if (Array.isArray(section?.rows)) {
      if (section.rows.length > MAX_ROWS_PER_SECTION) {
        console.warn(`SECURITY: Limiting rows in section ${idx} from ${section.rows.length} to ${MAX_ROWS_PER_SECTION}`);
      }
      
      validSection.rows = section.rows.slice(0, MAX_ROWS_PER_SECTION).map((row: unknown, rIdx: number): NodeSectionRow => {
        const safeRow: NodeSectionRow = {
          key: `row-${idx}-${rIdx}`,
          label: 'Unknown',
          type: 'unknown',
        };
        
        if (row && typeof row === 'object') {
          const rowObj = row as Record<string, unknown>;
          
          // Validate key
          if (typeof rowObj.key === 'string' && rowObj.key.length <= MAX_LABEL_LENGTH) {
            safeRow.key = rowObj.key;
          }
          
          // Validate label
          if (typeof rowObj.label === 'string') {
            safeRow.label = rowObj.label.slice(0, MAX_LABEL_LENGTH);
          }
          
          // Validate type (security critical - prevents injection)
          if (typeof rowObj.type === 'string' && VALID_NODE_TYPE_PATTERN.test(rowObj.type)) {
            safeRow.type = rowObj.type;
          }
          
          // Validate dataPatch (must be plain object)
          if (rowObj.dataPatch && typeof rowObj.dataPatch === 'object' && !Array.isArray(rowObj.dataPatch)) {
            safeRow.dataPatch = rowObj.dataPatch as Record<string, unknown>;
          }
        }
        
        return safeRow;
      });
    }
    
    return validSection;
  });
}

/**
 * SECURITY: Validate node ID to prevent injection
 */
function isValidNodeId(id: string): boolean {
  return typeof id === 'string' && 
         id.length > 0 && 
         id.length <= MAX_NODE_ID_LENGTH &&
         /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * SECURITY: Sanitize selected node IDs
 */
function sanitizeSelectedNodeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  if (ids.length > MAX_SELECTED_NODES) {
    console.warn(`SECURITY: Limiting selected nodes from ${ids.length} to ${MAX_SELECTED_NODES}`);
  }
  return ids
    .filter((id): id is string => typeof id === 'string' && isValidNodeId(id))
    .slice(0, MAX_SELECTED_NODES);
}

interface RunScopeMenuItemsProps {
  onRun: (nodeIdFilterSet?: Set<string>) => Promise<void>;
  isRunning: boolean;
  edges: Edge[];
  selectedNodeIds: string[];
  onCloseMenu: () => void;
}

const RunScopeMenuItems: FC<RunScopeMenuItemsProps> = ({ onRun, isRunning, edges, selectedNodeIds, onCloseMenu }) => {
  // SECURITY: Sanitize selected node IDs
  const sanitizedIds = useMemo(
    () => sanitizeSelectedNodeIds(selectedNodeIds),
    [selectedNodeIds]
  );
  
  const ids = useMemo(() => sanitizedIds.filter(Boolean), [sanitizedIds]);
  const singleId = ids.length === 1 ? ids[0] : null;
  const canFull = !isRunning;
  const canFromSelected = !isRunning && singleId != null;
  const canSingleOnly = !isRunning && singleId != null;
  const canMulti = !isRunning && ids.length >= 2;

  const rowHover = (e: MouseEvent<HTMLButtonElement>, on: boolean, enabled: boolean) => {
    if (!enabled) return;
    (e.currentTarget as HTMLElement).style.background = on ? '#333' : 'transparent';
  };

  return (
    <>
      <button
        type="button"
        disabled={!canFull}
        style={menuRowStyle(canFull)}
        onMouseEnter={(e) => rowHover(e, true, canFull)}
        onMouseLeave={(e) => rowHover(e, false, canFull)}
        onClick={() => {
          if (!canFull) return;
          onCloseMenu();
          onRun();
        }}
      >
        <IconPlayFilled />
        Run entire workflow
      </button>
      <button
        type="button"
        disabled={!canFromSelected}
        style={menuRowStyle(canFromSelected)}
        onMouseEnter={(e) => rowHover(e, true, canFromSelected)}
        onMouseLeave={(e) => rowHover(e, false, canFromSelected)}
        onClick={() => {
          if (!canFromSelected || !singleId) return;
          onCloseMenu();
          onRun(collectDownstreamNodeIds(singleId, edges));
        }}
      >
        <IconDoubleChevronRight />
        Run from selected node
      </button>
      <button
        type="button"
        disabled={!canSingleOnly}
        style={menuRowStyle(canSingleOnly)}
        onMouseEnter={(e) => rowHover(e, true, canSingleOnly)}
        onMouseLeave={(e) => rowHover(e, false, canSingleOnly)}
        onClick={() => {
          if (!canSingleOnly || !singleId) return;
          onCloseMenu();
          onRun(new Set([singleId]));
        }}
      >
        <IconPlayOutline />
        Run selected node only
      </button>
      <button
        type="button"
        disabled={!canMulti}
        style={menuRowStyle(canMulti)}
        onMouseEnter={(e) => rowHover(e, true, canMulti)}
        onMouseLeave={(e) => rowHover(e, false, canMulti)}
        onClick={() => {
          if (!canMulti) return;
          onCloseMenu();
          onRun(new Set(ids));
        }}
      >
        <IconPlaysOutlineOverlap />
        Run selected nodes
      </button>
    </>
  );
};

interface DropdownWrapProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  alignRight?: boolean;
}

const DropdownWrap: FC<DropdownWrapProps> = ({ open, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent | any) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
    </div>
  );
};

const Chevron: FC<{ up?: boolean }> = ({ up }) => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d={up ? 'M3 7.5L6 4.5L9 7.5' : 'M3 4.5L6 7.5L9 4.5'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface CanvasRunToolbarProps {
  onRun: (nodeIdFilterSet?: Set<string>) => Promise<void>;
  isRunning: boolean;
  edges?: Edge[];
  selectedNodeIds?: string[];
  onAddImage?: () => void;
  onAddVideo?: () => void;
  onAddThreeD?: () => void;
  onAddSound?: () => void;
  onAddTextLlm?: () => void;
  onAddPrompt?: () => void;
  onAddOutput?: () => void;
  allNodesSections?: unknown[];
  onAddNodeFromMenu?: (type: string, dataPatch?: Record<string, unknown>) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onFitView?: () => void;
  onOpenBrowseModels?: () => void;
}

/**
 * Bottom canvas toolbar: quick add nodes, scope menus, models, fit view, Run.
 * SECURITY: All user inputs validated before use
 */
const CanvasRunToolbar: FC<CanvasRunToolbarProps> = ({
  onRun,
  isRunning,
  edges = [],
  selectedNodeIds = [],
  onAddImage,
  onAddVideo,
  onAddThreeD,
  onAddSound,
  onAddTextLlm,
  onAddPrompt,
  onAddOutput,
  allNodesSections,
  onAddNodeFromMenu,
  onSelectAll,
  onDeselectAll,
  onFitView,
  onOpenBrowseModels,
}) => {
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openNodes, setOpenNodes] = useState(false);
  const [openRunMenu, setOpenRunMenu] = useState(false);
  const runSplitRef = useRef<HTMLDivElement>(null);

  // SECURITY: Sanitize allNodesSections
  const sanitizedSections = useMemo(
    () => sanitizeNodeSections(allNodesSections),
    [allNodesSections]
  );
  
  // SECURITY: Sanitize selected node IDs for RunScopeMenuItems
  const sanitizedSelectedIds = useMemo(
    () => sanitizeSelectedNodeIds(selectedNodeIds),
    [selectedNodeIds]
  );

  const closeAll = useCallback(() => {
    setOpenGenerate(false);
    setOpenNodes(false);
    setOpenRunMenu(false);
  }, []);

  useEffect(() => {
    if (!openRunMenu) return undefined;
    const onDoc = (e: MouseEvent | any) => {
      if (runSplitRef.current && !runSplitRef.current.contains(e.target as Node)) setOpenRunMenu(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openRunMenu]);

  const hover = (e: MouseEvent<HTMLButtonElement>, on: boolean) => {
    (e.currentTarget as HTMLElement).style.background = on ? '#333' : 'transparent';
    (e.currentTarget as HTMLElement).style.color = on ? '#e0e0e0' : '#c4c4c4';
  };

  const generateRows = [
    { key: 'image', label: 'Image', onClick: onAddImage },
    { key: 'video', label: 'Video', onClick: onAddVideo },
    { key: '3d', label: '3D', onClick: onAddThreeD },
    { key: 'sound', label: 'Sound', onClick: onAddSound },
    { key: 'text', label: 'Text (LLM)', onClick: onAddTextLlm },
  ];

  const renderGenerateIcon = (key: string) => {
    if (key === 'video') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="6" width="14" height="12" rx="2" />
          <path d="M17 10l4-2v8l-4-2z" />
        </svg>
      );
    }
    if (key === '3d') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
          <path d="M12 2v20M4 6.5l8 4.5 8-4.5" />
        </svg>
      );
    }
    if (key === 'sound') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          <path d="M16 9.5a4 4 0 010 5" />
          <path d="M18.5 7a8 8 0 010 10" />
        </svg>
      );
    }
    if (key === 'text') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 5h16" />
          <path d="M4 9h10" />
          <path d="M4 13h16" />
          <path d="M4 17h10" />
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    );
  };

  return (
    <div style={barStyle}>
      <button
        type="button"
        style={itemBtn}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={onAddImage}
      >
        Image
      </button>
      <button
        type="button"
        style={itemBtn}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={onAddVideo}
      >
        Video
      </button>
      <button
        type="button"
        style={itemBtn}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={onAddPrompt}
      >
        Prompt
      </button>

      <DropdownWrap open={openGenerate} onClose={() => setOpenGenerate(false)}>
        <button
          type="button"
          style={itemBtn}
          onMouseEnter={(e) => hover(e, true)}
          onMouseLeave={(e) => hover(e, false)}
          onClick={() => {
            setOpenGenerate((v) => !v);
            setOpenNodes(false);
          }}
        >
          Generate
          <Chevron up={openGenerate} />
        </button>
        {openGenerate && (
          <div style={runScopeMenuPanel}>
            {generateRows.map((row) => (
              <button
                key={row.key}
                type="button"
                style={menuRowStyle(true)}
                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                  (e.currentTarget as HTMLElement).style.background = '#333';
                }}
                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
                onClick={() => {
                  setOpenGenerate(false);
                  row.onClick?.();
                }}
              >
                {renderGenerateIcon(row.key)}
                {row.label}
              </button>
            ))}
          </div>
        )}
      </DropdownWrap>

      <button
        type="button"
        style={itemBtn}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={onAddOutput}
      >
        Output
      </button>

      <DropdownWrap open={openNodes} onClose={() => setOpenNodes(false)}>
        <button
          type="button"
          style={itemBtn}
          onMouseEnter={(e) => hover(e, true)}
          onMouseLeave={(e) => hover(e, false)}
          onClick={() => {
            setOpenNodes((v) => !v);
            setOpenGenerate(false);
          }}
        >
          All nodes
          <Chevron up={openNodes} />
        </button>
        {openNodes && (
          <div style={allNodesMenuPanel}>
            {sanitizedSections.map((section, sIdx) => (
              <div key={`sec-${sIdx}-${section.title ?? 'untitled'}`}>
                {section.title == null && sIdx > 0 ? <hr style={sectionRuleStyle} /> : null}
                {section.title ? (
                  <>
                    {sIdx > 0 ? <hr style={sectionRuleStyle} /> : null}
                    <div style={sectionHeaderStyle}>{section.title}</div>
                  </>
                ) : null}
                {section.rows.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    style={menuItem}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      (e.currentTarget as HTMLElement).style.background = '#333';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      (e.currentTarget as HTMLElement).style.background = 'none';
                    }}
                    onClick={() => {
                      setOpenNodes(false);
                      if (onAddNodeFromMenu) {
                        // SECURITY: type and dataPatch already validated in sanitizeNodeSections
                        onAddNodeFromMenu(row.type, row.dataPatch);
                      }
                    }}
                  >
                    {row.label}
                  </button>
                ))}
              </div>
            ))}
            <hr style={sectionRuleStyle} />
            <button
              type="button"
              style={menuItem}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                (e.currentTarget as HTMLElement).style.background = '#333';
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
              onClick={() => {
                setOpenNodes(false);
                onSelectAll?.();
              }}
            >
              Select all
            </button>
            <button
              type="button"
              style={menuItem}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                (e.currentTarget as HTMLElement).style.background = '#333';
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
              onClick={() => {
                setOpenNodes(false);
                onDeselectAll?.();
              }}
            >
              Deselect all
            </button>
          </div>
        )}
      </DropdownWrap>

      <span style={divider} />

      <button
        type="button"
        style={itemBtn}
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={() => {
          setOpenGenerate(false);
          setOpenNodes(false);
          onOpenBrowseModels?.();
        }}
      >
        All models
      </button>

      <span style={divider} />

      <button
        type="button"
        style={{ ...itemBtn, padding: '6px 8px' }}
        title="Fit view"
        onMouseEnter={(e) => hover(e, true)}
        onMouseLeave={(e) => hover(e, false)}
        onClick={onFitView}
      >
        <Chevron up />
      </button>

      <span style={divider} />

      <div ref={runSplitRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
        <button
          type="button"
          disabled={isRunning}
          onClick={() => {
            closeAll();
            onRun();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff',
            color: '#111',
            border: 'none',
            borderRadius: '999px 0 0 999px',
            padding: '8px 14px 8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.65 : 1,
            fontFamily: 'inherit',
          }}
        >
          {isRunning ? (
            <>
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: '2px solid #ccc',
                  borderTopColor: '#111',
                  borderRadius: '50%',
                  animation: 'canvas-run-spin 0.9s linear infinite',
                }}
              />
              Running
            </>
          ) : (
            <>
              <PlayIcon />
              Run
            </>
          )}
        </button>
        <button
          type="button"
          disabled={isRunning}
          aria-label="Run options"
          onClick={() => setOpenRunMenu((v) => !v)}
          style={{
            background: '#fff',
            color: '#111',
            border: 'none',
            borderLeft: '1px solid #ddd',
            borderRadius: '0 999px 999px 0',
            padding: '8px 10px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.65 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Chevron up={false} />
        </button>
        <style>{`
          @keyframes canvas-run-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        {openRunMenu && (
          <div
            style={{
              ...runScopeMenuPanel,
              left: 'auto',
              right: 0,
              bottom: '100%',
              marginBottom: 8,
            }}
          >
            <RunScopeMenuItems
              onRun={onRun}
              isRunning={isRunning}
              edges={edges}
              selectedNodeIds={sanitizedSelectedIds}
              onCloseMenu={() => setOpenRunMenu(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasRunToolbar;
