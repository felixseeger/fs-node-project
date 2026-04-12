import React, { useState, useEffect, useCallback, type FC } from 'react';
import { createPortal } from 'react-dom';

export const PROJECT_SETTINGS_STORAGE_KEY = 'nodespace-project-settings-v1';

export interface ProjectSettings {
  embedImagesBase64: boolean;
  showModelSettingsOnNodes: boolean;
  defaultImageModel: string;
  defaultVideoModel: string;
  llmProvider: string;
  llmModel: string;
  llmTemp: number;
  llmTokens: number;
  panMode: string;
  zoomMode: string;
  selectionMode: string;
}

const DEFAULT_STORED: ProjectSettings = {
  embedImagesBase64: false,
  showModelSettingsOnNodes: false,
  defaultImageModel: '',
  defaultVideoModel: '',
  llmProvider: 'Google',
  llmModel: 'Gemini 3 Flash',
  llmTemp: 0.7,
  llmTokens: 8192,
  panMode: 'spaceDrag',
  zoomMode: 'altScroll',
  selectionMode: 'click',
};

export function loadProjectSettingsFromStorage(): ProjectSettings {
  try {
    const raw = localStorage.getItem(PROJECT_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORED };
    return { ...DEFAULT_STORED, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STORED };
  }
}

const LLM_PROVIDERS = ['Google', 'OpenAI', 'Google'] as const;
type LLMProvider = typeof LLM_PROVIDERS[number];

const LLM_MODELS: Record<string, string[]> = {
  Google: ['Gemini 3 Flash', 'Gemini 2.5 Pro', 'Gemini 2.0 Flash'],
  OpenAI: ['GPT-4.1', 'GPT-4o', 'o3-mini'],
  Anthropic: ['Claude Sonnet 4', 'Claude Opus 4', 'Claude 3.5 Haiku'],
};

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow: FC<ToggleRowProps> = ({ label, description, checked, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid #2a2a2a',
        gap: 16,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 4, lineHeight: 1.45 }}>{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          background: checked ? '#3b82f6' : '#3a3a3a',
          position: 'relative',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
          }}
        />
      </button>
    </div>
  );
};

interface SegmentedOption {
  id: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

const Segmented: FC<SegmentedProps> = ({ options, value, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        background: '#141414',
        borderRadius: 8,
        padding: 3,
        gap: 2,
        border: '1px solid #333',
      }}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              flex: 1,
              padding: '8px 6px',
              fontSize: 10,
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              background: active ? '#3a3a3a' : 'transparent',
              color: active ? '#e0e0e0' : '#888',
              lineHeight: 1.2,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

function selectStyle(): React.CSSProperties {
  return {
    width: '100%',
    marginTop: 8,
    padding: '10px 12px',
    fontSize: 13,
    background: '#1a1a1a',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    color: '#e0e0e0',
    cursor: 'pointer',
  };
}

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectName?: string;
  onRenameProject?: (name: string) => void;
}

