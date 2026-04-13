import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NODE_MENU } from '../config/nodeMenu';
import { IMAGE_UNIVERSAL_MODEL_DEFS } from '../nodes/imageUniversalGeneratorModels';
import { VIDEO_UNIVERSAL_MODEL_DEFS } from '../nodes/videoUniversalGeneratorModels';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  action: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: string, data?: any) => void;
  handleClear: () => void;
  handleExport: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onAddNode, handleClear, handleExport }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allCommands = useMemo<CommandItem[]>(() => {
    const commands: CommandItem[] = [];

    // 1. Nodes from NODE_MENU
    NODE_MENU.forEach((section) => {
      section.items.forEach((item) => {
        commands.push({
          id: `node-${item.type}`,
          title: item.label,
          description: `Add ${item.label} node`,
          category: `Nodes - ${section.section}`,
          action: () => onAddNode(item.type, item.defaults),
        });
      });
    });

    // 2. Image Models
    Object.entries(IMAGE_UNIVERSAL_MODEL_DEFS as Record<string, any>).forEach(([id, model]) => {
      commands.push({
        id: `image-model-${id}`,
        title: model.name,
        description: model.description || `Use ${model.name} for image generation`,
        category: 'Image Models',
        action: () => onAddNode('universalGeneratorImage', { models: [id] }),
      });
    });

    // 3. Video Models
    Object.entries(VIDEO_UNIVERSAL_MODEL_DEFS as Record<string, any>).forEach(([id, model]) => {
      commands.push({
        id: `video-model-${id}`,
        title: model.name,
        description: model.description || `Use ${model.name} for video generation`,
        category: 'Video Models',
        action: () => onAddNode('universalGeneratorVideo', { models: [id] }),
      });
    });

    // 4. Global Actions
    commands.push({
      id: 'action-clear',
      title: 'Clear Canvas',
      description: 'Remove all nodes and edges',
      category: 'Actions',
      action: handleClear,
    });
    commands.push({
      id: 'action-export',
      title: 'Export Workflow',
      description: 'Export current workflow to JSON',
      category: 'Actions',
      action: handleExport,
    });

    return commands;
  }, [onAddNode, handleClear, handleExport]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allCommands;
    const lowerQuery = query.toLowerCase();
    return allCommands.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }, [query, allCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, filteredItems]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) {
        item.action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  let globalIndex = 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            className="w-full bg-transparent border-none text-white text-xl outline-none placeholder-neutral-500"
          />
        </div>

        <div ref={listRef} className="overflow-y-auto flex-1 p-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="px-3 py-2 text-xs uppercase tracking-wider font-semibold text-neutral-500">
                {category}
              </div>
              {items.map((item) => {
                const isSelected = globalIndex === selectedIndex;
                const currentIndex = globalIndex++;

                return (
                  <div
                    key={item.id}
                    data-selected={isSelected}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.description && (
                        <span className={`text-xs ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-neutral-500 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
