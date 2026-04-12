import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import NodeShell from "@/nodes/NodeShell";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Nodes/NodeShell",
  component: NodeShell,
  parameters: { backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [withReactFlow],
  args: {
    onDisconnect: fn(),
    onEdit: fn(),
    onGenerate: fn(),
  },
} satisfies Meta<typeof NodeShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Image Generator",
    dotColor: "#ffd27f",
    selected: false,
    children: <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>Node content</div>,
  },
};

export const Selected: Story = {
  args: {
    label: "Video Generator",
    dotColor: "#5ee7df",
    selected: true,
    children: <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>Selected state</div>,
  },
};

export const WithError: Story = {
  args: {
    label: "Failed Node",
    dotColor: "#ef4444",
    selected: false,
    hasError: true,
    children: <div style={{ padding: 12, color: "#f87171", fontSize: 13 }}>Error state</div>,
  },
};

export const Generating: Story = {
  args: {
    label: "Processing...",
    dotColor: "#3b82f6",
    selected: false,
    isGenerating: true,
    children: <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>Running...</div>,
  },
};

export const Folded: Story = {
  args: {
    label: "Collapsed Node",
    dotColor: "#b490f5",
    selected: false,
    folded: true,
    onToggleFold: fn(),
    children: <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>This is hidden when folded</div>,
  },
};
