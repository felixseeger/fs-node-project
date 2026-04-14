import React, { useState } from "react";
import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";

export interface ExportPanelProps {
  onExport: (format: string, quality: string) => void;
  isExporting?: boolean;
  progress?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function ExportPanel({
  onExport,
  isExporting = false,
  progress = 0,
  style,
  className,
}: ExportPanelProps) {
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("high");

  return (
    <div
      className={`be-export-panel ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--be-space-md)",
        padding: "var(--be-space-md)",
        background: "var(--be-bg-base)",
        borderRadius: "var(--be-radius-md)",
        border: "1px solid var(--be-glass-border)",
        fontFamily: "var(--be-font-sans)",
        width: "100%",
        maxWidth: "320px",
        ...style,
      }}
    >
      <h3 style={{ margin: 0, fontSize: "var(--be-font-size-md)", color: "var(--be-color-text)" }}>
        Export Settings
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--be-space-sm)" }}>
        <label style={{ fontSize: "var(--be-font-size-sm)", color: "var(--be-color-text-muted)" }}>
          Format
        </label>
        <div style={{ display: "flex", gap: "var(--be-space-xs)" }}>
          {["mp4", "webm", "gif"].map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              disabled={isExporting}
              style={{
                flex: 1,
                padding: "var(--be-space-xs)",
                background: format === f ? "var(--be-color-accent)" : "var(--be-glass-bg)",
                color: format === f ? "#fff" : "var(--be-color-text)",
                border: "1px solid",
                borderColor: format === f ? "transparent" : "var(--be-glass-border)",
                borderRadius: "var(--be-radius-sm)",
                cursor: isExporting ? "not-allowed" : "pointer",
                fontSize: "var(--be-font-size-sm)",
                textTransform: "uppercase",
                transition: "all 0.15s ease",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--be-space-sm)" }}>
        <label style={{ fontSize: "var(--be-font-size-sm)", color: "var(--be-color-text-muted)" }}>
          Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          disabled={isExporting}
          style={{
            width: "100%",
            padding: "var(--be-space-sm)",
            background: "var(--be-glass-bg)",
            color: "var(--be-color-text)",
            border: "1px solid var(--be-glass-border)",
            borderRadius: "var(--be-radius-sm)",
            fontSize: "var(--be-font-size-sm)",
            outline: "none",
            cursor: isExporting ? "not-allowed" : "pointer",
          }}
        >
          <option value="low">Low (Fastest)</option>
          <option value="medium">Medium (Balanced)</option>
          <option value="high">High (Best Quality)</option>
        </select>
      </div>

      {isExporting ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--be-space-sm)", marginTop: "var(--be-space-sm)" }}>
          <ProgressBar progress={progress} label="Rendering..." showPercentage />
        </div>
      ) : (
        <Button 
          variant="primary" 
          onClick={() => onExport(format, quality)}
          style={{ marginTop: "var(--be-space-sm)", width: "100%" }}
        >
          Export
        </Button>
      )}
    </div>
  );
}
