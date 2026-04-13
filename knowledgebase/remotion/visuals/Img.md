# Img

The `<Img>` tag is a drop-in replacement for the standard HTML `<img>` tag. It ensures that the image is fully loaded before Remotion renders the frame, preventing flickers.

## Props
- **\`src\`**: The URL of the image (remote or local via \`staticFile()\`).
- **\`onError\`**: Callback for loading failures. If an error occurs, the component must be unmounted or the \`src\` replaced to avoid render timeouts.
- **\`maxRetries\`**: (v3.3.82+) Number of retries on failure (default: 2) using exponential backoff.
- **\`pauseWhenLoading\`**: (v4.0.111+) If \`true\`, pauses the Player while the image loads.
- **\`delayRenderTimeoutInMilliseconds\`**: Customize the \`delayRender()\` timeout.

## Usage Example
\`\`\`tsx
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const MyComp = () => {
  return (
    <AbsoluteFill>
      <Img src={staticFile('hi.png')} />
    </AbsoluteFill>
  );
};
\`\`\`
*Note: Do not use `<Img>` for GIFs; use `@remotion/gif` instead.*
