# Easing

The `Easing` module implements common easing functions to be used with `interpolate()`.

## Standard Functions
- **\`Easing.linear(t)\`**: \`f(t) = t\`.
- **\`Easing.quad(t)\`**: Quadratic function (\`t^2\`).
- **\`Easing.cubic(t)\`**: Cubic function (\`t^3\`).
- **\`Easing.poly(n)\`**: Power function (\`t^n\`).

## Predefined Animations
- **\`Easing.ease(t)\`**: Basic inertial interaction (slow acceleration).
- **\`Easing.bounce(t)\`**: Bouncing effect.
- **\`Easing.back(s)\`**: Goes slightly back before moving forward.
- **\`Easing.elastic(bounciness)\`**: Oscillates like a spring.

## Mathematical Functions
- **\`Easing.bezier(x1, y1, x2, y2)\`**: Cubic bezier curve (CSS equivalent).
- **\`Easing.circle(t)\`**: Circular function.
- **\`Easing.sin(t)\`**: Sinusoidal function.
- **\`Easing.exp(t)\`**: Exponential function.

## Modification Helpers
- **\`Easing.in(easing)\`**: Runs the function forwards.
- **\`Easing.out(easing)\`**: Runs the function backwards.
- **\`Easing.inOut(easing)\`**: Makes the function symmetrical.

## Code Example
\`\`\`tsx
import { Easing, interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const scale = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.bezier(0.8, 0.22, 0.96, 0.65),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
\`\`\`
