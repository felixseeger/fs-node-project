# TypeScript Migration Plan for Node Project

## Phase 1: Preparation & Setup (Week 1)

### 1.1 Project Assessment
- **Audit current codebase**: Analyze all JavaScript files (1,800+ lines)
- **Identify dependencies**: Check for TypeScript compatibility
- **Document complex patterns**: Note any advanced JS patterns that need special handling

### 1.2 Environment Setup
- **Install TypeScript**: `npm install typescript @types/react @types/node --save-dev`
- **Configure tsconfig.json**:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "jsx": "react-jsx",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "moduleResolution": "node",
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
  }
  ```
- **Update package.json**: Add TypeScript build scripts
- **Set up ESLint for TypeScript**: Configure `@typescript-eslint`

### 1.3 Development Tools
- **VS Code extensions**: TypeScript Hero, ESLint, Prettier
- **CI/CD integration**: Add TypeScript compilation to build pipeline
- **Documentation**: Create TypeScript style guide

## Phase 2: Core Infrastructure (Week 2)

### 2.1 Type Definitions
- **Create global types**: `types/global.d.ts`
  ```typescript
  type NodeType = 
    'generator' | 'analyzer' | 'editor' | 'utility' | 
    'comment' | 'group' | 'layer' | 'universal' | 'element';
  
  type HandleType = 'image' | 'video' | 'text' | 'audio' | 'any' | 'aspect_ratio' | 'resolution' | 'num_images';

  interface NodeData {
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: Record<string, any>;
    selected?: boolean;
    width?: number;
    height?: number;
  }

  interface EdgeData {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type?: string;
    animated?: boolean;
  }

  interface Workflow {
    id: string;
    name: string;
    nodes: NodeData[];
    edges: EdgeData[];
    createdAt: string;
    updatedAt: string;
  }

  interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: string;
    isVoice?: boolean;
  }
  ```

### 2.2 Utility Functions
- **Migrate `frontend/src/utils/`**:
  - `handleTypes.ts`: Convert to TypeScript with proper type guards
  - `api.ts`: Add return type annotations (updated with new endpoints)
  - `imageUtils.ts`: Type file operations
  - `workflowJSON.ts`: Type workflow JSON operations (new)

### 2.3 Shared Components
- **Convert `frontend/src/nodes/shared.jsx`** to TypeScript
- **Create type-safe hooks**: `useNodeConnections.ts`, `useNodeProgress.ts`
- **Type shared constants**: `CATEGORY_COLORS`, `sp`, etc.

## Phase 3: Component Migration (Weeks 3-6)

### 3.1 Migration Strategy
- **Prioritize by complexity**: Start with simplest components
- **Incremental approach**: Convert 3-5 components per day
- **Test coverage**: Ensure existing tests pass after conversion
- **Include new components**: Add recently added components to migration plan

### 3.2 Component Conversion Order

**Week 3 - Simple Components:**
- `frontend/src/components/MatrixDot.jsx` → `.tsx`
- `frontend/src/components/ThemeToggle.jsx` → `.tsx`
- `frontend/src/components/ScrollDownIndicator.jsx` → `.tsx`
- `frontend/src/components/DecodeTextButton.jsx` → `.tsx`
- `frontend/src/components/MobileNavigation.jsx` → `.tsx` (new)

**Week 4 - Medium Complexity:**
- `frontend/src/components/ChatUI.jsx` → `.tsx` (with voice input)
- `frontend/src/components/InspectorPanel.jsx` → `.tsx`
- `frontend/src/components/ChatIcon.jsx` → `.tsx`
- `frontend/src/components/ChatButton.jsx` → `.tsx`
- `frontend/src/components/ReferenceSelection.jsx` → `.tsx` (new)

**Week 5 - Complex Components:**
- `frontend/src/nodes/NodeShell.jsx` → `.tsx` (updated with rounded rectangle folding)
- `frontend/src/nodes/GeneratorNode.jsx` → `.tsx` (updated)
- `frontend/src/nodes/ImageAnalyzerNode.jsx` → `.tsx`
- `frontend/src/nodes/ResponseNode.jsx` → `.tsx`
- `frontend/src/nodes/ImageUniversalGeneratorNode.jsx` → `.tsx` (new)

**Week 6 - New and Updated Components:**
- `frontend/src/nodes/CommentNode.jsx` → `.tsx` (new)
- `frontend/src/nodes/GroupEditingNode.jsx` → `.tsx` (new)
- `frontend/src/nodes/LayerEditorNode.jsx` → `.tsx` (new)
- `frontend/src/nodes/NodeGenerateButton.jsx` → `.tsx` (new)
- `frontend/src/nodes/NodePropertyEditor.jsx` → `.tsx` (new)
- `frontend/src/nodes/TextElementNode.jsx` → `.tsx` (new)
- `frontend/src/nodes/VideoUniversalGeneratorNode.jsx` → `.tsx` (new)
- `frontend/src/EditorTopBar.jsx` → `.tsx` (updated)
- `frontend/src/GooeyNodesMenu.jsx` → `.tsx` (updated)

### 3.3 Node Component Pattern
```typescript
interface NodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
  onUpdate: (id: string, patch: Partial<NodeData>) => void;
}

