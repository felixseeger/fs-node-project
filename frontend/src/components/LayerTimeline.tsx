import React from 'react';

export interface TimelineLayer {
  id: string;
  name: string;
  from: number;
  durationInFrames: number;
  color?: string;
}

interface LayerTimelineProps {
  layers: TimelineLayer[];
  durationInFrames: number;
  currentFrame: number;
  onSeek?: (frame: number) => void;
}

export const LayerTimeline: React.FC<LayerTimelineProps> = ({
  layers,
  durationInFrames,
  currentFrame,
  onSeek,
}) => {
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const frame = Math.round(percentage * durationInFrames);
    onSeek(frame);
  };

  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] rounded-md border border-[#333] p-2 gap-2">
      {/* Scrubber Area */}
      <div 
        className="relative h-6 bg-[#222] rounded cursor-pointer overflow-hidden"
        onClick={handleTimelineClick}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
          style={{ left: `${(currentFrame / durationInFrames) * 100}%` }}
        >
          <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
        
        {/* Frame markers (optional, simple representation) */}
        <div className="absolute bottom-0 w-full flex justify-between px-1 text-[8px] text-gray-500">
          <span>0</span>
          <span>{durationInFrames}</span>
        </div>
      </div>

      {/* Layers */}
      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
        {layers.map((layer) => {
          const left = (layer.from / durationInFrames) * 100;
          const width = (layer.durationInFrames / durationInFrames) * 100;
          
          return (
            <div key={layer.id} className="relative h-6 bg-[#222] rounded flex items-center px-2">
              <span className="text-xs text-gray-400 w-20 truncate z-10">{layer.name}</span>
              <div className="absolute left-24 right-2 h-full py-1">
                <div 
                  className="h-full rounded opacity-80"
                  style={{ 
                    marginLeft: `${left}%`, 
                    width: `${width}%`,
                    backgroundColor: layer.color || '#3b82f6'
                  }}
                />
              </div>
            </div>
          );
        })}
        {layers.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-2">No layers</div>
        )}
      </div>
    </div>
  );
};
