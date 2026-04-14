import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RangeSlider } from "./RangeSlider";

const meta = {
  title: "Components/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

const RangeSliderWithState = (args: any) => {
  const [value, setValue] = useState(args.value || 50);
  return (
    <div style={{ width: "300px", padding: "20px", background: "var(--be-bg-base)", borderRadius: "var(--be-radius-md)" }}>
      <RangeSlider {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <RangeSliderWithState {...args} />,
  args: {
    onChange: () => {},
    label: "Opacity",
    min: 0,
    max: 100,
    value: 50,
  },
};

export const NoLabel: Story = {
  render: (args) => <RangeSliderWithState {...args} />,
  args: {
    onChange: () => {},
    min: 0,
    max: 100,
    value: 75,
    showValue: false,
  },
};