export const ProjectSettingsModal: FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  initialProjectName = '',
  onRenameProject,
}) => {
  const [mounted, setMounted] = useState(typeof window !== 'undefined');
  const [tab, setTab] = useState('project');

  const [projectName, setProjectName] = useState('');
  const [embedImagesBase64, setEmbedImagesBase64] = useState(false);
  const [showModelSettingsOnNodes, setShowModelSettingsOnNodes] = useState(false);

  const [defaultImageModel, setDefaultImageModel] = useState('');
  const [defaultVideoModel, setDefaultVideoModel] = useState('');
  const [llmProvider, setLlmProvider] = useState('Google');
  const [llmModel, setLlmModel] = useState('Gemini 3 Flash');
  const [llmTemp, setLlmTemp] = useState(0.7);
  const [llmTokens, setLlmTokens] = useState(8192);

  const [panMode, setPanMode] = useState('spaceDrag');
  const [zoomMode, setZoomMode] = useState('altScroll');
  const [selectionMode, setSelectionMode] = useState('click');

  useEffect(() => {
    setMounted(typeof window !== 'undefined');
  }, []);

  const resetForm = useCallback(() => {
    const s = loadProjectSettingsFromStorage();
    setProjectName(initialProjectName || '');
    setEmbedImagesBase64(!!s.embedImagesBase64);
    setShowModelSettingsOnNodes(!!s.showModelSettingsOnNodes);
    setDefaultImageModel(s.defaultImageModel || '');
    setDefaultVideoModel(s.defaultVideoModel || '');
    setLlmProvider(s.llmProvider || 'Google');
    setLlmModel(s.llmModel || 'Gemini 3 Flash');
    setLlmTemp(typeof s.llmTemp === 'number' ? s.llmTemp : 0.7);
    setLlmTokens(typeof s.llmTokens === 'number' ? s.llmTokens : 8192);
    setPanMode(s.panMode || 'spaceDrag');
    setZoomMode(s.zoomMode || 'altScroll');
    setSelectionMode(s.selectionMode || 'click');
    setTab('project');
  }, [initialProjectName]);

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

  const handleSave = () => {
    const payload: ProjectSettings = {
      embedImagesBase64,
      showModelSettingsOnNodes,
      defaultImageModel,
      defaultVideoModel,
      llmProvider,
      llmModel,
      llmTemp,
      llmTokens,
      panMode,
      zoomMode,
      selectionMode,
    };
    try {
      localStorage.setItem(PROJECT_SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Project settings save failed', e);
    }
    const trimmed = projectName.trim();
    if (trimmed && trimmed !== (initialProjectName || '').trim()) {
      Promise.resolve(onRenameProject?.(trimmed)).catch((e) => console.error(e));
    }
    onClose?.();
  };

  const handleCancel = () => {
    resetForm();
    onClose?.();
  };

  if (!isOpen || !mounted) return null;

  const tabs = [
    { id: 'project', label: 'Project' },
    { id: 'defaults', label: 'Node Defaults' },
    { id: 'canvas', label: 'Canvas' },
  ];

  const imageModelLabel = defaultImageModel
    ? defaultImageModel
    : 'System default (Gemini nano-banana-pro)';
  const videoModelLabel = defaultVideoModel ? defaultVideoModel : 'None set (select on first use)';

  const modal = (
    <div
      onClick={handleCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          maxHeight: 'min(85vh, 720px)',
          background: '#1e1e1e',
          borderRadius: 14,
          border: '1px solid #2a2a2a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ padding: '18px 20px 12px', flexShrink: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Project Settings
          </h2>
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginTop: 14,
              padding: 4,
              background: '#141414',
              borderRadius: 10,
              border: '1px solid #2a2a2a',
            }}
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    fontSize: 11,
                    fontWeight: 600,
                    border: active ? '1px solid #e0e0e0' : '1px solid transparent',
                    borderRadius: 8,
                    background: active ? '#252525' : 'transparent',
                    color: active ? '#fff' : '#888',
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 20px 16px',
            minHeight: 0,
          }}
        >
          {tab === 'project' && (
            <div style={{ paddingTop: 4 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block' }}>Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 12px',
                  fontSize: 13,
                  background: '#1a1a1a',
                  border: '1px solid #3a3a3a',
                  borderRadius: 8,
                  color: '#e0e0e0',
                  boxSizing: 'border-box',
                }}
              />
              <ToggleRow
                label="Embed images as base64"
                description="Embeds all images in workflow, larger workflow files. Can hit memory limits on very large workflows."
                checked={embedImagesBase64}
                onChange={setEmbedImagesBase64}
              />
              <ToggleRow
                label="Show model settings on nodes"
                description="Show model parameters inside generation nodes instead of the side panel."
                checked={showModelSettingsOnNodes}
                onChange={setShowModelSettingsOnNodes}
              />
            </div>
          )}

          {tab === 'defaults' && (
            <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  padding: '12px 14px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Default Image Model</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{imageModelLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDefaultImageModel((m) => (m ? '' : 'Gemini nano-banana-pro'))}
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    background: '#2a2a2a',
                    border: '1px solid #3a3a3a',
                    borderRadius: 6,
                    color: '#e0e0e0',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Select Model
                </button>
              </div>
              <div
                style={{
                  padding: '12px 14px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Default Video Model</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{videoModelLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDefaultVideoModel((m) => (m ? '' : 'Kling 3'))}
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    background: '#2a2a2a',
                    border: '1px solid #3a3a3a',
                    borderRadius: 6,
                    color: '#e0e0e0',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Select Model
                </button>
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Default LLM Settings</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                  Using system defaults ({llmProvider} {llmModel})
                </div>
                <label style={{ fontSize: 11, color: '#888', marginTop: 12, display: 'block' }}>Provider</label>
                <select
                  value={llmProvider}
                  onChange={(e) => {
                    const next = e.target.value;
                    setLlmProvider(next);
                    const models = LLM_MODELS[next] || [];
                    setLlmModel(models[0] || '');
                  }}
                  style={selectStyle()}
                >
                  {LLM_PROVIDERS.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
                <label style={{ fontSize: 11, color: '#888', marginTop: 10, display: 'block' }}>Model</label>
                <select
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  style={selectStyle()}
                >
                  {(LLM_MODELS[llmProvider] || []).map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                    Temp: {llmTemp.toFixed(1)}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.1}
                    value={llmTemp}
                    onChange={(e) => setLlmTemp(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#888' }}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                    Tokens: {llmTokens.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min={1024}
                    max={32768}
                    step={1024}
                    value={llmTokens}
                    onChange={(e) => setLlmTokens(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#888' }}
                  />
                </div>
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Execution Settings</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 8, lineHeight: 1.45 }}>
                  Parallel runs and timeouts are managed per node. Advanced execution options will appear here.
                </div>
              </div>
            </div>
          )}

          {tab === 'canvas' && (
            <div style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px', lineHeight: 1.45 }}>
                Configure how you navigate and interact with the canvas.
              </p>
              <div
                style={{
                  padding: '14px 16px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Pan Mode</span>
                  <span style={{ fontSize: 10, color: '#666' }}>Hold Space and drag to pan</span>
                </div>
                <Segmented
                  options={[
                    { id: 'spaceDrag', label: 'Space + Drag' },
                    { id: 'middleMouse', label: 'Middle Mouse' },
                    { id: 'alwaysOn', label: 'Always On' },
                  ]}
                  value={panMode}
                  onChange={setPanMode}
                />
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Zoom Mode</span>
                  <span style={{ fontSize: 10, color: '#666' }}>Hold Alt and scroll to zoom</span>
                </div>
                <Segmented
                  options={[
                    { id: 'altScroll', label: 'Alt + Scroll' },
                    { id: 'ctrlScroll', label: 'Ctrl + Scroll' },
                    { id: 'scroll', label: 'Scroll' },
                  ]}
                  value={zoomMode}
                  onChange={setZoomMode}
                />
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  background: '#1a1a1a',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>Selection Mode</span>
                  <span style={{ fontSize: 10, color: '#666' }}>Click to select nodes</span>
                </div>
                <Segmented
                  options={[
                    { id: 'click', label: 'Click' },
                    { id: 'altDrag', label: 'Alt + Drag' },
                    { id: 'shiftDrag', label: 'Shift + Drag' },
                  ]}
                  value={selectionMode}
                  onChange={setSelectionMode}
                />
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '12px 20px 18px',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            flexShrink: 0,
            background: '#1e1e1e',
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              background: '#fff',
              border: 'none',
              borderRadius: 8,
              color: '#111',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
};

export default ProjectSettingsModal;
