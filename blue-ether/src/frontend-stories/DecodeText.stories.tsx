import type { Meta, StoryObj } from "@storybook/react";
import DecodeText from "@/components/DecodeText";

const meta = {
  title: "Frontend/Effects/DecodeText",
  component: DecodeText,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ fontSize: 32, fontFamily: "monospace", color: "#fff" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DecodeText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Hello, World!",
    duration: 1500,
    trigger: true,
  },
};

export const LongText: Story = {
  args: {
    text: "Drag. Connect. Deploy. Build AI workflows visually.",
    duration: 2000,
    trigger: true,
  },
};

export const Slow: Story = {
  args: {
    text: "Loading system...",
    duration: 4000,
    delay: 500,
    trigger: true,
  },
};

export const NotTriggered: Story = {
  args: {
    text: "Waiting for trigger",
    trigger: false,
  },
};
