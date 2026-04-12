import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import {
  SectionHeader,
  LinkedBadges,
  ConnectionInfo,
  ConnectedOrLocal,
} from "@/nodes/NodeSection";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Nodes/NodeSection",
  component: SectionHeader,
  parameters: { backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [withReactFlow],
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TargetHandle: Story = {
  args: {
    label: "Prompt Input",
    handleId: "prompt-in",
    handleType: "target",
    color: "#ffd27f",
  },
};

export const SourceHandle: Story = {
  args: {
    label: "Image Output",
    handleId: "output",
    handleType: "source",
    color: "#5ee7df",
  },
};

export const WithExtra: Story = {
  args: {
    label: "Connected Input",
    handleId: "text-in",
    handleType: "target",
    color: "#3b82f6",
    extra: <LinkedBadges nodeId="n1" handleId="text-in" onUnlink={fn()} />,
  },
};

export const ConnectionInfoStory: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <ConnectionInfo
        connInfo={{ nodeLabel: "Text Prompt", handle: "output" }}
      />
    </div>
  ),
  args: {
    label: "",
    handleId: "",
    handleType: "target",
    color: "",
  },
};

export const ConnectedOrLocalExample: Story = {
  render: () => (
    <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ color: "#888", fontSize: 11, margin: 0 }}>Connected:</p>
      <ConnectedOrLocal connected connInfo={{ nodeLabel: "Input", handle: "text" }}>
        <input placeholder="fallback" />
      </ConnectedOrLocal>
      <p style={{ color: "#888", fontSize: 11, margin: 0 }}>Disconnected:</p>
      <ConnectedOrLocal connected={false}>
        <input
          placeholder="Type here (local fallback)"
          style={{
            width: "100%",
            padding: 8,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            color: "#fff",
            fontSize: 12,
          }}
        />
      </ConnectedOrLocal>
    </div>
  ),
  args: {
    label: "",
    handleId: "",
    handleType: "target",
    color: "",
  },
};
