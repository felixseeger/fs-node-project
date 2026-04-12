import type { Meta, StoryObj } from "@storybook/react";
import GlassBackground from "@/components/GlassBackground";

const meta = {
  title: "Frontend/Effects/GlassBackground",
  component: GlassBackground,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  render: () => (
    <div style={{ position: "relative", width: "100%", height: 400 }}>
      <GlassBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          color: "#fff",
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        Content over glass
      </div>
    </div>
  ),
};
