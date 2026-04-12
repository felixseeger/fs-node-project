import React, { useState, useMemo } from 'react';
import { Asset, AssetMediaType } from '../types/asset';
import { GenerationLineageViewer } from './GenerationLineageViewer';
import { HighBitratePreviewer } from './HighBitratePreviewer';

export function GlobalAssetVault() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [lineageAsset, setLineageAsset] = useState<Asset | null>(null);

  // Mock data for vault demonstrating advanced capabilities
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Cyberpunk Cityscape 4K',
      userId: 'user1',
      images: ['https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80'],
      status: 'ready',
      tags: ['cyberpunk', 'city', 'neon', '4k'],
      category: 'Images',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        prompt: 'A futuristic cyberpunk cityscape at night, neon lights, rain-slicked streets, hyper-detailed, 8k resolution',
        model: 'Midjourney v6',
        nodeConfig: { seed: 42, cfg_scale: 7.5, steps: 30 }
      }
    },
    {
      id: '2',
      name: 'Sci-fi Engine Loop',
      userId: 'user1',
      images: [],
      mediaItems: [
        { 
          id: 'm1', 
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
          type: 'video', 
          filename: 'engine.mp4', 
          mimeType: 'video/mp4', 
          thumbnail: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&q=80',
          createdAt: new Date().toISOString() 
        }
      ],
      status: 'ready',
      tags: ['video', 'scifi', 'engine'],
      category: 'Videos',
      isDeleted: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        prompt: 'A glowing sci-fi spaceship engine core rotating slowly, high bitrate, 4k 60fps',
        model: 'Runway Gen-2',
        nodeConfig: { motion_score: 5, upscale: true }
      }
    },
    {
      id: '3',
      name: 'Cinematic Portrait',
      userId: 'user1',
      images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'],
      status: 'ready',
      tags: ['portrait', 'cinematic', 'lighting'],
      category: 'Images',
      isDeleted: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        prompt: 'Cinematic portrait of a woman, dramatic rim lighting, 85mm lens, f/1.8',
        model: 'DALL-E 3',
        nodeConfig: { style: 'vivid', quality: 'hd' }
      }
    }
  ]);

  // Derived state
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    assets.forEach(a => a.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                            a.metadata?.prompt?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            a.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => a.tags?.includes(t));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [assets, search, activeCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200 overflow-hidden font-sans">
      {/* Sidebar Workspace */}
      <div className="w-72 border-r border-gray-800 bg-[#111] flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Asset Vault
          </h2>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Workspace</h3>
            {['All', 'Images', 'Videos', 'Audio', 'Documents'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                {cat === 'Images' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {cat === 'Videos' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                {cat === 'Audio' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
                {cat === 'Documents' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                {cat === 'All' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-1 mb-8">
            <div className="flex items-center justify-between px-2 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folders</h3>
              <button className="text-gray-500 hover:text-white transition-colors" title="New Folder">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {['Project Alpha', 'Upscales', 'Drafts'].map(folder => (
              <button
                key={folder}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 border border-transparent"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                {folder}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Multi-Select Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                    selectedTags.includes(tag) 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        <div className="h-20 px-8 border-b border-gray-800 flex items-center justify-between bg-[#111]/80 backdrop-blur-md sticky top-0 z-10">
           <div className="relative w-[400px]">
             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </span>
             <input
               type="text"
               placeholder="Search by name, prompt, or tags..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-gray-200 placeholder-gray-500 transition-all"
             />
           </div>
           
           <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500">{filteredAssets.length} assets</span>
             <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               Upload Media
             </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredAssets.map(asset => {
              const isVideo = asset.category === 'Videos' || asset.mediaItems?.[0]?.type === 'video';
              const previewUrl = asset.images?.[0] || asset.mediaItems?.[0]?.thumbnail;

              return (
                <div key={asset.id} className="group relative bg-[#151515] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                     {previewUrl ? (
                        <img src={previewUrl} alt={asset.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     ) : isVideo ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                     ) : null}
                     
                     {/* Media Type Badge */}
                     <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white tracking-wider uppercase border border-white/10">
                        {isVideo ? 'Video' : 'Image'}
                     </div>
                     
                     {/* Overlay Actions */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {isVideo && (
                          <button 
                            onClick={() => setViewingAsset(asset)}
                            className="p-3 bg-blue-600/90 backdrop-blur-sm rounded-full hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                            title="High Bitrate Preview"
                          >
                            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                          </button>
                        )}
                        <button 
                          onClick={() => setLineageAsset(asset)}
                          className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-gray-700 text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                          title="Generation Lineage"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                     </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between bg-[#151515]">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-100 truncate mb-1" title={asset.name}>{asset.name}</h4>
                      <p className="text-[11px] text-gray-500 font-mono truncate">{new Date(asset.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1.5 mt-3 overflow-hidden flex-wrap">
                      {asset.tags?.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-md truncate max-w-[80px] font-medium">#{t}</span>
                      ))}
                      {asset.tags && asset.tags.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-gray-500 font-medium">+{asset.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredAssets.length === 0 && (
               <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-500 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800">
                  <div className="w-20 h-20 mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.902.593l-1.586 3.172a1 1 0 01-.894.553H8.962a1 1 0 01-.894-.553l-1.586-3.172A1 1 0 005.586 13H3" /></svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No assets found</h3>
                  <p className="text-sm">Try adjusting your search or filter criteria.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewingAsset && (viewingAsset.mediaItems?.[0]?.url || viewingAsset.images?.[0]) && (
        <HighBitratePreviewer 
          url={viewingAsset.mediaItems?.[0]?.url || viewingAsset.images[0]} 
          onClose={() => setViewingAsset(null)} 
        />
      )}

      {lineageAsset && (
        <GenerationLineageViewer 
          asset={lineageAsset} 
          onClose={() => setLineageAsset(null)} 
        />
      )}
    </div>
  );
}
