import { useReactFlow, Node, Edge } from '@xyflow/react';
import { nextId } from '../app/nextId';
import { PROMPT_RECIPES, PromptRecipe } from '../data/promptRecipes';

interface PromptRecipeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptRecipeGallery({ isOpen, onClose }: PromptRecipeGalleryProps) {
  const { screenToFlowPosition, setNodes, setEdges } = useReactFlow();

  if (!isOpen) return null;

  const handleAddRecipe = (recipe: PromptRecipe) => {
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
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div className="modal-surface" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="modal-title" style={{ margin: 0 }}>Prompt Recipe Gallery</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onClick={() => handleAddRecipe(recipe)}
            >
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
