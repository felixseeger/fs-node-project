# FS Node Project - Complete Documentation

## 🎯 Project Overview

**FS Node Project** is an advanced AI-powered workflow editor that enables users to visually design and execute complex generative AI pipelines using a node-based interface.

### Key Features

- **Node-Based Visual Editor**: Drag-and-drop interface with 50+ node types
- **AI-Powered Workflow Generation**: Natural language to workflow conversion
- **Infinite Canvas**: Virtualized rendering for large workflows
- **Multi-Provider Support**: Freepik, Anthropic, and custom integrations
- **Accessible Design**: Full WCAG compliance
- **Real-Time Preview**: Instant workflow validation and visualization
- **Vibe Coding Interface**: Intuitive chat-based workflow creation
- **Workflow Embedding**: Secure provider reference system

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/fs-node-project.git
cd fs-node-project

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### System Requirements

- Node.js 18+
- npm 8+
- Modern browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM for development

### Phase 2 Updates

**New Features in Phase 2:**
- ✅ Infinite Canvas Implementation - Complete
- ✅ AI-Powered Workflow Generation - Complete
- ✅ Vibe Coding Chat Interface - Complete

### Phase 3 Updates

**New Features in Phase 3:**
- ✅ Comprehensive Test Suite - Complete
- ✅ Deployment Configuration - Complete
- ✅ CI/CD Pipeline - Complete
- ✅ User Testing Framework - Complete

### Phase 4 Updates

**New Features in Phase 4:**
- ✅ Enhanced Provider Integration - Complete
- ✅ Performance Optimization Suite - Complete
- ✅ Comprehensive Testing Framework - Complete
- ✅ Advanced Node Management - Complete
- ✅ Memory Management System - Complete
- ✅ Real-time Performance Monitoring - Complete

### Phase 5 Updates

**New Features in Phase 5:**
- ✅ Advanced Node Management System - Complete
- ✅ Enhanced Provider Integration - Complete
- ✅ Performance Optimization Suite - Complete
- ✅ Comprehensive Testing Framework - Complete
- ✅ Production Deployment Configuration - Complete
- ✅ User Documentation Suite - Complete

### Phase 6 Updates

**New Features in Phase 6:**
- ✅ Advanced Analytics Dashboard - Complete
- ✅ Real-time Collaboration Hub - Complete
- ✅ Enterprise Integration Suite - Complete
- ✅ SSO Authentication System - Complete
- ✅ Audit Logging Framework - Complete
- ✅ Compliance Monitoring - Complete

## 📂 Project Structure

```
/Node-Project/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── nodes/             # 50+ node implementations
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx           # Main application
│   │   └── index.css        # Global styles
│   └── public/               # Static assets
├── api/                      # Express backend
│   └── server.js            # API routes
│   └── workflow-generation.js # AI workflow endpoints
├── docs/                     # Documentation
│   └── DOCUMENTATION.md     # This file
└── package.json             # Project configuration
```

## 🔧 Architecture

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- @xyflow/react (React Flow) for node canvas
- Zustand for state management
- Tailwind CSS for styling
- Vite 8 for build tooling

**Backend:**
- Express.js 5.x
- Node.js ES Modules
- RESTful API design
- Multer for file uploads

**AI Integration:**
- Freepik API for image/video generation
- Anthropic Claude for text analysis
- Custom AI workflow generation engine

### Core Concepts

#### Node Philosophy

> "A node is just a visual representation of the JSON body that gets sent to an API."

Each node wraps an API endpoint:
- **Left handles (inputs)** = API request parameters
- **Right handles (outputs)** = API response data
- **Node body** = Configuration UI for the API call

#### Connection Types

| Data Type | Color | Handle IDs |
|-----------|-------|------------|
| `image` | Pink `#ec4899` | `output`, `image-in`, `images-in` |
| `video` | Teal `#14b8a6` | `video-out`, `output-video` |
| `audio` | Purple `#a855f7` | `output-audio`, `audio-in` |
| `text` | Orange `#f97316` | `prompt-in`, `prompt-out` |
| `aspect_ratio` | Amber `#f59e0b` | `aspect-ratio-in` |
| `resolution` | Green `#22c55e` | `resolution-in` |
| `num_images` | Purple `#8b5cf6` | `num-images-in` |
| `any` | Purple `#8b5cf6` | Fallback connections |

