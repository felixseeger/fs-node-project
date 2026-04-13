import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { surface, border, text, sp, radius } from "../tokens";
import Icon from "./Icon";

export interface Layer {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface LayerStackProps {
  layers: Layer[];
  selectedId?: string | null;
  onReorder: (newLayers: Layer[]) => void;
  onLayerChange: (id: string, updates: Partial<Layer>) => void;
  onSelect?: (id: string) => void;
  style?: React.CSSProperties;
}

function LayerItem({
  layer,
  isSelected,
  onChange,
  onSelect,
}: {
  layer: Layer;
  isSelected: boolean;
  onChange: (id: string, updates: Partial<Layer>) => void;
  onSelect?: (id: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={layer}
      id={layer.id}
      dragListener={false}
      dragControls={dragControls}
      onClick={() => onSelect?.(layer.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${sp[2]}px`,
        padding: `${sp[2]}px ${sp[3]}px`,
        background: isSelected ? surface.raised : surface.sunken,
        border: `1px solid ${isSelected ? border.active : border.subtle}`,
        borderRadius: radius.md,
        marginBottom: `${sp[2]}px`,
        userSelect: "none",
        cursor: "pointer",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "var(--be-shadow-md)",
        background: surface.raised,
        borderColor: border.active,
        zIndex: 10,
      }}
    >
      {/* Drag Handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          color: text.muted,
          padding: `${sp[1]}px`,
        }}
      >
        <Icon name="menu" size={16} crt={false} />
      </div>

      {/* Visibility Toggle */}
      <button
        onClick={() => onChange(layer.id, { visible: !layer.visible })}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: layer.visible ? text.primary : text.muted,
          display: "flex",
          alignItems: "center",
          padding: `${sp[1]}px`,
        }}
      >
        <Icon name={layer.visible ? "eye" : "eye-off"} size={16} crt={false} />
      </button>

      {/* Lock Toggle */}
      <button
        onClick={() => onChange(layer.id, { locked: !layer.locked })}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: layer.locked ? text.error : text.muted,
          display: "flex",
          alignItems: "center",
          padding: `${sp[1]}px`,
        }}
      >
        <Icon name={layer.locked ? "lock" : "unlock"} size={16} crt={false} />
      </button>

      {/* Layer Name */}
      <div
        style={{
          flex: 1,
          fontSize: "var(--be-font-size-sm)",
          color: layer.visible ? text.primary : text.muted,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {layer.name}
      </div>

      {/* Opacity Slider */}
      <div style={{ display: "flex", alignItems: "center", gap: `${sp[2]}px`, width: "80px" }}>
        <input
          type="range"
          min="0"
          max="100"
          value={layer.opacity}
          onChange={(e) => onChange(layer.id, { opacity: Number(e.target.value) })}
          disabled={layer.locked}
          style={{
            width: "100%",
            cursor: layer.locked ? "not-allowed" : "ew-resize",
            opacity: layer.locked ? 0.5 : 1,
          }}
        />
        <span
          style={{
            fontSize: "var(--be-font-size-xs)",
            color: text.secondary,
            fontFamily: "var(--be-font-mono)",
            minWidth: "3ch",
            textAlign: "right",
          }}
        >
          {layer.opacity}%
        </span>
      </div>
    </Reorder.Item>
  );
}

export function LayerStack({ layers, selectedId, onReorder, onLayerChange, onSelect, style }: LayerStackProps) {
  return (
    <div style={{ width: "100%", ...style }}>
      <Reorder.Group
        axis="y"
        values={layers}
        onReorder={onReorder}
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {layers.map((layer) => (
          <LayerItem 
            key={layer.id} 
            layer={layer} 
            isSelected={layer.id === selectedId}
            onChange={onLayerChange} 
            onSelect={onSelect}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