const NodeComponent: React.FC<NodeProps> = ({ id, data, selected, onUpdate }) => {
  // Type-safe implementation
};
```

## Phase 4: Backend & API Layer (Week 6)

### 4.1 API Services
- **Convert `frontend/src/utils/api.js`** to TypeScript
- **Add proper return types** for all API functions (including new endpoints):
  ```typescript
  async function generateImage(params: GenerateParams): Promise<GenerateResult> {
    // Implementation
  }

  async function analyzeWorkflow(workflow: Workflow): Promise<AnalysisResult> {
    // New workflow analysis endpoint
  }

  async function createWorkflow(name: string, nodes: NodeData[], edges: EdgeData[]): Promise<Workflow> {
    // New workflow creation endpoint
  }

  interface GenerateParams {
    prompt: string;
    model: string;
    numOutputs: number;
    aspectRatio?: string;
    resolution?: string;
  }

  interface GenerateResult {
    success: boolean;
    data?: string[];
    error?: string;
    taskId?: string;
  }

  interface AnalysisResult {
    success: boolean;
    analysis?: {
      nodeCount: number;
      edgeCount: number;
      complexityScore: number;
      suggestions: string[];
    };
    error?: string;
  }
  ```

### 4.2 Express Backend
- **Add TypeScript to `api/server.js`**:
  ```typescript
  import express, { Request, Response, NextFunction } from 'express';

  app.post('/api/generate', async (req: Request, res: Response) => {
    // Type-safe implementation
  });
  ```

## Phase 5: Final Integration (Week 7)

### 5.1 Main Application
- **Convert `frontend/src/App.jsx`** to TypeScript
- **Type all state and props** (including new workflow creation):
  ```typescript
  interface AppState {
    nodes: NodeData[];
    edges: EdgeData[];
    workflows: Workflow[];
    isRunning: boolean;
    selectedNodes: string[];
    contextMenu?: {
      x: number;
      y: number;
      items: MenuItem[];
    };
  }

  interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }
  ```

### 5.2 Landing Page
- **Convert `frontend/src/LandingPage.jsx`** to TypeScript
- **Type all event handlers and state** (including new "Talk to your workflow" section)

### 5.3 Projects Dashboard
- **Convert `frontend/src/ProjectsDashboard.jsx`** to TypeScript
- **Type project data and event handlers**

### 5.4 Editor Components
- **Convert `frontend/src/EditorTopBar.jsx`** to TypeScript
- **Convert `frontend/src/GooeyNodesMenu.jsx`** to TypeScript
- **Type all editor state and callbacks**

### 5.3 Final Testing
- **Type coverage**: Ensure 95%+ of codebase is typed
- **Regression testing**: Verify all existing functionality
- **Performance testing**: Check TypeScript compilation impact

## Phase 6: Deployment & Documentation (Weeks 8-9)

### 6.1 Build Optimization
- **Update build scripts**: Ensure TypeScript compilation is optimized for 50+ components
- **Source maps**: Configure for production debugging
- **Tree shaking**: Ensure unused types are eliminated
- **Incremental builds**: Optimize for large component library

### 6.2 Documentation
- **TypeScript guide**: Best practices for the project (including node patterns)
- **Migration guide**: How to add new typed components
- **JSDoc to TSDoc**: Convert all documentation comments
- **Node development guide**: TypeScript patterns for creating new nodes
- **API documentation**: Type definitions for all 65+ endpoints

### 6.3 Deployment
- **Staging deployment**: Test TypeScript build in staging
- **Production rollout**: Monitor for any runtime issues
- **Rollback plan**: Prepare for quick revert if needed
- **Feature validation**: Test all new features (voice input, workflow creation, etc.)
- **Performance monitoring**: Track TypeScript impact on production

## Migration Tools & Techniques

### Automated Conversion
- **`ts-migrate`**: For initial conversion of simple files
- **`jscodeshift`**: For pattern-based transformations

### Manual Conversion
- **Complex components**: Require manual typing
- **Dynamic patterns**: Need careful type definition
- **Legacy code**: May require gradual migration

## Benefits of TypeScript Migration

### 1. Development Experience
- **Better IDE support**: Autocomplete, type checking for all components including new ones
- **Early error detection**: Catch bugs during development (especially important for complex node interactions)
- **Improved refactoring**: Safe code modifications across 50+ node types
- **Voice input typing**: Type safety for SpeechRecognition API integration

### 2. Code Quality
- **Type safety**: Reduce runtime errors in workflow execution
- **Self-documenting code**: Types serve as documentation for node connections and handle types
- **Better maintainability**: Clearer code structure across growing component library
- **Workflow validation**: Type-safe workflow creation and analysis

### 3. Team Collaboration
- **Consistent interfaces**: Clear contracts between components (especially node inputs/outputs)
- **Reduced bugs**: Fewer type-related issues in production workflows
- **Easier onboarding**: New developers understand node system and handle types faster
- **Context menu safety**: Type-safe context menu items and actions

## Risk Mitigation

### 1. Gradual Rollout
- **Feature flags**: Enable TypeScript features incrementally
- **Parallel builds**: Maintain JS build during transition
- **Monitoring**: Track TypeScript-specific errors

### 2. Fallback Strategies
- **Any type escape hatches**: For complex dynamic scenarios
- **Type assertions**: When precise typing is impractical
- **JS fallback**: Keep critical paths in JavaScript if needed

## Success Metrics

- **Type coverage**: 95%+ of codebase typed (including 50+ node components)
- **Build time**: < 10% increase in build duration
- **Bundle size**: < 5% increase in production bundle
- **Error reduction**: 30%+ decrease in runtime type errors
- **Developer satisfaction**: Improved DX metrics
- **Component consistency**: All node components follow same TypeScript patterns
- **API coverage**: All 65+ API endpoints properly typed
- **New feature coverage**: Voice input, workflow creation, and context menu fully typed