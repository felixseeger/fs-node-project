import type { Meta, StoryObj } from "@storybook/react-vite";
import DecodedText from "@/components/DecodedText";

const meta = {
  title: "Frontend/Effects/DecodedText",
  component: DecodedText,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ fontSize: 28, fontFamily: "monospace", color: "#fff" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DecodedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Access Granted", active: true, speed: 40 },
};

export const SlowReveal: Story = {
  args: { text: "Initializing systems...", active: true, speed: 80, scrambleCount: 5 },
};

export const Inactive: Story = {
  args: { text: "Static text (no animation)", active: false },
};
