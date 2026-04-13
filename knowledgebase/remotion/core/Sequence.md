# Sequence

The `<Sequence>` component allows you to time-shift components or parts of an animation. Children of a `<Sequence>` receive a relative frame value from `useCurrentFrame()`.

## Props
- **`from`**: (Optional, default `0`) The frame at which the sequence starts.
- **`durationInFrames`**: (Optional, default `Infinity`) How long the sequence should be mounted.
- **`name`**: (Optional) A label for the sequence in the Remotion Studio timeline.
- **`layout`**: (Optional, default `"absolute-fill"`) Either `"absolute-fill"` or `"none"`.
- **`width` / `height`**: (Optional) Overrides the dimensions returned by `useVideoConfig()` for children.
- **`premountFor`**: (Optional) Number of frames to mount the component before it becomes visible.
- **`postmountFor`**: (Optional) Number of frames to keep the component mounted after it ends.
- **`style` / `className`**: (Optional) CSS styles or classes applied to the container (if `layout` is not `"none"`).

## Code Example
\`\`\`tsx
import { Sequence } from 'remotion';
import { Intro, Clip, Outro } from './MyComponents';

export const MyTrailer = () => {
  return (
    <>
      <Sequence durationInFrames={30}>
        <Intro />
      </Sequence>
      <Sequence from={30} durationInFrames={60}>
        <Clip />
      </Sequence>
      <Sequence from={90}>
        <Outro />
      </Sequence>
    </>
  );
};
\`\`\`
