import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import UniversalSimplifiedNodeChrome from "@/nodes/UniversalSimplifiedNodeChrome";

const meta = {
  title: "Frontend/Nodes/UniversalSimplifiedNodeChrome",
  component: UniversalSimplifiedNodeChrome,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UniversalSimplifiedNodeChrome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Image Generator",
    selected: false,
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Node body content
      </div>
    ),
  },
};

export const Selected: Story = {
  args: {
    title: "Video Generator",
    selected: true,
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Selected node body
      </div>
    ),
  },
};

export const WithRunButton: Story = {
  args: {
    title: "AI Workflow Step",
    selected: false,
    showRunButton: true,
    onRun: fn(),
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Click run to execute
      </div>
    ),
  },
};

export const Running: Story = {
  args: {
    title: "Processing...",
    selected: false,
    showRunButton: true,
    isRunning: true,
    onRun: fn(),
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Generating output...
      </div>
    ),
  },
};

export const WithComment: Story = {
  args: {
    title: "Annotated Node",
    selected: false,
    comment: "This node handles the initial prompt processing",
    onCommentChange: fn(),
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Node with comment
      </div>
    ),
  },
};

export const CustomWidth: Story = {
  args: {
    title: "Wide Node",
    selected: false,
    width: 480,
    children: (
      <div style={{ padding: 16, color: "#aaa", fontSize: 13 }}>
        Extra wide node content
      </div>
    ),
  },
};
