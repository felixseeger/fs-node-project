import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import LayerEditorNode from './LayerEditorNode';
import React from 'react';

// Mock Worker
const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();

class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  postMessage = mockPostMessage;
  terminate = mockTerminate;
  constructor(url: string | URL) {}
}

vi.stubGlobal('Worker', MockWorker);

// Mock HTMLCanvasElement.transferControlToOffscreen
HTMLCanvasElement.prototype.transferControlToOffscreen = vi.fn().mockReturnValue({
  width: 1024,
  height: 1024,
});

// Mock blue-ether
vi.mock('blue-ether', () => ({
  Timeline: ({ value, onChange, onScrubStart, onScrubEnd }: any) => (
    <div data-testid="timeline" onClick={() => onChange(2.5)}>
      Timeline: {value}
      <button data-testid="scrub-start" onClick={onScrubStart}>Start Scrub</button>
      <button data-testid="scrub-end" onClick={onScrubEnd}>End Scrub</button>
    </div>
  ),
  LayerStack: ({ layers, onReorder, onLayerChange }: any) => (
    <div data-testid="layer-stack">
      {layers.map((l: any) => (
        <div key={l.id} data-testid={`layer-${l.id}`}>
          {l.name} - Opacity: {l.opacity} - Visible: {l.visible ? 'true' : 'false'}
          <button 
            data-testid={`change-layer-${l.id}`} 
            onClick={() => onLayerChange(l.id, { opacity: 50, visible: false })}
          >
            Change
          </button>
        </div>
      ))}
      <button data-testid="reorder-btn" onClick={() => onReorder([...layers].reverse())}>
        Reorder
      </button>
    </div>
  ),
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
  surface: { base: '#000', panel: '#111', overlay: '#222' },
  border: { active: '#fff', subtle: '#333', hover: '#666', default: '#333', focus: '#444' },
  control: { bg: '#555', hover: '#666' },
  text: { primary: '#fff', secondary: '#aaa' },
  ui: { accent: '#f00' },
  sp: { sm: '4px', md: '8px', lg: '16px' },
  font: { sans: 'sans-serif' },
  radius: { sm: '4px', md: '8px', lg: '16px' },
  CATEGORY_COLORS: { default: '#000' },
  inputStyle: {},
  textareaStyle: {},
  settingsPanelStyle: {},
  settingsTitleStyle: {},
  outputBoxStyle: {},
  summaryRowStyle: {},
}));

// Mock useNodeConnections
vi.mock('./useNodeConnections', () => ({
  default: vi.fn().mockImplementation(() => ({
    resolve: {
      image: vi.fn().mockReturnValue(['img1.png', 'img2.png']),
      video: vi.fn().mockReturnValue(['vid1.mp4'])
    },
    update: vi.fn()
  }))
}));

// Mock API functions
vi.mock('../utils/api', () => ({
  vfxLtxGenerate: vi.fn().mockResolvedValue({ jobId: 'job-123' }),
  vfxCorridorKeyExtract: vi.fn().mockResolvedValue({ jobId: 'job-456' }),
  pollVfxJobStatus: vi.fn().mockResolvedValue({ status: 'completed', url: 'ai-result.mp4' })
}));

