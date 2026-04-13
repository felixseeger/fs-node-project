import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { RemotionLayer } from '../types/remotion';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainComposition"
        component={VideoComposition as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          layers: [] as RemotionLayer[],
        }}
      />
    </>
  );
};
