import React from "react";
import { motion } from "framer-motion";

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  style,
  className,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`be-range-slider ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--be-space-xs)",
        width: "100%",
        fontFamily: "var(--be-font-sans)",
        ...style,
      }}
    >
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--be-font-size-sm)",
            color: "var(--be-color-text-muted)",
          }}
        >
          {label && <span>{label}</span>}
          {showValue && <span>{value}</span>}
        </div>
      )}
      <div
        style={{
          position: "relative",
          height: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "4px",
            background: "var(--be-glass-border)",
            borderRadius: "var(--be-radius-full)",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "var(--be-color-accent)",
              width: `${percentage}%`,
            }}
            layout
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            left: `calc(${percentage}% - 8px)`,
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "var(--be-color-text)",
            boxShadow: "var(--be-shadow-sm)",
            pointerEvents: "none",
          }}
          layout
        />
      </div>
    </div>
  );
}
