/**
 * NodeDownloadButton Component
 * Download button for saving generated outputs
 */

import { useState } from 'react';

/**
 * Download button to save generated image/video/audio/svg
 * @param {Object} props
 * @param {string} props.url - The URL/data URI of the file to download
 * @param {string} props.filename - The filename for the download
 * @param {string} props.size - Button size: 'sm' | 'md' (default: 'md')
 * @param {string} props.type - File type: 'image' | 'video' | 'audio' | 'svg' (default: 'image')
 */
interface NodeDownloadButtonProps {
  url: string;
  filename?: string;
  nodeLabel?: string;
  size?: 'sm' | 'md';
  type?: 'image' | 'video' | 'audio' | 'svg' | string;
}

export default function NodeDownloadButton({ url, filename, nodeLabel, size = 'md', type = 'image' }: NodeDownloadButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!url) return null;

  const dimensions = size === 'sm' ? { width: 22, height: 22, icon: 10 } : { width: 26, height: 26, icon: 12 };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    
    // Determine extension based on type
    let extension = 'png';
    if (type === 'video') extension = 'mp4';
    else if (type === 'audio') extension = 'mp3';
    else if (type === 'svg') extension = 'svg';

    // Generate a meaningful filename if not provided
    const baseName = filename || (nodeLabel 
      ? `${nodeLabel.toLowerCase().replace(/\s+/g, '-')}-${type}` 
      : `generated-${type}`);
    
    link.download = `${baseName}-${Date.now()}.${extension}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      title={`Download ${type}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
        border: `1px solid ${isHovered ? '#3b82f6' : '#444'}`,
        color: isHovered ? '#3b82f6' : '#666',
        cursor: 'pointer',
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all 0.15s ease',
        opacity: isHovered ? 1 : 0.7,
      }}
    >
      {/* Download icon */}
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </button>
  );
}
