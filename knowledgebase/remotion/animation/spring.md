# spring()

A physics-based animation primitive that creates natural-feeling motion.

## API Signature
\`\`\`typescript
spring({
  frame: number,
  fps: number,
  from?: number,
  to?: number,
  durationInFrames?: number,
  delay?: number,
  reverse?: boolean,
  config?: SpringConfig
}): number
\`\`\`

## Parameters
- **`frame`**: The current time value (usually `useCurrentFrame()`).
- **`fps`**: Frames per second (from `useVideoConfig()`).
- **`from`** (Default: `0`): Initial value.
- **`to`** (Default: `1`): Target end value.
- **`delay`**: Number of frames to wait before starting the animation.
- **`durationInFrames`**: Stretches the curve to fit a specific frame count.
- **`reverse`**: Renders the animation in reverse.

## Configuration (`SpringConfig`)
- **`mass`** (Default: `1`): The weight of the spring. Lower mass makes it faster.
- **`damping`** (Default: `10`): How hard the animation decelerates. Increase to reduce bounce.
- **`stiffness`** (Default: `100`): Spring stiffness coefficient. Higher values increase bounciness.
- **`overshootClamping`** (Default: `false`): If `true`, the value will not bounce past the `to` value.

## Order of Operations
1.  **Duration**: The curve is stretched to `durationInFrames`.
2.  **Reverse**: The curve is flipped if `reverse: true`.
3.  **Delay**: The animation is shifted by the `delay` amount.

## Code Example
\`\`\`tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    stiffness: 100,
    damping: 10,
  },
});

return <div style={{ transform: `scale(${scale})` }} />;
\`\`\`
