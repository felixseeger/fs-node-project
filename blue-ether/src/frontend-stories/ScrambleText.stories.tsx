import type { Meta, StoryObj } from "@storybook/react-vite";
import ScrambleText from "@/components/ScrambleText";

const meta = {
  title: "Frontend/Effects/ScrambleText",
  component: ScrambleText,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ fontSize: 36, fontFamily: "monospace", color: "#fff" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrambleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Drag. Connect. Deploy.", trigger: true },
};

export const WithDelay: Story = {
  args: { text: "Booting sequence...", trigger: true, delay: 1000 },
};

export const NotTriggered: Story = {
  args: { text: "Waiting...", trigger: false },
};
