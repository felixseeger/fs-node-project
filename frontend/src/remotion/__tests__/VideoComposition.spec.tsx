import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoComposition } from '../VideoComposition';

// Mock Remotion components since they might require a specific context
vi.mock('remotion', () => ({
  AbsoluteFill: ({ children, style }: any) => <div data-testid="absolute-fill" style={style}>{children}</div>,
  Sequence: ({ children, from, durationInFrames }: any) => (
    <div data-testid="sequence" data-from={from} data-duration={durationInFrames}>
      {children}
    </div>
  ),
  Img: ({ src, style }: any) => <img data-testid="remotion-img" src={src} style={style} alt="" />,
  OffthreadVideo: ({ src, style }: any) => <video data-testid="remotion-video" src={src} style={style} />,
  Html5Audio: ({ src }: any) => <audio data-testid="remotion-audio" src={src} />,
}));

describe('VideoComposition', () => {
  it('should mount without crashing when given an empty array of layers', () => {
    const { container } = render(<VideoComposition layers={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('should render layers correctly based on their type', () => {
    const mockLayers = [
      { id: 'layer1', type: 'image', src: 'image.png', from: 0, durationInFrames: 100, zIndex: 1 },
      { id: 'layer2', type: 'text', src: 'Hello World', from: 50, durationInFrames: 50, zIndex: 2 },
      { id: 'layer3', type: 'video', src: 'video.mp4', from: 100, durationInFrames: 200, zIndex: 3 },
      { id: 'layer4', type: 'audio', src: 'audio.mp3', from: 0, durationInFrames: 300, zIndex: 4 },
    ];

    const { getAllByTestId, getByText } = render(<VideoComposition layers={mockLayers as any} />);

    // Check if sequences are rendered
    const sequences = getAllByTestId('sequence');
    expect(sequences).toHaveLength(4);

    // Check if specific layer types are rendered
    expect(getAllByTestId('remotion-img')).toHaveLength(1);
    expect(getAllByTestId('remotion-video')).toHaveLength(1);
    expect(getAllByTestId('remotion-audio')).toHaveLength(1);
    
    // Check if text is rendered
    expect(getByText('Hello World')).toBeInTheDocument();
  });

  it('should sort layers by zIndex', () => {
    const mockLayers = [
      { id: 'layer2', type: 'text', src: 'Top', from: 0, durationInFrames: 100, zIndex: 10 },
      { id: 'layer1', type: 'text', src: 'Bottom', from: 0, durationInFrames: 100, zIndex: 1 },
    ];

    const { getAllByTestId } = render(<VideoComposition layers={mockLayers as any} />);
    
    // The sequences should be rendered in order of zIndex (lowest first)
    const sequences = getAllByTestId('sequence');
    expect(sequences[0].textContent).toBe('Bottom');
    expect(sequences[1].textContent).toBe('Top');
  });
});