## 🧩 Core Components

### BaseNode Pattern

All nodes inherit from the `BaseNode` component, providing:

```jsx
<BaseNode
  id={id}
  data={data}
  selected={selected}
  onUpdate={onUpdate}
  resolveInput={resolveInput}
  hasConnection={hasConnection}
  getConnectionInfo={getConnectionInfo}
  dotColor={CATEGORY_COLORS[category]}
>
  {/* Node-specific content */}
</BaseNode>
```

**Standard Props:**
- `id`: Unique node identifier
- `data`: Node configuration and state
- `selected`: Selection state
- `onUpdate`: Update node data
- `resolveInput`: Get connected input values
- `hasConnection`: Check connection status
- `getConnectionInfo`: Get connection details

### Infinite Canvas

The `InfiniteCanvas` component provides:

- **Virtualized Rendering**: Only renders visible nodes
- **Smooth Navigation**: Optimized panning and zooming
- **Grid System**: 20px grid with snapping
- **Performance Metrics**: Real-time node/edge counting
- **Navigation Controls**: Center, reset, undo functionality

```jsx
<InfiniteCanvas
  nodes={nodes}
  edges={edges}
  onNodesChange={handleNodesChange}
  onEdgesChange={handleEdgesChange}
/>
```

### AI Workflow Generation

The workflow generation system includes:

1. **Prompt Analysis**: Determine workflow type and requirements
2. **Node Generation**: Create appropriate nodes based on analysis
3. **Edge Connection**: Connect nodes logically
4. **Provider Optimization**: Apply provider-specific enhancements
5. **Validation**: Ensure workflow integrity

**Example Usage:**

```javascript
import { generateWorkflowFromPrompt } from '../utils/workflowAI';

const workflow = await generateWorkflowFromPrompt({
  prompt: 'Create a realistic portrait with high quality',
  providerPreferences: ['freepik', 'anthropic'],
  constraints: { maxNodes: 8 }
});

// Returns complete workflow with nodes and edges
console.log(workflow.nodes.length, 'nodes generated');
```

### Chat Interface

The `ChatPanel` provides an accessible interface for AI interaction:

- **Message History**: Persistent conversation context
- **Workflow Preview**: Visual preview of generated workflows
- **Regenerate**: Quick iteration on previous prompts
- **Accessibility**: Full ARIA support and keyboard navigation

```jsx
<ChatPanel
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  onWorkflowGenerated={handleWorkflowGenerated}
/>
```

## 🤖 AI Workflow Generation API

### Endpoints

**POST `/api/generate-workflow`**
Generate a complete workflow from a text prompt

**Request:**
```json
{
  "prompt": "Create a surreal landscape with vibrant colors",
  "providerPreferences": ["freepik", "anthropic"],
  "constraints": {
    "maxNodes": 6,
    "quality": "high"
  }
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "workflow-123456789",
    "name": "Generated surreal Workflow",
    "nodes": [...],
    "edges": [...],
    "metadata": {...}
  },
  "validation": {
    "valid": true,
    "errors": []
  }
}
```

**GET `/api/workflow-status/:workflowId`**
Check workflow generation status

**POST `/api/preview-workflow`**
Generate a preview with limited nodes

**GET `/api/workflow-templates`**
List available workflow templates

## 🎨 Node Development

### Creating a New Node

1. **Create the component** in `frontend/src/nodes/{NodeName}.jsx`
2. **Register in App.jsx**:
   - Import the component
   - Add to `nodeTypes` useMemo
   - Add to `NODE_MENU` for the add-node menu
3. **Add API endpoint** in `api/server.js` (if needed)
4. **Add API client** in `frontend/src/utils/api.js`

### Node Component Structure

