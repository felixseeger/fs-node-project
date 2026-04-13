# \`renderMedia()\` API

The \`renderMedia()\` function is part of the \`@remotion/renderer\` package and is used for programmatic (SSR) rendering.

## Basic Usage
\`\`\`javascript
import { renderMedia, selectComposition } from '@remotion/renderer';

const composition = await selectComposition({
  serveUrl: bundleUrl,
  id: 'MyComp',
  inputProps: { custom: 'data' },
});

await renderMedia({
  composition,
  serveUrl: bundleUrl,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
  inputProps: { custom: 'data' },
});
\`\`\`

## Arguments
| Property | Type | Description |
| :--- | :--- | :--- |
| \`serveUrl\` | \`string\` | Path to the Webpack bundle or a hosted URL. |
| \`composition\` | \`VideoConfig\` | The composition object (from \`selectComposition\`). |
| \`codec\` | \`string\` | Output codec (e.g., \`h264\`, \`vp9\`, \`prores\`). |
| \`outputLocation\` | \`string\` | File path to save the output. If \`null\`, returns a buffer. |
| \`inputProps\` | \`object\` | JSON props passed to the composition. |
| \`onProgress\` | \`function\` | Callback to track rendering and encoding progress. |

## Return Value (v4.0+)
Returns an object containing:
- \`buffer\`: The rendered file as a \`Buffer\` (if \`outputLocation\` was \`null\`).
- \`slowestFrames\`: An array of the 10 slowest frames with their render times.
- \`contentType\`: The MIME type of the output (e.g., \`video/mp4\`).
