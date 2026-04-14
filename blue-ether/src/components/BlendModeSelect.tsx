import React from "react";
import { Icon } from "./Icon";

export type BlendMode = 
  | "normal" | "multiply" | "screen" | "overlay" 
  | "darken" | "lighten" | "color-dodge" | "color-burn" 
  | "hard-light" | "soft-light" | "difference" | "exclusion" 
  | "hue" | "saturation" | "color" | "luminosity";

export interface BlendModeSelectProps {
  value: BlendMode;
  onChange: (mode: BlendMode) => void;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
  { value: "hard-light", label: "Hard Light" },
  { value: "soft-light", label: "Soft Light" },
  { value: "difference", label: "Difference" },
  { value: "exclusion", label: "Exclusion" },
  { value: "hue", label: "Hue" },
  { value: "saturation", label: "Saturation" },
  { value: "color", label: "Color" },
  { value: "luminosity", label: "Luminosity" },
];

export function BlendModeSelect({
  value,
  onChange,
  label,
  style,
  className,
}: BlendModeSelectProps) {
  return (
    <div
      className={`be-blend-mode-select ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--be-space-xs)",
        width: "100%",
        fontFamily: "var(--be-font-sans)",
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: "var(--be-font-size-sm)",
            color: "var(--be-color-text-muted)",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as BlendMode)}
          style={{
            width: "100%",
            appearance: "none",
            background: "var(--be-glass-bg)",
            color: "var(--be-color-text)",
            border: "1px solid var(--be-glass-border)",
            borderRadius: "var(--be-radius-sm)",
            padding: "var(--be-space-sm) var(--be-space-md)",
            paddingRight: "32px",
            fontSize: "var(--be-font-size-sm)",
            cursor: "pointer",
            outline: "none",
            backdropFilter: "blur(var(--be-glass-blur))",
            WebkitBackdropFilter: "blur(var(--be-glass-blur))",
          }}
        >
          {BLEND_MODES.map((mode) => (
            <option key={mode.value} value={mode.value} style={{ background: "#1a1a1a" }}>
              {mode.label}
            </option>
          ))}
        </select>
        <div
          style={{
            position: "absolute",
            right: "8px",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--be-color-text-muted)",
          }}
        >
          <Icon name="chevron-down" size={16} crt={false} />
        </div>
      </div>
    </div>
  );
}