```jsx
import { Position, Handle } from '@xyflow/react';
import BaseNode, { NodeHandle } from './BaseNode';
import { CATEGORY_COLORS } from './nodeTokens';

export default function MyNode({ id, data, selected, onUpdate, resolveInput, hasConnection, getConnectionInfo }) {
  // Resolve inputs
  const inputValue = resolveInput(id, 'input-handle');
  const isConnected = hasConnection(id, 'input-handle');

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      onUpdate={onUpdate}
      resolveInput={resolveInput}
      hasConnection={hasConnection}
      getConnectionInfo={getConnectionInfo}
      dotColor={CATEGORY_COLORS.imageGeneration}
    >
      {/* Input handle */}
      <NodeHandle
        handleId="input-handle"
        type="target"
        position="left"
        label="Input"
        description="Connect data to this handle"
        isRequired={true}
      />

      {/* Node content */}
      <div style={{ padding: '16px' }}>
        {inputValue || 'No input connected'}
      </div>

      {/* Output handle */}
      <NodeHandle
        handleId="output-handle"
        type="source"
        position="right"
        label="Output"
        description="Generated output data"
        isRequired={false}
      />
    </BaseNode>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create `.env` in the `api/` directory:

```env
# API Keys
FREEPIK_API_KEY=your_freepik_key
ANTHROPIC_API_KEY=your_anthropic_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Build Configuration

Update `vite.config.js` for production:

```javascript
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- handleTypes.test.js

# Run with coverage
npm test -- --coverage
```

### Test Structure

```
frontend/src/utils/
├── handleTypes.js        # Core utility
├── handleTypes.test.js   # Comprehensive tests
└── __mocks__/            # Mock data
```

**Test Example:**

```javascript
import { getHandleDataType, isValidConnection } from './handleTypes';

describe('handleTypes utility', () => {
  test('getHandleDataType returns correct type for image handles', () => {
    expect(getHandleDataType('output')).toBe('image');
    expect(getHandleDataType('image-in')).toBe('image');
  });

  test('isValidConnection validates connections correctly', () => {
    const valid = isValidConnection('image', 'image');
    expect(valid).toBe(true);

    const invalid = isValidConnection('image', 'text');
    expect(invalid).toBe(false);
  });
});
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configuration (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/server.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["node", "api/server.js"]
```

Build and run:
```bash
docker build -t fs-node-project .
docker run -p 3001:3001 fs-node-project
```

## 📚 Node Reference

### Available Node Types

**Input Nodes:**
- `InputNode`: Basic input node
- `TextNode`: Text input
- `ImageNode`: Image upload/display
- `AssetNode`: Asset collection

**Generation Nodes:**
- `GeneratorNode`: Nano Banana 2 Edit, Kora Reality
- `FluxReimagineNode`: Flux image reimagination
- `TextToIconNode`: AI icon generation

**Image Editing:**
- `CreativeUpScaleNode`, `PrecisionUpScaleNode`: Image upscaling
- `RelightNode`: Lighting adjustment
- `StyleTransferNode`: Style transfer
- `RemoveBackgroundNode`: Background removal
- `FluxImageExpandNode`, `SeedreamExpandNode`, `IdeogramExpandNode`: Image outpainting
- `IdeogramInpaintNode`: Image inpainting
- `SkinEnhancerNode`: Skin enhancement
- `ChangeCameraNode`: Camera angle change

**Video Generation:**
- `Kling3Node`, `Kling3OmniNode`, `Kling3MotionControlNode`: Kling 3 video
- `KlingElementsProNode`, `KlingO1Node`: More Kling variants
- `MiniMaxLiveNode`: MiniMax video
- `Wan26VideoNode`: WAN 2.6 video
- `SeedanceNode`: Seedance 1.5 Pro
- `LtxVideo2ProNode`: LTX Video 2.0 Pro
- `RunwayGen45Node`, `RunwayGen4TurboNode`, `RunwayActTwoNode`: Runway video
- `PixVerseV5Node`, `PixVerseV5TransitionNode`: PixVerse video
- `OmniHumanNode`: OmniHuman avatar video

**Video Editing:**
- `VfxNode`: Video effects
- `CreativeVideoUpscaleNode`, `PrecisionVideoUpscaleNode`: Video upscaling

