import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import Icon, { type IconName } from "./Icon";

export interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  icon: IconName;
  size?: number | string;
  variant?: "ghost" | "solid" | "outline";
  active?: boolean;
  crt?: boolean;
}

export function IconButton({
  icon,
  size = 20,
  variant = "ghost",
  active = false,
  crt = false,
  style,
  className,
  ...rest
}: IconButtonProps) {
  const getVariantStyle = () => {
    if (active) {
      return {
        background: "var(--be-color-accent)",
        color: "#fff",
        borderColor: "transparent",
      };
    }
    switch (variant) {
      case "solid":
        return {
          background: "var(--be-glass-bg)",
          color: "var(--be-color-text)",
          borderColor: "transparent",
        };
      case "outline":
        return {
          background: "transparent",
          color: "var(--be-color-text)",
          borderColor: "var(--be-glass-border)",
        };
      case "ghost":
      default:
        return {
          background: "transparent",
          color: "var(--be-color-text-muted)",
          borderColor: "transparent",
        };
    }
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        backgroundColor: active ? "var(--be-color-accent-hover)" : "var(--be-glass-bg-hover)",
        color: active ? "#fff" : "var(--be-color-text)",
      }}
      whileTap={{ scale: 0.95 }}
      className={`be-icon-button ${className || ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--be-space-xs)",
        borderRadius: "var(--be-radius-sm)",
        border: "1px solid",
        cursor: "pointer",
        transition: "all 0.15s ease",
        ...getVariantStyle(),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size} crt={crt} />
    </motion.button>
  );
}
