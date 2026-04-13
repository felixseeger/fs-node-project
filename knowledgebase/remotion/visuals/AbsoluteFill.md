# AbsoluteFill

A helper component that provides an absolutely positioned `<div>` covering the full area of the composition. It is primarily used for layering content.

## Default Styles
The component applies the following CSS properties by default:
\`\`\`typescript
const style: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};
\`\`\`

## Props
- **\`ref\`**: Supported from v3.2.13+. In TypeScript, use \`HTMLDivElement\`.
- **\`className\`**: Supports Tailwind CSS. From v4.0.249, Remotion detects conflicting Tailwind classes (like \`flex-row\`) and automatically disables the corresponding default inline styles.

## Usage Example
\`\`\`tsx
import {AbsoluteFill, OffthreadVideo} from 'remotion';

const MyComp = () => {
  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <AbsoluteFill>
        <OffthreadVideo src="https://example.com/video.mp4" />
      </AbsoluteFill>
      {/* Foreground Layer */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1>This text is written on top!</h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
\`\`\`
