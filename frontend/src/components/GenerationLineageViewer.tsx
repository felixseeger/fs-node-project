import React from 'react';
import { type Asset } from '../types/asset';

export interface GenerationLineageViewerProps {
  asset: Asset;
  onClose: () => void;
}

export function GenerationLineageViewer({ asset, onClose }: GenerationLineageViewerProps) {
  const metadata = asset.metadata || {};
  const prompt = (metadata.prompt as string) || 'Unknown Prompt';
  const model = (metadata.model as string) || 'Unknown Model';
  const nodeConfig = (metadata.nodeConfig as Record<string, any>) || {};

  const previewUrl = asset.images?.[0] || asset.mediaItems?.[0]?.thumbnail;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Generation Lineage</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm text-gray-300">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
             <div className="w-full sm:w-1/3 aspect-square bg-black rounded-lg overflow-hidden border border-gray-800">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Asset preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Preview</div>
                )}
             </div>
             <div className="flex-1 flex flex-col gap-4 w-full">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Asset Details</h3>
                  <p className="text-white text-lg font-medium">{asset.name}</p>
                  <p className="text-gray-400 text-xs">{new Date(asset.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Model Used</h3>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800 text-xs">
                     {model}
                  </div>
                </div>
                {asset.tags && asset.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] uppercase tracking-wide">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Original Prompt</h3>
            <div className="p-4 bg-black border border-gray-800 rounded-lg text-gray-200 whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {prompt}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Node Configuration</h3>
            <div className="p-4 bg-black border border-gray-800 rounded-lg overflow-x-auto">
               <pre className="text-green-400 font-mono text-xs m-0">
                 {JSON.stringify(nodeConfig, null, 2)}
               </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
