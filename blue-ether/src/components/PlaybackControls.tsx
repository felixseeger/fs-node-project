import React from "react";
import { IconButton } from "./IconButton";

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  onRepeatToggle?: () => void;
  isRepeat?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onRepeatToggle,
  isRepeat = false,
  style,
  className,
}: PlaybackControlsProps) {
  return (
    <div
      className={`be-playback-controls ${className || ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--be-space-sm)",
        padding: "var(--be-space-sm)",
        background: "var(--be-glass-bg)",
        borderRadius: "var(--be-radius-md)",
        border: "1px solid var(--be-glass-border)",
        backdropFilter: "blur(var(--be-glass-blur))",
        WebkitBackdropFilter: "blur(var(--be-glass-blur))",
        ...style,
      }}
    >
      {onRepeatToggle && (
        <IconButton
          icon="repeat"
          variant="ghost"
          active={isRepeat}
          onClick={onRepeatToggle}
          size={16}
          title="Toggle Repeat"
        />
      )}
      
      {onSkipBack && (
        <IconButton
          icon="skip-back"
          variant="ghost"
          onClick={onSkipBack}
          size={18}
          title="Skip Back"
        />
      )}
      
      <IconButton
        icon={isPlaying ? "pause" : "play"}
        variant="solid"
        onClick={onPlayPause}
        size={24}
        style={{
          background: isPlaying ? "var(--be-color-accent)" : "var(--be-color-text)",
          color: isPlaying ? "#fff" : "var(--be-bg-base)",
          borderRadius: "50%",
          padding: "var(--be-space-sm)",
        }}
        title={isPlaying ? "Pause" : "Play"}
      />
      
      {onSkipForward && (
        <IconButton
          icon="skip-forward"
          variant="ghost"
          onClick={onSkipForward}
          size={18}
          title="Skip Forward"
        />
      )}
    </div>
  );
}
