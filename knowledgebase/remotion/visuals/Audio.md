# Audio (Html5Audio)

Used to add audio tracks to a composition. It supports all formats compatible with Chrome.

## Props
- **\`src\`**: URL or local path via \`staticFile()\`.
- **\`volume\`**: Static number or a callback function for frame-by-frame control.
- **\`trimBefore\` / \`trimAfter\`**: (v4.0.319+) Trims the audio file.
- **\`playbackRate\`**: Speed control (0.0625 to 16).
- **\`loop\`**: Loops the audio.
- **\`toneFrequency\`**: Adjusts pitch during rendering.
- **\`pauseWhenBuffering\`**: (v4.0.111+) Enters native buffering state if the file is loading.

## Usage Example
\`\`\`tsx
import {AbsoluteFill, Html5Audio, interpolate, staticFile} from 'remotion';

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      <Html5Audio 
        src={staticFile('voice.mp3')} 
        volume={(f) => interpolate(f, [0, 30], [0, 1], {extrapolateLeft: 'clamp'})} 
      />
    </AbsoluteFill>
  );
};
\`\`\`
