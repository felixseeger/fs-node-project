import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    progress: 45,
  },
};

export const WithLabelAndPercentage: Story = {
  args: {
    progress: 75,
    label: "Rendering...",
    showPercentage: true,
  },
};

export const CustomColorAndHeight: Story = {
  args: {
    progress: 100,
    color: "var(--be-color-success, #10b981)",
    height: 12,
    label: "Complete",
  },
};
