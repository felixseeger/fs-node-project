import React from "react";
import { motion } from "framer-motion";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  height?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = false,
  height = 6,
  color = "var(--be-color-accent)",
  style,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={`be-progress-bar ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--be-space-xs)",
        width: "100%",
        fontFamily: "var(--be-font-sans)",
        ...style,
      }}
    >
      {(label || showPercentage) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--be-font-size-xs)",
            color: "var(--be-color-text-muted)",
          }}
        >
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div
        style={{
          width: "100%",
          height,
          background: "var(--be-glass-border)",
          borderRadius: "var(--be-radius-full)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          style={{
            height: "100%",
            background: color,
            borderRadius: "var(--be-radius-full)",
          }}
        />
      </div>
    </div>
  );
}
