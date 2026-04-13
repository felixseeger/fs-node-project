import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ReactFlowProvider } from '@xyflow/react';
import LayerEditorNode from './LayerEditorNode';
import React from 'react';

// Mock etro
vi.mock('etro', () => {
  const Movie = vi.fn().mockImplementation(function() {
    this.addLayer = vi.fn();
    this.removeLayer = vi.fn();
    this.refresh = vi.fn();
    this.play = vi.fn();
    this.pause = vi.fn();
    this.stop = vi.fn();
    this.record = vi.fn();
    this.width = 0;
    this.height = 0;
  });

  return {
    default: {
      Movie: Movie,
      layer: {
        Image: vi.fn(),
        Video: vi.fn()
      },
      color: {
        fromHex: vi.fn()
      }
    }
  };
});

// Mock useNodeConnections
vi.mock('./useNodeConnections', () => ({
  default: vi.fn().mockImplementation(() => ({
    resolve: {
      image: vi.fn().mockReturnValue([]),
      video: vi.fn().mockReturnValue([])
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

  it('renders the canvas and placeholder text when no media', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={false} />);
    
    expect(screen.getByText(/Canvas 1024x1024/i)).toBeInTheDocument();
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders the editor menu when selected', () => {
    renderWithReactFlow(<LayerEditorNode id="layer-editor-1" data={{}} selected={true} />);
    
    const titleElements = screen.getAllByText(/Layer Editor/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Playback/i)).toBeInTheDocument();
    // Use a more specific query or check for existence in the list
    const layersHeaders = screen.getAllByText(/Layers/i);
    expect(layersHeaders.length).toBeGreaterThan(0);
  });
});
