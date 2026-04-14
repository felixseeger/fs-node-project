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
      Player Mock - Layers: {inputProps.layers?.length || 0}
    </div>
  ))
}));

// Mock blue-ether
vi.mock('blue-ether', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    LayerStack: ({ layers, onSelect }: any) => (
      <div data-testid="layer-stack">
        LayerStack Mock: {layers?.length || 0} layers
        {layers?.map((l: any) => (
          <button key={l.id} data-testid={`select-${l.id}`} onClick={() => onSelect(l.id)}>Select {l.id}</button>
        ))}
      </div>
    ),
    Timeline: () => <div data-testid="timeline-mock">Timeline Mock</div>,
    Button: ({ children, onClick, style }: any) => <button onClick={onClick} style={style}>{children}</button>
  };
});

// Mock etro
vi.mock('etro', () => {
  return {
    default: {
      Movie: class {
        addLayer() {}
        removeLayer() {}
        play() {}
        pause() {}
        seek() {}
        record() { return Promise.resolve(new Blob()); }
      },
      layer: {
        Image: class {},
        Video: class {},
        Audio: class {}
      },
      KeyFrame: class {},
      Color: class { constructor() {} }
    }
  };
});

// Mock hooks
const mockAddTrack = vi.fn(() => 'track-1');
const mockAddClipToTrack = vi.fn();
const mockRemoveClipFromTrack = vi.fn();
const mockUpdateClipInTrack = vi.fn();
const mockSetCurrentTime = vi.fn();

vi.mock('../contexts/TimelineContext', () => ({
  useTimeline: vi.fn(() => ({
    tracks: [
      { id: 'track-1', type: 'video', clips: [{ id: 'layer-1', type: 'video', src: 'vid1.mp4', from: 0, durationInFrames: 120, zIndex: 0 }] },
      { id: 'track-2', type: 'image', clips: [{ id: 'layer-2', type: 'image', src: 'img1.png', from: 10, durationInFrames: 60, zIndex: 1 }] }
    ],
    addTrack: mockAddTrack,
    addClipToTrack: mockAddClipToTrack,
    removeClipFromTrack: mockRemoveClipFromTrack,
    updateClipInTrack: mockUpdateClipInTrack,
    currentTime: 0,
    setCurrentTime: mockSetCurrentTime
  })),
  TimelineProvider: ({ children }: any) => <>{children}</>
}));

// Mock components
vi.mock('../components/LayerTimeline', () => ({
  LayerTimeline: ({ tracks, onSeek }: any) => (
    <div data-testid="layer-timeline" onClick={() => onSeek(50)}>
      Timeline Mock - Tracks: {tracks?.length || 0}
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
    expect(screen.getByTestId('layer-stack')).toBeInTheDocument();
  });

  it('handles adding a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const addBtn = screen.getByText('+ Video');
    fireEvent.click(addBtn);
    
    expect(mockAddClipToTrack).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      type: 'video',
      jobType: 'none'
    }));
  });

  it('handles updating a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    // Select the layer to make the LayerItem appear
    const selectBtn = screen.getByTestId('select-layer-1');
    fireEvent.click(selectBtn);
    
    const updateBtn = screen.getByTestId('update-layer-1');
    fireEvent.click(updateBtn);
    
    expect(mockUpdateClipInTrack).toHaveBeenCalledWith(expect.any(String), 'layer-1', { opacity: 0.5 });
  });

  it('handles deleting a layer', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    // Select the layer to make the LayerItem appear
    const selectBtn = screen.getByTestId('select-layer-1');
    fireEvent.click(selectBtn);
    
    const deleteBtn = screen.getByTestId('delete-layer-1');
    fireEvent.click(deleteBtn);
    
    expect(mockRemoveClipFromTrack).toHaveBeenCalledWith(expect.any(String), 'layer-1');
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
    
    const exportBtn = screen.getByText('Render on Server');
    fireEvent.click(exportBtn);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/vfx/render', expect.objectContaining({
      method: 'POST'
    }));
    
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});
