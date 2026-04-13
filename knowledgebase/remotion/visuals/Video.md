# Video (Html5Video / OffthreadVideo)

These components include video content synchronized with Remotion's timeline. `<Html5Video>` wraps the native element, while `<OffthreadVideo>` is a Rust-based alternative that offers better performance during rendering.

## Props
- **\`src\`**: URL or local path via \`staticFile()\`.
- **\`trimBefore\` / \`trimAfter\`**: (v4.0.319+) Removes portions from the start or end of the source file. (Replaces \`startFrom\` and \`endAt\`).
- **\`volume\`**: A number (0-1) or a function \`(frame) => number\` for dynamic volume.
- **\`playbackRate\`**: Speed control (default: 1). Reverse playback is not supported.
- **\`muted\`**: If \`true\`, audio is dropped. This makes rendering more efficient as Remotion won't download the file to extract audio.
- **\`loop\`**: Loops the video indefinitely.
- **\`toneFrequency\`**: (v4.0.47+) Adjusts audio pitch during rendering (0.01 to 2).
- **\`audioStreamIndex\`**: (v4.0.340+) Selects a specific audio stream (zero-indexed) for files with multiple tracks.

## Usage Example
\`\`\`tsx
import {AbsoluteFill, staticFile, Html5Video} from 'remotion';

export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Html5Video 
        src={staticFile('video.webm')} 
        trimBefore={60} // Skip first 2 seconds (at 30fps)
        volume={0.5}
      />
    </AbsoluteFill>
  );
};
\`\`\`
