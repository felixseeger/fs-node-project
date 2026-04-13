# Series

The `<Series>` component is used to stitch together scenes that should play sequentially. It automatically calculates the `from` prop for its children based on their durations.

## Props
- **`<Series>`**: Accepts all props of `<Sequence>`, but `layout` defaults to `"none"`.
- **`<Series.Sequence>`**:
    - **`durationInFrames`**: (Required for all but the last) The length of the segment.
    - **`offset`**: (Optional) Shift the start of the sequence (positive to delay, negative to overlap).
    - **`layout`**: (Optional, default `"absolute-fill"`) Positioning behavior.
    - **`ref`**: (Optional) A React ref to the container element.

## Code Example
\`\`\`tsx
import { Series } from 'remotion';

export const MySeries = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={40}>
        <SceneOne />
      </Series.Sequence>
      <Series.Sequence durationInFrames={20} offset={-5}>
        {/* Starts 5 frames before SceneOne ends */}
        <SceneTwo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={70}>
        <SceneThree />
      </Series.Sequence>
    </Series>
  );
};
\`\`\`
