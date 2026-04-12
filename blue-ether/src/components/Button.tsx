import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** CRT scanlines + chromatic label; off by default */
  crt?: boolean;
};

const crtLabelShadow =
  "-2px 0px 2px var(--pink), 2px 0px 2px var(--darker-cyan)";

export function Button({
  variant = "primary",
  style,
  type = "button",
  crt = false,
  children,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";

  const variantStyle = isPrimary 
    ? {
        background: "var(--be-color-accent)",
        color: "#fff",
        boxShadow: "var(--be-shadow-sm)",
      }
    : {
        background: "var(--be-glass-bg)",
        color: "var(--be-color-text)",
        borderColor: "var(--be-glass-border)",
        backdropFilter: "blur(var(--be-glass-blur))",
        WebkitBackdropFilter: "blur(var(--be-glass-blur))",
      };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        backgroundColor: isPrimary ? "var(--be-color-accent-hover)" : "var(--be-glass-bg-hover)" 
      }}
      whileTap={{ scale: 0.98 }}
      type={type}
      style={{
        fontFamily: "var(--be-font-sans)",
        fontSize: "var(--be-font-size-md)",
        fontWeight: 600,
        lineHeight: 1.25,
        padding: "var(--be-space-sm) var(--be-space-md)",
        borderRadius: "var(--be-radius-sm)",
        border: "1px solid transparent",
        cursor: "pointer",
        transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        ...variantStyle,
        ...(crt ? { position: "relative", overflow: "hidden" } : {}),
        ...style,
      } as any}
      {...(rest as any)}
    >
      {crt ? (
        <span
          style={{
            position: "relative",
            zIndex: 1,
            textShadow: crtLabelShadow,
          }}
        >
          {children}
        </span>
      ) : (
        children
      )}
      {crt ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "var(--be-radius-sm)",
            backgroundImage: isPrimary
              ? `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.14) 1px,
              rgba(0, 0, 0, 0.14) 2px
            )`
              : `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.11) 1px,
              rgba(255, 255, 255, 0.11) 2px
            )`,
            mixBlendMode: isPrimary ? "multiply" : "overlay",
            boxShadow: isPrimary
              ? "inset 0 0 0 1px rgba(34, 197, 94, 0.12)"
              : "inset 0 0 0 1px rgba(167, 243, 208, 0.22)",
          }}
        />
      ) : null}
    </motion.button>
  );
}
