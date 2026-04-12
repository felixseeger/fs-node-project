import type { Meta, StoryObj } from "@storybook/react";
import {
  CATEGORY_COLORS,
  surface,
  border,
  text,
  ui,
  sp,
  font,
  radius,
  control,
} from "@/nodes/nodeTokens";

const ColorSwatch = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: value,
        border: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontSize: 12, color: "#fff" }}>{name}</div>
      <div style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>{value}</div>
    </div>
  </div>
);

const TokensOverview = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
    <div>
      <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Category Colors</h3>
      {Object.entries(CATEGORY_COLORS).map(([k, v]) => (
        <ColorSwatch key={k} name={k} value={v} />
      ))}
    </div>
    <div>
      <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Surfaces</h3>
      {Object.entries(surface).map(([k, v]) => (
        <ColorSwatch key={k} name={`surface.${k}`} value={v} />
      ))}
      <h3 style={{ color: "#fff", fontSize: 14, margin: "24px 0 16px" }}>Borders</h3>
      {Object.entries(border).map(([k, v]) => (
        <ColorSwatch key={k} name={`border.${k}`} value={v} />
      ))}
    </div>
    <div>
      <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Text</h3>
      {Object.entries(text).map(([k, v]) => (
        <ColorSwatch key={k} name={`text.${k}`} value={v} />
      ))}
      <h3 style={{ color: "#fff", fontSize: 14, margin: "24px 0 16px" }}>UI</h3>
      {Object.entries(ui).map(([k, v]) => (
        <ColorSwatch key={k} name={`ui.${k}`} value={v} />
      ))}
    </div>
  </div>
);

const SpacingScale = () => (
  <div>
    <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Spacing Scale</h3>
    {Object.entries(sp).map(([k, v]) => (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ width: 40, fontSize: 11, color: "#888", fontFamily: "monospace" }}>sp[{k}]</span>
        <div style={{ width: v, height: 12, background: "#3b82f6", borderRadius: 2 }} />
        <span style={{ fontSize: 11, color: "#666" }}>{v}px</span>
      </div>
    ))}
  </div>
);

const RadiusScale = () => (
  <div>
    <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Border Radius</h3>
    <div style={{ display: "flex", gap: 16 }}>
      {Object.entries(radius).map(([k, v]) => (
        <div key={k} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "rgba(59,130,246,0.3)",
              border: "1px solid #3b82f6",
              borderRadius: typeof v === "number" ? v : v,
            }}
          />
          <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{k}</div>
          <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>
            {typeof v === "number" ? `${v}px` : v}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TypographyScale = () => (
  <div>
    <h3 style={{ color: "#fff", fontSize: 14, marginBottom: 16 }}>Typography</h3>
    {Object.entries(font).map(([k, v]) => (
      <div key={k} style={{ marginBottom: 8 }}>
        <span style={{ ...v as Record<string, unknown>, color: (v as Record<string, string>).color || "#fff" }}>
          font.{k} — The quick brown fox
        </span>
        <span style={{ fontSize: 10, color: "#555", marginLeft: 12 }}>
          {(v as Record<string, unknown>).fontSize}px
        </span>
      </div>
    ))}
  </div>
);

const meta = {
  title: "Frontend/Design Tokens",
  component: TokensOverview,
  parameters: {
    layout: "padded",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TokensOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {};

export const Spacing: Story = {
  render: () => <SpacingScale />,
};

export const BorderRadius: Story = {
  render: () => <RadiusScale />,
};

export const Typography: Story = {
  render: () => <TypographyScale />,
};
