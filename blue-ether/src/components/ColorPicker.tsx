import React from "react";

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ColorPicker({
  color,
  onChange,
  label,
  style,
  className,
}: ColorPickerProps) {
  return (
    <div
      className={`be-color-picker ${className || ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--be-space-sm)",
        fontFamily: "var(--be-font-sans)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "32px",
          height: "32px",
          borderRadius: "var(--be-radius-sm)",
          overflow: "hidden",
          border: "1px solid var(--be-glass-border)",
          boxShadow: "var(--be-shadow-sm)",
          flexShrink: 0,
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          style={{
            position: "absolute",
            top: "-10px",
            left: "-10px",
            width: "52px",
            height: "52px",
            cursor: "pointer",
            border: "none",
            padding: 0,
          }}
        />
      </div>
      
      {label && (
        <span
          style={{
            fontSize: "var(--be-font-size-sm)",
            color: "var(--be-color-text)",
          }}
        >
          {label}
        </span>
      )}
      
      <div
        style={{
          marginLeft: "auto",
          fontSize: "var(--be-font-size-xs)",
          color: "var(--be-color-text-muted)",
          fontFamily: "monospace",
          background: "var(--be-glass-bg)",
          padding: "2px 6px",
          borderRadius: "var(--be-radius-xs)",
          border: "1px solid var(--be-glass-border)",
        }}
      >
        {color.toUpperCase()}
      </div>
    </div>
  );
}
