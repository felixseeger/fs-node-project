import { useState, useRef, useEffect, useMemo } from 'react';
import { HANDLE_COLORS } from './utils/handleTypes';
import { getNodeDefaults } from './config/nodeMenu';

type DataKind = 'image' | 'text' | 'video' | 'audio';

type NodeOption = { type: string; label: string };

// ── Node type lists organized by what they accept (targets) or produce (sources) ──

const IMAGE_TARGET_OPTIONS: NodeOption[] = [
  { type: 'imageAnalyzer', label: 'Gemini 3 Pro' },
  { type: 'imageToPrompt', label: 'Image to Prompt' },
  { type: 'universalGeneratorImage', label: 'Universal Image (Edit)' },
  { type: 'quiverImageToVector', label: 'Quiver Image to Vector' },
  { type: 'improvePrompt', label: 'Improve Prompt' },
  { type: 'aiImageClassifier', label: 'AI Image Classifier' },
  { type: 'layerEditor', label: 'Layer Editor' },
  { type: 'response', label: 'Response' },
];

const TEXT_TARGET_OPTIONS: NodeOption[] = [
  { type: 'universalGeneratorImage', label: 'Universal Image (Generate)' },
  { type: 'universalGeneratorVideo', label: 'Universal Video' },
  { type: 'tripo3d', label: 'Tripo3D' },
  { type: 'improvePrompt', label: 'Improve Prompt' },
  { type: 'musicGeneration', label: 'ElevenLabs Music' },
  { type: 'soundEffects', label: 'ElevenLabs Sound Effects' },
  { type: 'voiceover', label: 'ElevenLabs Voiceover' },
  { type: 'response', label: 'Response' },
  { type: 'comment', label: 'Comment' },
];

const VIDEO_TARGET_OPTIONS: NodeOption[] = [
  { type: 'vfx', label: 'Video FX' },
  { type: 'creativeVideoUpscale', label: 'Creative Video Upscale' },
  { type: 'precisionVideoUpscale', label: 'Precision Video Upscale' },
  { type: 'response', label: 'Response' },
];

const AUDIO_TARGET_OPTIONS: NodeOption[] = [
  { type: 'audioIsolation', label: 'SAM Audio Isolation' },
  { type: 'response', label: 'Response' },
];

const IMAGE_SOURCE_OPTIONS: NodeOption[] = [
  { type: 'imageNode', label: 'Image Input' },
  { type: 'assetNode', label: 'Asset' },
  { type: 'sourceMediaNode', label: 'Source Media Upload' },
  { type: 'universalGeneratorImage', label: 'Universal Image' },
  { type: 'layerEditor', label: 'Layer Editor' },
  { type: 'routerNode', label: 'Router' },
];

const TEXT_SOURCE_OPTIONS: NodeOption[] = [
  { type: 'textNode', label: 'Text Input' },
  { type: 'imageToPrompt', label: 'Image to Prompt' },
  { type: 'improvePrompt', label: 'Improve Prompt' },
  { type: 'aiImageClassifier', label: 'AI Image Classifier' },
  { type: 'routerNode', label: 'Router' },
];

const VIDEO_SOURCE_OPTIONS: NodeOption[] = [
  { type: 'universalGeneratorVideo', label: 'Universal Video' },
  { type: 'vfx', label: 'Video FX' },
  { type: 'creativeVideoUpscale', label: 'Creative Video Upscale' },
  { type: 'precisionVideoUpscale', label: 'Precision Video Upscale' },
  { type: 'routerNode', label: 'Router' },
];

const AUDIO_SOURCE_OPTIONS: NodeOption[] = [
  { type: 'musicGeneration', label: 'ElevenLabs Music' },
  { type: 'soundEffects', label: 'ElevenLabs Sound Effects' },
  { type: 'audioIsolation', label: 'SAM Audio Isolation' },
  { type: 'voiceover', label: 'ElevenLabs Voiceover' },
  { type: 'routerNode', label: 'Router' },
];

