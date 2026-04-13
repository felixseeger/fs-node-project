# interpolate()

Allows you to map a range of values to another using a concise syntax. It is commonly used to map the current frame to an animation property like opacity, scale, or position.

## API Signature
\`\`\`typescript
interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  options?: InterpolateOptions
): number
\`\`\`

## Parameters
- **`input`**: The current value to be mapped (usually the return value of `useCurrentFrame()`).
- **`inputRange`**: An array of values that you expect the input to assume (e.g., `[0, 20]`).
- **`outputRange`**: An array of values that you want the input to map to (e.g., `[0, 1]`).

## Options (`InterpolateOptions`)
- **`extrapolateLeft?`** (Default: `'extend'`): Behavior when the input is smaller than the first value in `inputRange`.
- **`extrapolateRight?`** (Default: `'extend'`): Behavior when the input is larger than the last value in `inputRange`.
    - `extend`: Interpolate linearly outside the range.
    - `clamp`: Return the closest value inside the range.
    - `wrap`: Loop the value change.
    - `identity`: Return the input value itself.
- **`easing?`** (Default: `(x) => x`): A function to customize the interpolation curve (e.g., `Easing.bezier`).

## Code Examples

### Basic Fade-in Effect
\`\`\`tsx
import { interpolate, useCurrentFrame } from 'remotion';

const MyComp = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  return <div style={{ opacity }}>Hello World</div>;
};
\`\`\`

### Fade In and Out
\`\`\`tsx
const opacity = interpolate(
  frame, 
  [0, 20, durationInFrames - 20, durationInFrames], 
  [0, 1, 1, 0]
);
\`\`\`
