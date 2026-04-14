import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

const meta = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorPickerWithState = (args: any) => {
  const [color, setColor] = useState(args.color || "#ec4899");
  return (
    <div style={{ width: "250px", padding: "20px", background: "var(--be-bg-base)", borderRadius: "var(--be-radius-md)" }}>
      <ColorPicker {...args} color={color} onChange={setColor} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ColorPickerWithState {...args} />,
  args: {
    label: "Fill Color",
    color: "#ec4899",
    onChange: () => {},
  },
};

export const NoLabel: Story = {
  render: (args) => <ColorPickerWithState {...args} />,
  args: {
    color: "#14b8a6",
    onChange: () => {},
  },
};
