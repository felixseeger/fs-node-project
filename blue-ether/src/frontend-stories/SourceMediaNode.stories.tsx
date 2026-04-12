import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import SourceMediaNode from "@/nodes/SourceMediaNode";
import { NodeStoryCanvas } from "./decorators/NodeStoryDecorator";

const meta = {
  title: "Frontend/Nodes/Full Nodes/SourceMediaNode",
  component: SourceMediaNode,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SourceMediaNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="sourceMediaNode"
      nodeComponent={SourceMediaNode}
      data={{ label: "Media Source", mediaFiles: [], onUpdate: fn() }}
    />
  ),
};

export const WithMedia: Story = {
  render: () => (
    <NodeStoryCanvas
      nodeType="sourceMediaNode"
      nodeComponent={SourceMediaNode}
      data={{
        label: "Source Files",
        mediaFiles: [
          { url: "https://example.com/photo.jpg", type: "image", name: "photo.jpg" },
          { url: "https://example.com/clip.mp4", type: "video", name: "clip.mp4" },
          { url: "https://example.com/track.mp3", type: "audio", name: "track.mp3" },
        ],
        onUpdate: fn(),
      }}
    />
  ),
};