const TARGET_OPTIONS_MAP: Record<DataKind, NodeOption[]> = {
  image: IMAGE_TARGET_OPTIONS,
  text: TEXT_TARGET_OPTIONS,
  video: VIDEO_TARGET_OPTIONS,
  audio: AUDIO_TARGET_OPTIONS,
};

const SOURCE_OPTIONS_MAP: Record<DataKind, NodeOption[]> = {
  image: IMAGE_SOURCE_OPTIONS,
  text: TEXT_SOURCE_OPTIONS,
  video: VIDEO_SOURCE_OPTIONS,
  audio: AUDIO_SOURCE_OPTIONS,
};

export type FlowPoint = { x: number; y: number };

export type ConnectionDropSelectPayload = {
  nodeType: string;
  defaults: Record<string, unknown> | null;
  flowPosition: FlowPoint;
};

export type ConnectionDropMenuProps = {
  position: FlowPoint;
  flowPosition: FlowPoint;
  handleType: DataKind | 'any' | null;
  connectionType: 'source' | 'target';
  onSelect: (payload: ConnectionDropSelectPayload) => void;
  onClose: () => void;
};

/**
 * ConnectionDropMenu — shown when a connection drag is dropped on empty canvas.
 * Presents compatible node types; selecting one creates the node at the drop position
 * and auto-connects the handle.
 */
export default function ConnectionDropMenu({
  position,
  flowPosition,
  handleType,
  connectionType,
  onSelect,
  onClose,
}: ConnectionDropMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');

  const options = useMemo(() => {
    if (!handleType || handleType === 'any') return [];
    const list =
      connectionType === 'source'
        ? TARGET_OPTIONS_MAP[handleType]
        : SOURCE_OPTIONS_MAP[handleType];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (o) => o.label.toLowerCase().includes(q) || o.type.toLowerCase().includes(q),
    );
  }, [handleType, connectionType, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [options.length]);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, Math.max(options.length - 1, 0)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && options[selectedIndex]) {
        e.preventDefault();
        const opt = options[selectedIndex];
        onSelect({
          nodeType: opt.type,
          defaults: getNodeDefaults(opt.type),
          flowPosition,
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedIndex, onSelect, onClose, flowPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target;
      if (menuRef.current && t instanceof Node && !menuRef.current.contains(t)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (options.length === 0) return null;

  const handleColor =
    handleType && handleType !== 'any' ? HANDLE_COLORS[handleType] : HANDLE_COLORS.any;

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      className="nodrag nopan"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        minWidth: 200,
        background: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: 12,
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a2a' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#2a2a2a',
            borderRadius: 8,
            padding: '5px 10px',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: handleColor,
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            placeholder="Search nodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#e0e0e0',
              fontSize: 12,
              outline: 'none',
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                padding: 0,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              type="button"
              key={option.type}
              onClick={() =>
                onSelect({
                  nodeType: option.type,
                  defaults: getNodeDefaults(option.type),
                  flowPosition,
                })
              }
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                width: '100%',
                padding: '7px 14px',
                textAlign: 'left',
                fontSize: 12,
                fontWeight: isSelected ? 600 : 400,
                background: isSelected ? '#2a2a2a' : 'transparent',
                border: 'none',
                color: isSelected ? '#e0e0e0' : '#aaa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'background 0.1s',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: handleColor,
                  flexShrink: 0,
                }}
              />
              {option.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '6px 12px',
          borderTop: '1px solid #2a2a2a',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9,
          color: '#555',
        }}
      >
        <span>
          <kbd
            style={{ padding: '0 4px', background: '#2a2a2a', borderRadius: 3, fontSize: 9 }}
          >
            ↑↓
          </kbd>{' '}
          navigate
        </span>
        <span>
          <kbd
            style={{ padding: '0 4px', background: '#2a2a2a', borderRadius: 3, fontSize: 9 }}
          >
            Enter
          </kbd>{' '}
          select
          <span style={{ margin: '0 4px' }}>·</span>
          <kbd
            style={{ padding: '0 4px', background: '#2a2a2a', borderRadius: 3, fontSize: 9 }}
          >
            Esc
          </kbd>{' '}
          close
        </span>
      </div>
    </div>
  );
}
