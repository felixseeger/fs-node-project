# FS Node Project - AI Pipeline Editor

A node-based visual editor for building AI-powered image, video, and audio processing pipelines. Users can drag and drop nodes onto a canvas, connect them with typed edges, and execute complex generative AI workflows.

## Project Architecture

### Technology Stack

**Frontend:**
- React 19 with StrictMode
- Vite 8 (build tool)
- @xyflow/react (React Flow) for node canvas
- ES Modules (type: "module")
- UUID for node ID generation

**Backend:**
- Express.js 5.x
- Node.js ES Modules
- Multer (file upload handling)
- CORS enabled
- dotenv for environment variables
- Anthropic SDK for Claude Vision

**External APIs:**
- Freepik API (image generation, upscaling, video, audio)
- Anthropic Claude (image analysis via `/api/analyze-image`)
- Various video generation APIs (Kling, Runway, MiniMax, etc.)

### Directory Structure

```
/Node-Project/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── nodes/         # 50+ node component implementations
│   │   │   ├── shared.js  # Barrel exports for shared components
│   │   │   ├── nodeTokens.js  # Design tokens
│   │   │   ├── NodeShell.jsx  # Base node wrapper
│   │   │   ├── NodeControls.jsx  # UI controls (pills, toggles, sliders)
│   │   │   ├── NodeSection.jsx   # Node section headers
│   │   │   ├── NodeOutput.jsx    # Output handles and preview
│   │   │   ├── useNodeConnections.js  # Connection management hook
│   │   │   ├── useNodeExecution.js    # Node execution logic
│   │   │   └── [50+ node types].jsx   # Individual node implementations
│   │   ├── utils/
│   │   │   ├── api.js     # All API client functions
│   │   │   └── handleTypes.js  # Handle type validation & colors
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── dist/              # Build output (copied to public/)
│   ├── ref/               # Reference images for UI development
│   └── visual-compare.mjs # Playwright-based visual regression
├── api/                   # Express backend
│   └── server.js          # All API routes (~77KB, 2300+ lines)
├── public/                # Static assets (served in production)
├── test_*.py              # Python vision tests using Gemini
├── patch_*.js/py          # Migration/patch scripts
└── node-app-prompt.md     # Original project specification
```

## Build and Development Commands

### Root Level (Production Build)
```bash
npm run build
```
This command:
1. Installs frontend dependencies
2. Builds frontend with Vite
3. Installs backend dependencies
4. Copies `frontend/dist` to `public/`

### Frontend Development
```bash
cd frontend
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend Development
```bash
cd api
npm start        # Start Express server (port 3001)
```

### Visual Regression Testing
```bash
cd frontend
node visual-compare.mjs  # Compares current UI against reference
```

## Core Concepts

### Node Philosophy
> "A node is just a visual representation of the JSON body that gets sent to an API."

Each node wraps an API endpoint:
- **Left handles (inputs)** = API request parameters
- **Right handles (outputs)** = API response data
- **Node body** = Configuration UI for the API call

Example: The `GeneratorNode` (Nano Banana 2 Edit) sends to `/api/generate-image`

### Connection Types (Typed Handles)

Handles use colored circles indicating data type:

| Data Type | Color | Handle IDs |
|-----------|-------|------------|
| `image` | Pink `#ec4899` | `output`, `image-in`, `images-in`, `image_urls`, `image`, `image-out` |
| `video` | Teal `#14b8a6` | `video-out`, `output-video` |
| `audio` | Purple `#a855f7` | `output-audio`, `audio-in`, `audio` |
| `text` | Orange `#f97316` | `prompt-in`, `prompt-out`, `analysis-in`, `analysis-out`, `text-in`, `text-out`, anything with "prompt", "analysis", or "text" |
| `aspect_ratio` | Amber `#f59e0b` | `aspect-ratio-in`, `aspect_ratio`, anything with "aspect" |
| `resolution` | Green `#22c55e` | `resolution-in`, `resolution`, anything with "resolution" |
| `num_images` | Purple `#8b5cf6` | `num-images-in`, `num_images`, anything with "num_images" |
| `any` | Purple `#8b5cf6` | Fallback - connects to anything |

**Connection Rules:**
- Same type → Connect
- `any` type → Connects to anything
- Different types → Reject
- No self-connections

