# staticFile()

A helper function used to reference assets located in the `public/` folder of your Remotion project.

## Capability
It ensures that the file paths are resolved correctly regardless of the environment (Remotion Studio, local preview, or cloud rendering via Lambda).

## Usage
Pass the relative path of the file as it exists inside the \`public/\` directory.

\`\`\`tsx
import { staticFile, Img } from 'remotion';

// If your file is at public/images/logo.png
const logoPath = staticFile('images/logo.png');

export const MyComp = () => {
  return <Img src={logoPath} />;
};
\`\`\`

## Key Behaviors
- **Studio Integration**: Files referenced via \`staticFile()\` are automatically watched for changes in the Remotion Studio.
- **Rendering**: During the render process, Remotion uses this helper to map the asset to the correct internal path or URL.
