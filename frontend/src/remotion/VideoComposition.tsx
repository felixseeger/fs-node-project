import React from 'react';
import { AbsoluteFill, Sequence, Img, OffthreadVideo, Html5Audio } from 'remotion';
import { RemotionLayer } from '../types/remotion';

interface VideoCompositionProps {
  layers: RemotionLayer[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ layers }) => {
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {sortedLayers.map((layer) => (
        <Sequence
          key={layer.id}
          from={layer.from}
          durationInFrames={layer.durationInFrames}
        >
          <AbsoluteFill style={{ zIndex: layer.zIndex, ...layer.style }}>
            {layer.type === 'image' && (
              <Img 
                src={layer.src} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            )}
            {layer.type === 'video' && (
              <OffthreadVideo 
                src={layer.src} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            )}
            {layer.type === 'audio' && (
              <Html5Audio src={layer.src} />
            )}
            {layer.type === 'text' && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%', 
                height: '100%', 
                color: 'white', 
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                {layer.src}
              </div>
            )}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