### Node Categories

**Inputs:**
- `InputNode` - Request inputs (prompt, images, aspect ratio, resolution, num_images)
- `TextNode` - Text input
- `ImageNode` - Image upload/display
- `AssetNode` - Asset collection node

**LLMs & Vision:**
- `ImageAnalyzerNode` - Claude Sonnet Vision analysis
- `ImageToPromptNode` - Reverse image to prompt
- `ImprovePromptNode` - Prompt enhancement
- `AIImageClassifierNode` - AI image classification

**Image Generation:**
- `GeneratorNode` - Nano Banana 2 Edit, Kora Reality
- `FluxReimagineNode` - Flux image reimagination
- `TextToIconNode` - AI icon generation

**Image Editing:**
- `CreativeUpScaleNode`, `PrecisionUpScaleNode` - Image upscaling
- `RelightNode` - Lighting adjustment
- `StyleTransferNode` - Style transfer
- `RemoveBackgroundNode` - Background removal
- `FluxImageExpandNode`, `SeedreamExpandNode`, `IdeogramExpandNode` - Image outpainting
- `IdeogramInpaintNode` - Image inpainting
- `SkinEnhancerNode` - Skin enhancement
- `ChangeCameraNode` - Camera angle change

**Video Generation:**
- `Kling3Node`, `Kling3OmniNode`, `Kling3MotionControlNode` - Kling 3 video
- `KlingElementsProNode`, `KlingO1Node` - More Kling variants
- `MiniMaxLiveNode` - MiniMax video
- `Wan26VideoNode` - WAN 2.6 video
- `SeedanceNode` - Seedance 1.5 Pro
- `LtxVideo2ProNode` - LTX Video 2.0 Pro
- `RunwayGen45Node`, `RunwayGen4TurboNode`, `RunwayActTwoNode` - Runway video
- `PixVerseV5Node`, `PixVerseV5TransitionNode` - PixVerse video
- `OmniHumanNode` - OmniHuman avatar video

**Video Editing:**
- `VfxNode` - Video effects
- `CreativeVideoUpscaleNode`, `PrecisionVideoUpscaleNode` - Video upscaling

**Audio Generation:**
- `MusicGenerationNode` - ElevenLabs Music
- `SoundEffectsNode` - ElevenLabs Sound Effects
- `AudioIsolationNode` - SAM Audio Isolation
- `VoiceoverNode` - ElevenLabs Voiceover

**Utilities:**
- `ResponseNode` - Output/display node
- `AdaptedPromptNode` - Prompt adaptation
- `LayerEditorNode` - Layer management
- `RouterNode` - Flow routing
- `CommentNode` - Annotation

## Design System

### Visual Style
- **Canvas background:** `#1a1a1a`
- **Node background:** `#2a2a2a`
- **Node border:** `1px solid #3a3a3a`
- **Node hover border:** `#4a4a4a`
- **Selected node border:** `#3b82f6` (blue)
- **Text color:** `#e0e0e0`
- **Border radius:** 8px
- **Handle size:** 10x10px circles

**No glassmorphism, no blur effects, no animations on nodes.**

### Design Tokens (frontend/src/nodes/nodeTokens.js)
```javascript
// Category colors for node headers
CATEGORY_COLORS = {
  imageGeneration: '#f97316',  // Orange
  imageEditing:    '#f97316',  // Orange
  videoGeneration: '#14b8a6',  // Teal
  videoEditing:    '#14b8a6',  // Teal
  vision:          '#0ea5e9',  // Blue
  utility:         '#8b5cf6',  // Purple
  input:           '#6b7280',  // Gray
}

// Surfaces
surface.base = '#2a2a2a'
surface.sunken = '#1a1a1a'
surface.deep = '#111111'

// Spacing scale (4px base)
sp = { 0:0, 1:4, 2:6, 3:8, 4:10, 5:12, 6:16, 7:20, 8:24, 9:32 }
```

## Development Patterns

### Creating a New Node

1. **Create the component** in `frontend/src/nodes/{NodeName}.jsx`
2. **Register in App.jsx:**
   - Import the component
   - Add to `nodeTypes` useMemo
   - Add to `NODE_MENU` for the add-node menu
