# Remotion Configuration (\`remotion.config.ts\`)

The \`remotion.config.ts\` file allows you to define global settings for CLI commands like \`render\` and \`studio\`. It should be placed in the root of your project.

## Basic Setup
\`\`\`typescript
import { Config } from '@remotion/cli/config';

Config.setConcurrency(8);
Config.setCodec('h264');
Config.setVideoImageFormat('jpeg');
\`\`\`

## Key Configuration Options
| Option | Description | Default |
| :--- | :--- | :--- |
| \`setConcurrency(n)\` | Number of CPU threads to use for rendering. | \`os.cpus().length / 2\` |
| \`setCodec(codec)\` | Output codec: \`h264\`, \`h265\`, \`vp8\`, \`vp9\`, \`prores\`, \`mp3\`, \`wav\`. | \`h264\` |
| \`setOutputLocation(path)\` | Default output path for renders. | \`out/{composition}.{container}\` |
| \`setVideoImageFormat(fmt)\` | Format for frames: \`jpeg\` (fastest), \`png\` (transparency). | \`jpeg\` |
| \`setMuted(bool)\` | Disables audio output if set to \`true\`. | \`false\` |
| \`setStudioPort(n)\` | HTTP port for the Remotion Studio. | \`3000\` |

## Advanced Overrides
\`\`\`typescript
// Custom Webpack configuration
Config.overrideWebpackConfig((current) => ({
  ...current,
  module: {
    ...current.module,
    rules: [...(current.module?.rules ?? []), myCustomRule],
  },
}));
\`\`\`
