import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import LayerEditorNode from './LayerEditorNode';
import React from 'react';

// Mock @remotion/player
vi.mock('@remotion/player', () => ({
  Player: vi.fn(({ style, inputProps }: any) => (
    <div data-testid="remotion-player" style={style}>
      Player Mock - Layers: {inputProps.layers.length}
    </div>
  ))
}));

// Mock hooks
const mockAddLayer = vi.fn();
const mockRemoveLayer = vi.fn();
const mockUpdateLayer = vi.fn();

vi.mock('../hooks/useLayerManager', () => ({
  useLayerManager: vi.fn(() => ({
    layers: [
      { id: 'layer-1', type: 'video', src: 'vid1.mp4', from: 0, durationInFrames: 120, zIndex: 0 },
      { id: 'layer-2', type: 'image', src: 'img1.png', from: 10, durationInFrames: 60, zIndex: 1 }
    ],
    addLayer: mockAddLayer,
    removeLayer: mockRemoveLayer,
    updateLayer: mockUpdateLayer
  }))
}));

// Mock components
vi.mock('../components/LayerTimeline', () => ({
  LayerTimeline: ({ layers, onSeek }: any) => (
    <div data-testid="layer-timeline" onClick={() => onSeek(50)}>
      Timeline Mock - Layers: {layers.length}
    </div>
  )
}));

vi.mock('../components/LayerItem', () => ({
  LayerItem: ({ layer, onUpdate, onDelete }: any) => (
    <div data-testid={`layer-item-${layer.id}`}>
      Item: {layer.id}
      <button data-testid={`update-${layer.id}`} onClick={() => onUpdate(layer.id, { opacity: 0.5 })}>Update</button>
      <button data-testid={`delete-${layer.id}`} onClick={() => onDelete(layer.id)}>Delete</button>
    </div>
  )
}));

// Mock Remotion composition
vi.mock('../remotion/VideoComposition', () => ({
  VideoComposition: () => <div data-testid="video-composition">Composition</div>
}));

// Mock nodeTokens
vi.mock('./nodeTokens', () => ({
  surface: { base: '#000', sunken: '#111', deep: '#222', canvas: '#333' },
  border: { default: '#444' },
  radius: { sm: 4, md: 8 },
  font: { sans: 'sans-serif' },
  text: { primary: '#fff', secondary: '#aaa', muted: '#888' },
  ui: { link: '#00f' },
  CATEGORY_COLORS: { videoEditing: '#0ff' },
  sp: { 2: 8, 3: 12, 4: 16 }
}));

// Mock useNodeConnections
vi.mock('./useNodeConnections', () => ({
  default: vi.fn().mockImplementation(() => ({
    resolve: {
      image: vi.fn().mockReturnValue(['img-incoming.png']),
      video: vi.fn().mockReturnValue(['vid-incoming.mp4']),
      audio: vi.fn().mockReturnValue(['audio-incoming.mp3'])
    },
    update: vi.fn()
  }))
}));

describe('LayerEditorNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithReactFlow = (ui: React.ReactElement) => {
    return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
  };

  it('renders the Remotion Player', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={false} />);
    
    expect(screen.getByTestId('remotion-player')).toBeInTheDocument();
  });

  it('renders the editor menu when selected', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const titleElements = screen.getAllByText('Layer Editor');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByTestId('layer-timeline')).toBeInTheDocument();
    expect(screen.getByText('Layers (2)')).toBeInTheDocument();
    expect(screen.getByTestId('layer-item-layer-1')).toBeInTheDocument();
    expect(screen.getByTestId('layer-item-layer-2')).toBeInTheDocument();
  });

  it('handles adding a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const addBtn = screen.getByText('+ Add Layer');
    fireEvent.click(addBtn);
    
    expect(mockAddLayer).toHaveBeenCalledWith(expect.objectContaining({
      type: 'video',
      jobType: 'ltx'
    }));
  });

  it('handles updating a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const updateBtn = screen.getByTestId('update-layer-1');
    fireEvent.click(updateBtn);
    
    expect(mockUpdateLayer).toHaveBeenCalledWith('layer-1', { opacity: 0.5 });
  });

  it('handles deleting a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const deleteBtn = screen.getByTestId('delete-layer-1');
    fireEvent.click(deleteBtn);
    
    expect(mockRemoveLayer).toHaveBeenCalledWith('layer-1');
  });

  it('handles seek on timeline', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const timeline = screen.getByTestId('layer-timeline');
    fireEvent.click(timeline); // Triggers onSeek(50)
    
    // We expect it to update internal state or call player ref, 
    // but in mock we just verify click didn't crash
  });

  it('handles export video', async () => {
    // Mock fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, jobId: 'job-123' })
    });
    global.fetch = mockFetch;

    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const exportBtn = screen.getByText('Export Video');
    fireEvent.click(exportBtn);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/vfx/render', expect.objectContaining({
      method: 'POST'
    }));
    
    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeInTheDocument();
    });
  });
});
