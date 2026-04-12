import type { Meta, StoryObj } from "@storybook/react-vite";
import NodeLoadingSkeleton, {
  NodeErrorBoundary,
} from "@/components/NodeLoadingSkeleton";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Nodes/NodeLoadingSkeleton",
  component: NodeLoadingSkeleton,
  parameters: { backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [withReactFlow],
} satisfies Meta<typeof NodeLoadingSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { width: 240, height: 120 },
};

export const Wide: Story = {
  args: { width: 400, height: 200 },
};

export const Small: Story = {
  args: { width: 160, height: 80 },
};