describe('LayerEditorNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPostMessage.mockClear();
    mockTerminate.mockClear();
  });

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders the canvas and placeholder text', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={false} />);
    
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders the editor menu when selected', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const titleElements = screen.getAllByText(/Layer Editor/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Playback/i)).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('layer-stack')).toBeInTheDocument();
  });

  it('updates currentTime and sends SCRUB message when Timeline changes', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const timeline = screen.getByTestId('timeline');
    fireEvent.click(timeline); // Trigger mock onChange(2.5)

    expect(screen.getByText(/Timeline: 2.5/i)).toBeInTheDocument();
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'SCRUB',
      payload: { time: 2.5 }
    });
  });

  it('updates layer order and sends REORDER_LAYERS message when LayerStack reorders', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    // Initial layers from mock useNodeConnections: vid1.mp4, img1.png, img2.png
    const layerStack = screen.getByTestId('layer-stack');
    let layerElements = Array.from(layerStack.children).filter(el => el.getAttribute('data-testid')?.startsWith('layer-'));
    expect(layerElements[0]).toHaveAttribute('data-testid', 'layer-vid1.mp4');
    expect(layerElements[1]).toHaveAttribute('data-testid', 'layer-img1.png');
    expect(layerElements[2]).toHaveAttribute('data-testid', 'layer-img2.png');

    const reorderBtn = screen.getByTestId('reorder-btn');
    fireEvent.click(reorderBtn); // Trigger mock onReorder with reversed layers

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'REORDER_LAYERS',
      payload: { sources: ['img2.png', 'img1.png', 'vid1.mp4'] }
    });

    // Verify state update by checking the new order in the DOM
    layerElements = Array.from(layerStack.children).filter(el => el.getAttribute('data-testid')?.startsWith('layer-'));
    expect(layerElements[0]).toHaveAttribute('data-testid', 'layer-img2.png');
    expect(layerElements[1]).toHaveAttribute('data-testid', 'layer-img1.png');
    expect(layerElements[2]).toHaveAttribute('data-testid', 'layer-vid1.mp4');
  });

  it('updates layer properties and sends UPDATE_LAYER message when LayerStack changes a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    // Initial state
    expect(screen.getByTestId('layer-vid1.mp4')).toHaveTextContent('Opacity: 100 - Visible: true');

    const changeBtn = screen.getByTestId('change-layer-vid1.mp4');
    fireEvent.click(changeBtn); // Trigger mock onLayerChange

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'UPDATE_LAYER',
      payload: { 
        source: 'vid1.mp4', 
        layer: expect.objectContaining({
          opacity: 0.5,
          hidden: true
        })
      }
    });

    // Verify state update by checking the new properties in the DOM
    expect(screen.getByTestId('layer-vid1.mp4')).toHaveTextContent('Opacity: 50 - Visible: false');
  });

  it('handles scrub start and end correctly', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const startBtn = screen.getByTestId('scrub-start');
    const endBtn = screen.getByTestId('scrub-end');
    
    // We can't easily test the internal isScrubbing state directly, 
    // but we can verify the callbacks don't crash
    fireEvent.click(startBtn);
    fireEvent.click(endBtn);
  });

  it('toggles play and pause and sends correct messages', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const playBtn = screen.getByTitle('Play');
    
    // Click Play
    fireEvent.click(playBtn);
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'PLAY' });
    
    // Button should now be Pause
    const pauseBtn = screen.getByTitle('Pause');
    expect(pauseBtn).toBeInTheDocument();
    
    // Click Pause
    fireEvent.click(pauseBtn);
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'PAUSE' });
  });

  it('stops playback and sends STOP message', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const stopBtn = screen.getByTitle('Stop');
    
    fireEvent.click(stopBtn);
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'STOP' });
  });

  it('handles export video', async () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const exportBtn = screen.getByText('Export Video');
    
    fireEvent.click(exportBtn);
    
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'STOP' });
    
    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith({ 
        type: 'RECORD', 
        payload: { duration: 5 } 
      });
    });
    expect(screen.getByText('Exporting...')).toBeInTheDocument();
  });

  it('handles Add AI Background', async () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const aiBgBtn = screen.getByText('Add AI Background');
    fireEvent.click(aiBgBtn);
    
    // Wait for the async operations to complete
    await screen.findByText('Processing AI...');
    
    // The mock pollVfxJobStatus resolves immediately, so we should see the ADD_LAYER message
    // We need to wait for the promise chain to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'ADD_LAYER',
      payload: {
        layer: expect.objectContaining({
          source: 'ai-result.mp4',
          isAI: true
        })
      }
    });
  });

  it('handles AI Green Screen Key', async () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const greenScreenBtn = screen.getByText('AI Green Screen Key');
    fireEvent.click(greenScreenBtn);
    
    // Wait for the async operations to complete
    await screen.findByText('Processing AI...');
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'ADD_LAYER',
      payload: {
        layer: expect.objectContaining({
          source: 'ai-result.mp4',
          isAI: true
        })
      }
    });
  });

  it('toggles proxy mode and updates dimensions', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const proxyCheckbox = screen.getByRole('checkbox');
    
    // Initial dimensions (1024x1024)
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'UPDATE_DIMENSIONS',
      payload: { width: 1024, height: 1024 }
    });
    
    mockPostMessage.mockClear();
    
    // Enable proxy mode
    fireEvent.click(proxyCheckbox);
    
    // Dimensions should be halved (512x512)
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'UPDATE_DIMENSIONS',
      payload: { width: 512, height: 512 }
    });
  });
});
