# useVideoConfig()

A hook to retrieve configuration information about the current composition.

## Return Value
An object containing:
- **`width`**: Width of the composition (or the parent `<Sequence>` if defined).
- **`height`**: Height of the composition (or the parent `<Sequence>` if defined).
- **`fps`**: The frame rate of the composition.
- **`durationInFrames`**: Duration of the composition (or the parent `<Sequence>`).
- **`id`**: The ID of the composition.
- **`defaultProps`**: The default props defined in the `<Composition>`.
- **`props`**: The actual props passed to the composition.
- **`defaultCodec`**: The default codec used for rendering.

## Code Example
\`\`\`tsx
import { useVideoConfig } from 'remotion';

export const MyComp: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  
  return (
    <div style={{ flex: 1, backgroundColor: 'white' }}>
      Video is {width}x{height}px at {fps}fps.
      Total duration: {durationInFrames} frames.
    </div>
  );
};
\`\`\`
