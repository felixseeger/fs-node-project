import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PlaybackControls } from "./PlaybackControls";

const meta = {
  title: "Components/PlaybackControls",
  component: PlaybackControls,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlaybackControls>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaybackControlsWithState = (args: any) => {
  const [isPlaying, setIsPlaying] = useState(args.isPlaying || false);
  const [isRepeat, setIsRepeat] = useState(args.isRepeat || false);
  
  return (
    <PlaybackControls 
      {...args} 
      isPlaying={isPlaying} 
      onPlayPause={() => setIsPlaying(!isPlaying)}
      isRepeat={isRepeat}
      onRepeatToggle={() => setIsRepeat(!isRepeat)}
      onSkipBack={() => console.log("Skip back")}
      onSkipForward={() => console.log("Skip forward")}
    />
  );
};

export const Default: Story = {
  render: (args) => <PlaybackControlsWithState {...args} />,
  args: {
    onPlayPause: () => {},
    isPlaying: false,
  },
};

export const Playing: Story = {
  render: (args) => <PlaybackControlsWithState {...args} />,
  args: {
    onPlayPause: () => {},
    isPlaying: true,
  },
};

export const Minimal: Story = {
  render: (args) => {
    const [isPlaying, setIsPlaying] = useState(args.isPlaying || false);
    return (
      <PlaybackControls 
        {...args} 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />
    );
  },
  args: {
    onPlayPause: () => {},
    isPlaying: false,
  },
};