3. **Add API endpoint** in `api/server.js` (if needed)
4. **Add API client** in `frontend/src/utils/api.js`

### Node Component Structure

```jsx
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';

export default function MyNode({ id, data, selected }) {
  // Use shared hooks for connection management
  const { isConnected, getConnectionLabel } = useNodeConnections(id, data);
  
  return (
    <NodeShell
      label={data.label}
      dotColor={CATEGORY_COLORS.imageGeneration}
      selected={selected}
      onDisconnect={/* disconnect handler */}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt-in"
        style={{ background: getHandleColor('prompt-in') }}
      />
      
      {/* Node content */}
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: getHandleColor('output') }}
      />
    </NodeShell>
  );
}
```

### Shared Components

Import from `./nodes/shared`:
- **SectionHeader** - Collapsible section headers
- **LinkedBadges** - Shows connected input sources
- **ConnectionInfo** - Displays connection status
- **ConnectedOrLocal** - Switches between connected/local input
- **Pill, Toggle, Slider** - Form controls
- **PromptInput, TextInput** - Text inputs
- **SettingsPanel, PillGroup** - Layout components
- **OutputHandle, OutputPreview** - Output display

### State Management

Nodes use React props for state:
- `data.onUpdate(id, patch)` - Update node data
- `data.resolveInput(nodeId, handleId)` - Get connected input value
- `data.hasConnection(nodeId, handleId)` - Check if handle is connected
- `data.getConnectionInfo(nodeId, handleId)` - Get source connection info

## API Patterns

### Async Job Pattern
Most AI operations use async jobs:

1. **POST** to initiate → Returns `{ data: { id: taskId } }`
2. **GET** `/status/:taskId` to poll
3. Status values: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`

Example in `api.js`:
```javascript
export async function pollStatus(taskId, maxAttempts = 90, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/status/${taskId}`);
    const data = await res.json();
    if (data.data?.status === 'COMPLETED') return data;
    if (data.data?.status === 'FAILED') throw new Error('Generation failed');
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Polling timeout');
}
```

### Backend Route Pattern

```javascript
// Initiate job
app.post('/api/feature-name', async (req, res) => {
  try {
    const response = await fetch(EXTERNAL_API, {
      method: 'POST',
      headers: freepikHeaders,
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('feature error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Poll status
app.get('/api/feature-name/:taskId', async (req, res) => {
  try {
    const response = await fetch(`${EXTERNAL_API}/${req.params.taskId}`, {
      headers: freepikHeaders,
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

## Environment Variables

Create `.env` in the `api/` directory:

```env
FREEPIK_API_KEY=your_freepik_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Deployment

**Platform:** Vercel

**Configuration (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/server.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The root `npm run build` command prepares the deployment by copying `frontend/dist` to `public/`.

## Testing Strategy

### Python Vision Tests
Multiple `test_*.py` files use Google Gemini API to analyze UI screenshots:
- `test_vision.py` - General vision testing
- `test_workflow.py` - Workflow UI analysis
- `test_hero_vision.py` - Hero section validation
- etc.

These take screenshots from `frontend/ref/` and query Gemini for UI analysis.

### Visual Regression
`frontend/visual-compare.mjs` uses Playwright to:
1. Capture screenshot of running app
2. Compare against reference image using pixelmatch
3. Output diff report

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Right-click` on selected nodes | Context menu (Create Asset) |

## Common Tasks

### Adding a New API Integration
1. Add backend route in `api/server.js`
2. Add API client function in `frontend/src/utils/api.js`
3. Create node component in `frontend/src/nodes/`
4. Register node in `App.jsx` nodeTypes and NODE_MENU
5. Add handle type mappings in `frontend/src/utils/handleTypes.js` if needed

### Modifying Node Styling
Edit `frontend/src/nodes/nodeTokens.js` for global design token changes.

### Adding New Connection Types
1. Add color to `HANDLE_COLORS` in `handleTypes.js`
2. Add handle ID patterns to `getHandleDataType()`
3. Update this documentation

## File Size Notes

- `api/server.js` is ~77KB with 65+ API endpoints - the backend is intentionally monolithic
- Node components average 200-400 lines each
- Shared infrastructure (NodeShell, NodeControls, etc.) keeps nodes DRY
