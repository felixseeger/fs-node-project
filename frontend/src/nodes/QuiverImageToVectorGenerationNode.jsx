import { useCallback, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import {
  SectionHeader,
  OutputHandle,
  OutputPreview
} from './shared';
import ImageUploadBox from './ImageUploadBox';
import useNodeConnections from './useNodeConnections';
import { quiverImageToSvg } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS } from './nodeTokens';
import { addToHistory } from '../services/historyService';

async function urlToBase64(url) {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Failed to convert URL to base64:', err);
    return null;
  }
}

export default function QuiverImageToVectorGenerationNode({ id, data, selected }) {
  const update = useCallback((patch) => {
    data.onUpdate?.(id, patch);
  }, [id, data]);

  const { hasConnection, getConnInfo } = useNodeConnections(id, data);


  const hasImageConnection = hasConnection('image-in');
  const imageConnection = getConnInfo('image-in');

  const handleGenerate = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];

    if (!images?.length) return;

    // Validate input is a raster image, not SVG
    const inputUrl = images[0];
    if (inputUrl.startsWith('data:image/svg')) {
      update({ 
        outputImage: null, 
        isLoading: false, 
        outputError: 'Input cannot be an SVG. Please connect a raster image (PNG/JPEG) or upload an image file.' 
      });
      return;
    }

    update({ outputImage: null, isLoading: true, outputError: null });

    try {
      const base64Image = await urlToBase64(images[0]);
      if (!base64Image) throw new Error('Failed to load image for vectorization');
        
      const compressedImage = await compressImageBase64(base64Image);
      const base64Data = compressedImage.includes(',') ? compressedImage.split(',')[1] : compressedImage;

      const params = {
        model: 'arrow-preview', // currently the only model documented
        stream: false,
        image: {
          base64: base64Data
        }
      };

      const result = await quiverImageToSvg(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const generatedData = result.data?.data?.[0];
      if (generatedData?.svg) {
        const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(generatedData.svg)}`;
        update({
          outputImage: svgDataUri,
          isLoading: false,
          outputError: null,
        });
        // Register in history
        await addToHistory({
          type: 'svg',
          url: svgDataUri,
          prompt: 'Image to Vector conversion',
          nodeType: 'quiverImageToVector',
          nodeLabel: data.label || 'Quiver Image to Vector',
        });
      } else {
        update({ isLoading: false, outputError: 'No SVG returned' });
      }
    } catch (err) {
      console.error('Quiver image to svg error:', err);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const primaryColor = CATEGORY_COLORS.imageGeneration;

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
        border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
      }}>unlink</button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );

  return (
    <NodeShell data={data}
      label={data.label || 'Quiver Image to Vector'}
      dotColor={primaryColor}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={data.isLoading}
      onDisconnect={(h) => data.onUnlink?.(id, h)}
      downloadUrl={data.outputImage}
      downloadType="svg"
    >
      <OutputHandle id="image-out" label="svg out" color={primaryColor} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Handle type="target" position={Position.Left}
            id="image-in" style={{
              width: 10, height: 10, borderRadius: '50%', background: getHandleColor('image-in'), border: 'none',
              position: 'relative', left: -12, transform: 'none',
            }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Input Image (Required)</span>
        </div>
        {hasImageConnection && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{linkedBadges('image-in')}</div>}
      </div>

      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <div className="nodrag nopan" onMouseDown={(e) => e.stopPropagation()}>
          <ImageUploadBox
            image={data.localImage || data.inputImagePreview || null}
            onImageChange={(img) => update({ localImage: img })}
            placeholder="Click or drop image here"
            minHeight={80}
          />
        </div>
      )}

      <OutputPreview
        isLoading={data.isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={primaryColor}
        label="Generated SVG"
      />
    </NodeShell>
  );
}
