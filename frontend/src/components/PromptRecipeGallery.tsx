import { useState } from 'react';
import { useReactFlow, type Node, type Edge } from '@xyflow/react';
import { nextId } from '../app/nextId';
import { PROMPT_RECIPES, type PromptRecipe } from '../data/promptRecipes';

interface PromptRecipeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptRecipeGallery({ isOpen, onClose }: PromptRecipeGalleryProps) {
  const { screenToFlowPosition, setNodes, setEdges } = useReactFlow();
  const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRecipe = async (recipe: PromptRecipe) => {
    try {
      setLoadingRecipeId(recipe.id);
      
      // Simulate a loading process to give visual feedback
      await new Promise(resolve => setTimeout(resolve, 600));

      // Get the center of the canvas viewport
      const center = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const idMap = new Map<number, string>();

      recipe.nodes.forEach((n, idx) => {
        const id = nextId();
        idMap.set(idx, id);
        newNodes.push({
          id,
          type: n.type,
          position: {
            x: center.x + n.position.x - 300, // Offset to roughly center the group
            y: center.y + n.position.y - 100
          },
          data: { ...n.data, selected: true } // auto-select the new nodes
        });
      });

      recipe.edges.forEach((e) => {
        const sourceId = idMap.get(e.sourceIndex);
        const targetId = idMap.get(e.targetIndex);
        if (sourceId && targetId) {
          newEdges.push({
            id: `e-${sourceId}-${e.sourceHandle}-${targetId}-${e.targetHandle}`,
            source: sourceId,
            sourceHandle: e.sourceHandle,
            target: targetId,
            targetHandle: e.targetHandle,
            style: { strokeWidth: 2, stroke: e.color || '#888' },
            type: 'default'
          });
        }
      });

      // Deselect existing nodes
      setNodes((nds) => [
        ...nds.map(n => ({ ...n, selected: false })),
        ...newNodes
      ]);
      setEdges((eds) => [...eds, ...newEdges]);
      
      onClose();
    } catch (error) {
      console.error('Failed to add recipe:', error);
    } finally {
      setLoadingRecipeId(null);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div className="modal-surface" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="modal-title" style={{ margin: 0 }}>Prompt Recipe Gallery</h3>
          <button 
            onClick={onClose} 
            disabled={loadingRecipeId !== null}
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: loadingRecipeId ? 'not-allowed' : 'pointer', fontSize: '20px' }}
          >
            &times;
          </button>
        </div>

        <p style={{ color: '#a3a3a3', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
          Kickstart your workflow with curated AI pipeline templates. Select a recipe below to instantly add the configured nodes to your canvas.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          {PROMPT_RECIPES.map((recipe) => (
            <div 
              key={recipe.id} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                cursor: loadingRecipeId ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (loadingRecipeId) return;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (loadingRecipeId) return;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onClick={() => {
                if (!loadingRecipeId) {
                  handleAddRecipe(recipe);
                }
              }}
            >
              {loadingRecipeId === recipe.id && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}
              <h4 style={{ margin: '0 0 8px 0', color: '#e0e0e0', fontSize: '16px', fontWeight: 600 }}>{recipe.title}</h4>
              <p style={{ margin: 0, color: '#888', fontSize: '13px', lineHeight: '1.5' }}>{recipe.description}</p>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {recipe.nodes.map((n, i) => (
                  <span key={i} style={{ 
                    fontSize: '11px', 
                    padding: '4px 8px', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '4px',
                    color: '#a3a3a3',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {n.data.label || n.type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
