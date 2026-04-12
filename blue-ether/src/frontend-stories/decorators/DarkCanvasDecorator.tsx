import type { ReactNode } from "react";

/**
 * Wraps story content in the dark canvas background matching the frontend app.
 */
export function DarkCanvasDecorator({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#0b0e1a",
        padding: 32,
        minHeight: 200,
        fontFamily: "var(--font-body)",
        color: "#fff",
      }}
    >
      {children}
    </div>
  );
}

export const withDarkCanvas = (Story: () => ReactNode) => (
  <DarkCanvasDecorator>
    <Story />
  </DarkCanvasDecorator>
);
