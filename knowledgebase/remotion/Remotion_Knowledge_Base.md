# Remotion Knowledge Base for AI Agents

This knowledge base contains structured documentation for Remotion, a framework for programmatic video creation using React.

## Navigation

### 1. Core Primitives
- [Composition](./core/Composition.md): Registering and configuring videos.
- [useCurrentFrame](./core/useCurrentFrame.md): Accessing the current frame in components.
- [useVideoConfig](./core/useVideoConfig.md): Accessing composition metadata.
- [Sequence](./core/Sequence.md): Time-shifting and layering components.
- [Series](./core/Series.md): Sequential scene management.

### 2. Animation Utilities
- [interpolate](./animation/interpolate.md): Mapping ranges (e.g., frame to opacity).
- [spring](./animation/spring.md): Physics-based natural motion.
- [Easing](./animation/Easing.md): Standard easing functions for interpolation.

### 3. Visual Components & Assets
- [AbsoluteFill](./visuals/AbsoluteFill.md): Full-frame layout container.
- [Img](./visuals/Img.md): High-reliability image tag.
- [Video](./visuals/Video.md): Synchronized video playback (Html5Video / OffthreadVideo).
- [Audio](./visuals/Audio.md): Synchronized audio playback.
- [staticFile](./visuals/staticFile.md): Referencing assets from \`public/\`.

### 4. CLI & Rendering
- [CLI](./cli/CLI.md): Command line reference and examples.
- [Config](./cli/Config.md): Global configuration via \`remotion.config.ts\`.
- [renderMedia](./renderer/renderMedia.md): Programmatic rendering from Node.js.

## Core Concepts for Agents
- **Frames vs Time**: Remotion is frame-based. Always use \`useCurrentFrame()\` for temporal logic.
- **Pure Functions**: Components should be "pure" with respect to the frame number for deterministic rendering.
- **Asset Loading**: Use Remotion-provided tags (\`<Img>\`, \`<Video>\`) to ensure assets are ready before the frame is captured.
- **Server-Side Rendering**: Remotion can be rendered in the cloud (AWS Lambda) using the same code used for local previews.