**Audio Generation:**
- `MusicGenerationNode`: ElevenLabs Music
- `SoundEffectsNode`: ElevenLabs Sound Effects
- `AudioIsolationNode`: SAM Audio Isolation
- `VoiceoverNode`: ElevenLabs Voiceover

**AI & Vision:**
- `ImageAnalyzerNode`: Claude Sonnet Vision analysis
- `ImageToPromptNode`: Reverse image to prompt
- `ImprovePromptNode`: Prompt enhancement
- `AIImageClassifierNode`: AI image classification

**Utilities:**
- `ResponseNode`: Output/display node
- `AdaptedPromptNode`: Prompt adaptation
- `LayerEditorNode`: Layer management
- `RouterNode`: Flow routing
- `CommentNode`: Annotation

## 🎓 Best Practices

### Node Development

1. **Use BaseNode Pattern**: Always extend BaseNode for consistency
2. **Type Safety**: Use TypeScript interfaces for node data
3. **Accessibility**: Include ARIA attributes and keyboard support
4. **Performance**: Optimize rendering for large workflows
5. **Error Handling**: Graceful degradation for API failures

### Workflow Design

1. **Modular Design**: Break complex workflows into smaller sub-workflows
2. **Error Handling**: Add validation nodes for critical paths
3. **Performance**: Limit concurrent operations in complex workflows
4. **Documentation**: Use CommentNode to annotate complex sections
5. **Testing**: Validate workflows before execution

### Performance Optimization

1. **Virtualization**: Use InfiniteCanvas for large workflows
2. **Debouncing**: Debounce rapid updates and interactions
3. **Memoization**: Memoize expensive computations
4. **Web Workers**: Offload heavy processing to web workers
5. **Lazy Loading**: Load node components on demand

## 🐛 Troubleshooting

### Common Issues

**Canvas Performance Issues**
- **Symptom**: Lag with 500+ nodes
- **Solution**: Enable virtualization, reduce viewport size, simplify node complexity

**Connection Validation Errors**
- **Symptom**: Invalid connection warnings
- **Solution**: Check handle types, verify node compatibility, review connection rules

**API Integration Failures**
- **Symptom**: Node execution errors
- **Solution**: Check API keys, verify endpoint URLs, review request/response formats

**Accessibility Warnings**
- **Symptom**: ARIA validation errors
- **Solution**: Add missing ARIA attributes, ensure keyboard navigation, test with screen readers

### Debugging Tools

```javascript
// Enable debug logging
localStorage.debug = 'fs-node:*'

// Check canvas performance
const { getCanvasPerformanceMetrics } = useInfiniteCanvas();
console.log(getCanvasPerformanceMetrics(nodes, edges));

// Validate workflow
import { validateWorkflow } from '../utils/workflowAI';
console.log(validateWorkflow(currentWorkflow));
```

## 📖 Changelog

### Version 1.0.0 (Current)
- ✅ Complete Phase 1: Foundation with BaseNode pattern
- ✅ Complete Phase 2: Core features (Infinite Canvas, AI Generation, Chat)
- ✅ 50+ node types implemented
- ✅ Full accessibility compliance
- ✅ Multi-provider integration
- ✅ Comprehensive testing

### Upcoming Features
- 🔜 Advanced workflow templates
- 🔜 Collaboration features
- 🔜 Version control integration
- 🔜 Plugin system for custom nodes
- 🔜 Enhanced analytics and insights

## 🤝 Community & Support

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request
5. Follow the code style guide

### Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Complete API and component reference
- **Community**: Join our Discord for discussions
- **Email**: support@felixseeger.de
## 📜 License

MIT License - Free for personal and commercial use

## 🎉 Conclusion

FS Node Project provides a powerful, accessible platform for creating complex AI workflows visually. With its infinite canvas, intelligent generation, and comprehensive node library, it empowers users to build sophisticated generative AI pipelines without writing code.

**Key Benefits:**
- 🚀 Rapid workflow creation with AI assistance
- 🎨 Visual design interface for complex pipelines
- 🤖 Intelligent node recommendations
- ✨ Infinite canvas for unlimited creativity
- ♿ Full accessibility compliance

Start building your AI workflows today! 🎉
