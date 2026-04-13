# useCurrentFrame()

A hook that retrieves the current frame of the video. Frames are 0-indexed. If the component is wrapped in a `<Sequence>`, the returned frame is relative to the start of that sequence.

## Return Value
- **`number`**: The current frame index (starting from 0).

## Code Example
\`\`\`tsx
import { useCurrentFrame, Sequence } from 'remotion';

const Subtitle = () => {
  const frame = useCurrentFrame();
  // If parent Sequence starts at frame 10 and timeline is at 25, 
  // frame will be 15.
  return <div>Current relative frame: {frame}</div>;
};

export const MyVideo = () => {
  const frame = useCurrentFrame();
  return (
    <div>
      <div>Absolute frame: {frame}</div>
      <Sequence from={10}>
        <Subtitle />
      </Sequence>
    </div>
  );
};
\`\`\`
