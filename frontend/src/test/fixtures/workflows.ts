import { type WorkflowImportData } from '../../types';

export const validWorkflows = {
  simple: {
    name: 'Simple Workflow',
    nodes: [
      {
        id: 'node-1',
        type: 'textNode',
        position: { x: 100, y: 100 },
        data: {
          id: 'node-1',
          label: 'Start Node',
          status: 'idle',
        }
      },
      {
        id: 'node-2',
        type: 'generator',
        position: { x: 300, y: 100 },
        data: {
          id: 'node-2',
          label: 'Generator',
          prompt: 'A cute cat',
          status: 'idle',
        }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'output-text',
        targetHandle: 'input-prompt'
      }
    ]
  },
  complex: {
    name: 'Complex Branching Workflow',
    description: 'A more complex test workflow with branches and conditionals',
    nodes: [
      { id: '1', type: 'imageInput', position: { x: 0, y: 0 }, data: { id: '1', label: 'Image Source' } },
      { id: '2', type: 'imageAnalyzer', position: { x: 200, y: 0 }, data: { id: '2', label: 'Analyzer', model: 'claude-sonnet-vision' } },
      { id: '3', type: 'router', position: { x: 400, y: 0 }, data: { id: '3', label: 'Router', routes: [] } },
      { id: '4', type: 'generator', position: { x: 600, y: -100 }, data: { id: '4', label: 'Generator A', prompt: '' } },
      { id: '5', type: 'generator', position: { x: 600, y: 100 }, data: { id: '5', label: 'Generator B', prompt: '' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'route-0' },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'route-1' },
    ]
  }
};

export const invalidWorkflows = {
  missingNodes: {
    name: 'Broken Workflow',
    // nodes is missing
    edges: []
  },
  invalidEdges: {
    name: 'Broken Edges',
    nodes: [],
    edges: [
      { id: 'e1', target: '2' } // missing source
    ]
  },
  invalidNodePositions: {
    name: 'Broken Positions',
    nodes: [
      {
        id: '1',
        type: 'textNode',
        position: { x: '100', y: '100' }, // Strings instead of numbers
        data: { id: '1', label: 'Node' }
      }
    ],
    edges: []
  },
  empty: {}
};
