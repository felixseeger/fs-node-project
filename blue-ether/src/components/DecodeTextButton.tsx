import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";

export type DecodeTextButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost";

export type DecodeTextButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  text?: string;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: DecodeTextButtonVariant;
  fromRight?: boolean;
  duration?: number;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

function variantStyles(variant: DecodeTextButtonVariant): CSSProperties {
  switch (variant) {
    case "primary":
      return {
        background: "var(--be-color-text)",
        color: "var(--be-color-bg)",
        border: "none",
      };
    case "accent":
      return {
        background: "var(--be-color-accent)",
        color: "#fff",
        border: "none",
        boxShadow: "0 0 24px rgba(61, 139, 253, 0.35)",
      };
    case "secondary":
      return {
        background: "transparent",
        color: "var(--be-color-text)",
        border: "1px solid var(--be-color-border)",
      };
    case "ghost":
      return {
        background: "transparent",
        color: "var(--be-color-text-muted)",
        border: "none",
      };
    default:
      return {};
  }
}

export default function DecodeTextButton({
  text,
  children,
  onClick,
  className = "",
  style,
  variant = "primary",
  fromRight = false,
  duration,
  startIcon,
  endIcon,
  type = "button",
  onMouseEnter,
  onMouseLeave,
  ...rest
}: DecodeTextButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const originalText =
    text ?? (typeof children === "string" ? children : "") ?? "";
  const [displayText, setDisplayText] = useState(originalText);

  useEffect(() => {
    setDisplayText(originalText);
  }, [originalText]);

  const randChar = useCallback(() => {
    const chars =
      "abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`";
    const char = chars[Math.floor(Math.random() * chars.length)];
    return Math.random() > 0.5 ? char : char.toUpperCase();
  }, []);

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(e);
    if (!originalText) return;
    const arr1 = originalText.split("");
    const arr2 = arr1.map(() => randChar());

    const tl = gsap.timeline();
    let step = 0;
    const totalChars = arr1.length;

    setDisplayText(arr2.join(""));

    tl.to(
      {},
      {
        duration: duration ?? Math.max(0.4, totalChars / 15),
        ease: "none",
        onUpdate: () => {
          const p = Math.floor(tl.progress() * totalChars);

          if (step !== p) {
            step = p;
            const currentRandom = arr1.map(() => randChar());

            let pt1: string;
            let pt2: string;
            if (fromRight) {
              pt1 = currentRandom.join("").substring(0, totalChars - p);
              pt2 = originalText.substring(totalChars - p);
            } else {
              pt1 = originalText.substring(0, p);
              pt2 = currentRandom.join("").substring(0, totalChars - p);
            }
            setDisplayText(pt1 + pt2);
          }
        },
        onComplete: () => {
          setDisplayText(originalText);
        },
      },
    );
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    setDisplayText(originalText);
  };

  const combinedStyle: CSSProperties = {
    padding: "10px 20px",
    fontSize: "var(--be-font-size-md)",
    fontWeight: 600,
    borderRadius: "var(--be-radius-md)",
    cursor: "pointer",
    fontFamily: `'Share Tech Mono', ui-monospace, monospace`,
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    ...variantStyles(variant),
    ...style,
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`be-decode-text-button ${className}`.trim()}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {startIcon ? (
        <span style={{ display: "flex", alignItems: "center", width: 14 }}>
          {startIcon}
        </span>
      ) : null}

      <span style={{ position: "relative" }}>{displayText}</span>

      {endIcon ? (
        <span style={{ display: "flex", alignItems: "center", width: 14 }}>
          {endIcon}
        </span>
      ) : null}

      {!text && !startIcon && !endIcon ? children : null}
    </button>
  );
}
