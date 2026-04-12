import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import "./avatar.css";

const SIZE_PX = { sm: 32, md: 40, lg: 56 } as const;

export type AvatarSize = keyof typeof SIZE_PX;

export type AvatarProps = {
  /** Image URL; when missing or failed to load, initials are shown */
  src?: string;
  /** Accessible description (required when meaningful) */
  alt?: string;
  /** Full name used to derive initials when `initials` is omitted */
  name?: string;
  /** Override derived initials (1–2 characters recommended) */
  initials?: string;
  size?: AvatarSize;
  className?: string;
  /** Decorative CRT-style scanlines; off by default for clarity */
  crt?: boolean;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export default function Avatar({
  src,
  alt,
  name,
  initials: initialsProp,
  size = "md",
  className,
  crt = false,
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const px = SIZE_PX[size];

  const initials = useMemo(() => {
    if (initialsProp?.trim()) return initialsProp.trim().slice(0, 2).toUpperCase();
    if (name?.trim()) return initialsFromName(name);
    return "?";
  }, [initialsProp, name]);

  const label = alt ?? name ?? initials;
  const showImage = Boolean(src) && !imgFailed;
  const fallbackKey = name ?? initials ?? "user";
  const hue = hueFromString(fallbackKey);

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      role="img"
      aria-label={label}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px,
        height: px,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: showImage ? "var(--be-color-surface)" : `hsl(${hue} 45% 42%)`,
        boxShadow: "0 0 0 1px var(--be-glass-border)",
        color: "#fff",
        fontFamily: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 700,
        fontSize: px * 0.38,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? ""}
          onError={() => setImgFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : crt ? (
        <span
          style={{
            position: "relative",
            zIndex: 1,
            textShadow:
              "-2px 0px 2px var(--pink), 2px 0px 2px var(--darker-cyan)",
          }}
        >
          {initials}
        </span>
      ) : (
        initials
      )}
      {crt ? (
        <span
          aria-hidden
          className="avatar-crt-scanlines"
          style={{
            /* Dark stripes on photos; light stripes on saturated initials (see tokens --scanline-color default) */
            ["--scanline-color" as string]: showImage
              ? "rgba(0, 0, 0, 0.16)"
              : "rgba(255, 255, 255, 0.14)",
            mixBlendMode: showImage ? "multiply" : "overlay",
            boxShadow: showImage
              ? "inset 0 0 0 1px rgba(34, 197, 94, 0.12)"
              : "inset 0 0 0 1px rgba(167, 243, 208, 0.22)",
          }}
        />
      ) : null}
    </motion.span>
  );
}
