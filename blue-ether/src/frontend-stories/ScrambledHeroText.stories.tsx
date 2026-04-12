import type { Meta, StoryObj } from "@storybook/react-vite";
import ScrambledHeroText from "@/components/ScrambledHeroText";

const meta = {
  title: "Frontend/Effects/ScrambledHeroText",
  component: ScrambledHeroText,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrambledHeroText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phrases: ["Drag.", "Connect.", "Deploy."],
    interval: 3500,
  },
};

export const TechPhrases: Story = {
  args: {
    phrases: ["AI Workflows", "Visual Builder", "Real-time Collaboration", "One Click Deploy"],
    interval: 2500,
  },
};

export const FastCycle: Story = {
  args: {
    phrases: ["Create", "Build", "Ship"],
    interval: 1500,
  },
};
