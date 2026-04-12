import type { Meta, StoryObj } from "@storybook/react-vite";
import { OutputHandle, OutputPreview } from "@/nodes/NodeOutput";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Nodes/NodeOutput",
  component: OutputPreview,
  parameters: { backgrounds: { default: "canvas-dark" } },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OutputPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    isLoading: false,
    type: "image",
    emptyText: "No image generated yet",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    type: "image",
    loadingText: "Generating...",
  },
};

export const WithImage: Story = {
  args: {
    isLoading: false,
    output: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='%23334155'/%3E%3Ctext x='128' y='128' fill='%2394a3b8' text-anchor='middle' dy='0.35em' font-size='14'%3EGenerated Image%3C/text%3E%3C/svg%3E",
    type: "image",
    label: "Output",
  },
};

export const WithError: Story = {
  args: {
    isLoading: false,
    error: "API rate limit exceeded. Please try again.",
    type: "image",
  },
};

export const VideoType: Story = {
  args: {
    isLoading: false,
    type: "video",
    emptyText: "No video generated",
    accentColor: "#5ee7df",
  },
};

export const OutputHandleStory: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 20 }}>
      <OutputHandle type="image" label="Image" />
      <OutputHandle type="video" label="Video" />
      <OutputHandle type="audio" label="Audio" />
    </div>
  ),
  decorators: [withReactFlow],
};
