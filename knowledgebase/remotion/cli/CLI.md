# Remotion CLI

The Remotion CLI is the primary tool for interacting with Remotion projects. It is used to start the Studio, render videos, manage Lambda deployments, and more.

## Core Commands
| Command | Description |
| :--- | :--- |
| \`studio\` | Starts the Remotion Studio for previewing and editing. |
| \`render\` | Renders a video or audio file from a composition. |
| \`still\` | Renders a single still image. |
| \`compositions\` | Lists all available compositions in the project. |
| \`bundle\` | Creates a Webpack bundle of the Remotion project. |
| \`lambda\` | Commands for managing and deploying to Remotion Lambda. |
| \`ffmpeg\` / \`ffprobe\` | Executes the bundled FFmpeg or FFprobe binaries. |

## Example Usage
\`\`\`bash
# Render a composition named "HelloWorld" to out/video.mp4
npx remotion render src/index.ts HelloWorld out/video.mp4

# Render using a specific codec and quality
npx remotion render --codec=vp8 --quality=90 HelloWorld out/video.webm

# Start the Studio on a custom port
npx remotion studio --port=3001
\`\`\`
