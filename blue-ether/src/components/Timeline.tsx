import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { surface, border, text, sp, radius, control } from "../tokens";

export interface TimelineProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  style?: React.CSSProperties;
}

export function Timeline({
  value,
  min = 0,
  max = 100,
  onChange,
  onScrubStart,
  onScrubEnd,
  style,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    onScrubStart?.();
    updateValueFromEvent(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValueFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    onScrubEnd?.();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateValueFromEvent = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = Math.round(min + percentage * (max - min));
    onChange(newValue);
  };

  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${sp[2]}px`,
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "var(--be-font-size-xs)",
          color: text.secondary,
          fontFamily: "var(--be-font-mono)",
        }}
      >
        <span>{min}</span>
        <span style={{ color: text.primary, fontWeight: 600 }}>{value}</span>
        <span>{max}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "relative",
          height: "24px",
          display: "flex",
          alignItems: "center",
          cursor: "ew-resize",
          touchAction: "none",
        }}
      >
        {/* Track Background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "8px",
            background: surface.deep,
            borderRadius: radius.pill,
            border: `1px solid ${border.subtle}`,
            overflow: "hidden",
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${percentage}%`,
              background: "var(--be-color-accent)",
              opacity: 0.8,
            }}
          />
        </div>

        {/* Scrubber Handle */}
        <motion.div
          style={{
            position: "absolute",
            left: `${percentage}%`,
            width: "12px",
            height: "20px",
            background: surface.raised,
            border: `1px solid ${border.default}`,
            borderRadius: radius.sm,
            x: "-50%",
            boxShadow: "var(--be-shadow-sm)",
            zIndex: 1,
          }}
          animate={{
            scale: isDragging ? 1.1 : 1,
            borderColor: isDragging ? "var(--be-color-accent)" : border.default,
          }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  );
}
