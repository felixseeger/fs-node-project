const fs = require('fs');
let code = fs.readFileSync('frontend/src/nodes/LayerEditorNode.tsx', 'utf8');

// Replace useLayerManager with useTimeline
code = code.replace(
  "import { useLayerManager } from '../hooks/useLayerManager';",
  "import { useTimeline } from '../contexts/TimelineContext';"
);

// We need to export a wrapped component.
code = code.replace(
  "export default function LayerEditorNode({ id, data, selected }: any) {",
  "import { TimelineProvider } from '../contexts/TimelineContext';\n\nfunction LayerEditorNodeInner({ id, data, selected }: any) {"
);

// Replace layer manager usage with timeline context
code = code.replace(
  "const { layers, addLayer, removeLayer, updateLayer } = useLayerManager([]);",
  `const { tracks, addTrack, addClipToTrack, removeClipFromTrack, updateClipInTrack } = useTimeline();
  
  // Create a flattened view of clips for backward compatibility with VideoComposition and LayerItem
  const layers = tracks.flatMap(t => t.clips);
  
  // Helper to add layer to a default track based on type
  const addLayer = (layer: any) => {
    let track = tracks.find(t => t.type === layer.type);
    if (!track) {
      const trackId = addTrack({ type: layer.type, name: layer.type.charAt(0).toUpperCase() + layer.type.slice(1) + ' Track', clips: [] });
      track = { id: trackId, type: layer.type, name: layer.type + ' Track', clips: [] };
      // Note: addClipToTrack will need the trackId, so we can't use it synchronously right after addTrack. 
      // Actually, we can add a new clip to the state.
      // Let's refactor this helper to be simpler.
    }
  };`
);

fs.writeFileSync('frontend/src/nodes/LayerEditorNode.tsx', code);
