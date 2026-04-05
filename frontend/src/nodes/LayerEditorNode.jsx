import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const InfoIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const ChevronDownIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const MagicIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18.8 3.3a3.5 3.5 0 0 0-5 0l-9 9a3.5 3.5 0 0 0 0 5l5 5a3.5 3.5 0 0 0 5 0l9-9a3.5 3.5 0 0 0 0-5z"></path>
    <path d="m2 22 5.5-1.5L9 22"></path>
    <path d="m15 2.5 3 3"></path>
  </svg>
);

const LinkIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
  </svg>
);

function LayerEditorMenu({ width, height, isLinked, onClose, onDisconnect }) {
  const styles = {
    panelContainer: {
      position: 'absolute',
      top: '64px',
      right: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#E0E0E0',
      width: '260px',
      zIndex: 1000,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    sectionHeader: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #3a3a3a',
    },
    sectionBody: {
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      padding: '12px 14px',
      border: '1px solid #3a3a3a',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderedRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #333333',
      paddingTop: '10px',
      marginTop: '10px',
    },
    titleText: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#E0E0E0',
    },
    labelText: {
      fontSize: '11px',
      color: '#999',
    },
    valueText: {
      fontSize: '12px',
      color: '#E0E0E0',
    },
    iconGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    hash: {
      color: '#999',
      marginRight: '6px',
      fontSize: '12px',
      fontWeight: '600',
    },
    leftTitleGroup: {
        display: 'flex',
        alignItems: 'center',
    }
  };

  return (
    <div style={styles.panelContainer}>
      <div style={styles.wrapper}>
        {/* Header Section */}
        <div style={styles.sectionHeader}>
          <span style={styles.titleText}>Layer Editor</span>
          <InfoIcon style={{ color: '#999' }} />
        </div>

        {/* Frame Section */}
        <div style={styles.sectionBody}>
          {/* Row 1: Title */}
          <div style={styles.row}>
            <div style={styles.leftTitleGroup}>
              <span style={styles.hash}>#</span>
              <span style={styles.titleText}>Frame</span>
            </div>
            <ChevronDownIcon style={{ color: '#999' }} />
          </div>

          {/* Row 2: Aspect Ratio */}
          <div style={styles.borderedRow}>
            <span style={styles.valueText}>1:1</span>
            <div style={styles.iconGroup}>
              <ChevronDownIcon style={{ color: '#999' }}/>
              <MagicIcon style={{ color: '#999' }}/>
            </div>
          </div>

          {/* Row 3: Dimensions */}
          <div style={styles.borderedRow}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={styles.labelText}>W</span>
              <span style={styles.valueText}>{width}</span>
            </div>
            <LinkIcon style={{ color: isLinked ? '#E0E0E0' : '#666' }} />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={styles.labelText}>H</span>
              <span style={styles.valueText}>{height}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LayerEditorNode({ id, data, selected }) {
  const { resolve, disconnectNode, update } = useNodeConnections(id, data);
  const [dimensions, setDimensions] = useState({ width: 1024, height: 1024 });

  const bgImage = resolve.image('image-in')?.[0];

  useEffect(() => {
    // Pass the input image directly to the output handle so downstream nodes can use it
    if (bgImage !== data.outputImage) {
      update({ outputImage: bgImage });
    }
  }, [bgImage, data.outputImage, update]);

  return (
    <>
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={100}
        keepAspectRatio={true}
        onResize={(e, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
      />
      <div style={{ 
        width: dimensions.width, 
        height: dimensions.height, 
        minWidth: 256,
        minHeight: 256,
        backgroundColor: '#0a0a0a', 
        border: `2px solid ${selected ? '#3b82f6' : '#333'}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
         
        position: 'relative'
      }}>
        <Handle type="target" position={Position.Left} id="image-in" style={{ width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -8, zIndex: 10 }} />
        <Handle type="source" position={Position.Right} id="image-out" style={{ width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', right: -8, zIndex: 10 }} />
        
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, pointerEvents: 'none', zIndex: 5 }}>
          Image In
        </div>
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 600, pointerEvents: 'none', zIndex: 5 }}>
          Image Out
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: bgImage ? 0 : 0.1,
          backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
        {bgImage && (
          <img src={bgImage} alt="Canvas Background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 0 }} />
        )}
        <span style={{ color: '#555', fontSize: 14, fontWeight: 500, zIndex: 1, textShadow: bgImage ? '0 1px 4px rgba(0,0,0,0.8)' : 'none' }}>
          {bgImage ? '' : `Canvas ${dimensions.width}x${dimensions.height}`}
        </span>
      </div>

      {selected && createPortal(
        <LayerEditorMenu width={dimensions.width} height={dimensions.height} isLinked={true} onDisconnect={disconnectNode} />,
        document.body
      )}
    </>
  );
}
