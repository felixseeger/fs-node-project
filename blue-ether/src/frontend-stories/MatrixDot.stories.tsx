import type { Meta, StoryObj } from "@storybook/react-vite";
import MatrixDot, { MatrixDotWithFade, MatrixDotDense, MatrixDotSparse } from "@/components/MatrixDot";

const meta = {
  title: "Frontend/Effects/MatrixDot",
  component: MatrixDot,
  parameters: { layout: "fullscreen", backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: "100%", height: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatrixDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { dotSize: 2, dotColor: "#444", spacing: 24, opacity: 0.5 },
};

export const BlueDots: Story = {
  args: { dotSize: 3, dotColor: "#3b82f6", spacing: 20, opacity: 0.6 },
};

export const WithFade: Story = {
  render: () => <MatrixDotWithFade fadeEdges dotColor="#a855f7" />,
};

export const Dense: Story = {
  render: () => <MatrixDotDense />,
};

export const Sparse: Story = {
  render: () => <MatrixDotSparse dotColor="#22c55e" />,
};
