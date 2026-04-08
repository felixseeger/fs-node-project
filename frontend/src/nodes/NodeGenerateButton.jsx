/**
 * NodeGenerateButton Component
 * Hover-activated generate button for AI nodes
 */

import { useState } from 'react';

/**
 * Generate button that appears on hover
 * @param {Object} props
 * @param {Function} props.onGenerate - Function to call when generate is clicked
 * @param {boolean} props.isGenerating - Whether generation is in progress
 * @param {string} props.size - Button size: 'sm' | 'md' (default: 'md')
 */
export default function NodeGenerateButton({ onGenerate, isGenerating, size = 'md' }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!onGenerate) return null;

  const dimensions = size === 'sm' ? { width: 28, height: 28, icon: 14 } : { width: 32, height: 32, icon: 16 };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!isGenerating) {
          onGenerate();
        }
      }}
      title={isGenerating ? 'Generating...' : 'Generate / Regenerate'}
      disabled={isGenerating}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#000',
        border: `1px solid ${isGenerating ? '#3b82f6' : isHovered ? '#555' : '#222'}`,
        color: '#fff',
        boxShadow: isGenerating 
          ? '0 0 10px rgba(59, 130, 246, 0.5)' 
          : isHovered 
            ? '0 0 12px rgba(255, 255, 255, 0.3)' 
            : '0 0 8px rgba(0, 0, 0, 0.5)',
        cursor: isGenerating ? 'not-allowed' : 'pointer',
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all 0.15s ease',
        opacity: isHovered || isGenerating ? 1 : 0.85,
      }}
    >
      {isGenerating ? (
        // Spinner icon
        <svg 
          width={dimensions.icon} 
          height={dimensions.icon} 
          viewBox="0 0 24 24" 
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="31.42 31.42"
            strokeLinecap="round"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      ) : (
        // Play/Refresh icon
        <svg 
          width={dimensions.icon} 
          height={dimensions.icon} 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
