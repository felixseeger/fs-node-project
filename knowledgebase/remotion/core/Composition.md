# Composition

The `<Composition>` component is used to register a video, making it renderable and visible in the Remotion Studio sidebar. It represents a video as a collection of clips (e.g., several `<Sequence>` components) that play back-to-back.

## Props
- **`id`**: (Required) A unique identifier for the composition. Can only contain letters, numbers, and `-`.
- **`fps`**: (Required) The frame rate at which the composition should be rendered.
- **`durationInFrames`**: (Required) The total length of the composition in frames.
- **`height`**: (Required) Height of the composition in pixels.
- **`width`**: (Required) Width of the composition in pixels.
- **`component`**: The React component to be rendered. (Must provide either `component` or `lazyComponent`).
- **`lazyComponent`**: A function that returns a dynamic import (e.g., `() => import('./MyComp')`). Uses React Suspense.
- **`defaultProps`**: (Optional) An object containing JSON-serializable values to be passed as props to the component.
- **`calculateMetadata`**: (Optional) A function to dynamically determine metadata like duration or props.
- **`schema`**: (Optional) A Zod schema for the `defaultProps` to enable visual editing in the Studio.

## Code Example
\`\`\`tsx
import { Composition } from 'remotion';
import { MyComp } from './MyComp';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="my-video"
        component={MyComp}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Hello World"
        }}
      />
    </>
  );
};
\`\`\`
