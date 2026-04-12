import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import BaseNode from "@/nodes/BaseNode";

const meta = {
  title: "Frontend/Nodes/BaseNode",
  component: BaseNode,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  args: {
    id: "node-1",
    label: "Image Generator",
    onDisconnect: fn(),
    onEdit: fn(),
    onGenerate: fn(),
    onToggleSettings: fn(),
  },
} satisfies Meta<typeof BaseNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    status: "idle",
    dotColor: "#ffd27f",
    children: <p style={{ margin: 0 }}>Node content goes here</p>,
  },
};

export const Loading: Story = {
  args: {
    status: "loading",
    isExecuting: true,
    dotColor: "#3b82f6",
    children: <p style={{ margin: 0 }}>Generating image...</p>,
  },
};

export const Complete: Story = {
  args: {
    status: "complete",
    dotColor: "#22c55e",
    children: <p style={{ margin: 0 }}>Generation complete</p>,
  },
};

export const Error: Story = {
  args: {
    status: "error",
    hasError: true,
    dotColor: "#ef4444",
    children: <p style={{ margin: 0 }}>API error occurred</p>,
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    dotColor: "#ffd27f",
    children: <p style={{ margin: 0 }}>Selected node</p>,
  },
};

export const WithEditableTitle: Story = {
  args: {
    editableTitle: {
      value: "My Custom Node",
      onCommit: fn(),
      placeholder: "Enter name...",
    },
    dotColor: "#b490f5",
    children: <p style={{ margin: 0 }}>Editable title node</p>,
  },
};

export const WithSettingsPanel: Story = {
  args: {
    dotColor: "#5ee7df",
    settingsExpanded: true,
    settingsPanel: (
      <div style={{ color: "#aaa", fontSize: 12 }}>
        <p style={{ margin: "0 0 8px" }}>Resolution: 1024x1024</p>
        <p style={{ margin: "0 0 8px" }}>Model: SDXL</p>
        <p style={{ margin: 0 }}>Steps: 30</p>
      </div>
    ),
    children: <p style={{ margin: 0 }}>Settings expanded</p>,
  },
};

export const WithDownload: Story = {
  args: {
    dotColor: "#ffd27f",
    downloadUrl: "https://example.com/image.png",
    downloadType: "image",
    children: <p style={{ margin: 0 }}>Image ready for download</p>,
  },
};
