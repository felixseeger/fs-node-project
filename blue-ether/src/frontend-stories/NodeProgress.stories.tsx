import type { Meta, StoryObj } from "@storybook/react";
import NodeProgress, { NodeProgressBadge } from "@/nodes/NodeProgress";

const meta = {
  title: "Frontend/Nodes/NodeProgress",
  component: NodeProgress,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NodeProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { status: "idle", progress: 0 },
};

export const Pending: Story = {
  args: { status: "pending", message: "Waiting in queue..." },
};

export const Running: Story = {
  args: { status: "running", progress: 0.65, message: "Generating..." },
};

export const Completed: Story = {
  args: { status: "completed", progress: 1 },
};

export const Failed: Story = {
  args: { status: "failed", message: "API timeout" },
};

export const Compact: Story = {
  args: { status: "running", progress: 0.3, compact: true },
};

export const Badge: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <NodeProgressBadge status="idle" />
      <NodeProgressBadge status="pending" />
      <NodeProgressBadge status="running" progress={0.5} />
      <NodeProgressBadge status="completed" progress={1} />
      <NodeProgressBadge status="failed" />
    </div>
  ),
};
