/**
 * Workflow Embedding Routes
 * Handles embedding workflow metadata into outputs with provider references
 */

import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * POST /api/embed-workflow
 * Embed workflow metadata into an output object with provider references only
 * 
 * Request body:
 * {
 *   output: Object - The output object to embed workflow into
 *   workflow: Object - The workflow to embed { nodes: [], edges: [] }
 *   providers: Array - Array of provider IDs used in the workflow
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   embeddedOutput: Object - Output with embedded workflow metadata
 *   providers: Array - Array of provider IDs
 *   timestamp: string - ISO timestamp
 * }
 */
router.post('/embed-workflow', generationLimiter, async (req, res) => {
  try {
    const { output, workflow, providers } = req.body;

    // Validate required inputs
    if (!workflow || !workflow.nodes || !workflow.edges || !providers || !Array.isArray(providers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid workflow structure or providers'
      });
    }

    // Validate nodes and edges are arrays
    if (!Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
      return res.status(400).json({
        success: false,
        error: 'Workflow nodes and edges must be arrays'
      });
    }

    // Validate provider references (should not contain API keys or sensitive data)
    const invalidProviderRefs = providers.filter(provider => 
      typeof provider !== 'string' || 
      provider.includes('api') || provider.includes('key') || provider.includes('secret')
    );
    
    if (invalidProviderRefs.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Provider references must be simple IDs without sensitive data'
      });
    }

    // Embed workflow using the utility function
    const embeddedOutput = {
      ...output,
      nodeBananaWorkflow: {
        version: "1.0",
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        providers: providers || [],
        timestamp: new Date().toISOString(),
        metadata: {
          generatedBy: "Node Banana Architecture",
          providerReferencesOnly: true,
          embeddingVersion: "1.0"
        }
      }
    };

    res.json({
      success: true,
      embeddedOutput,
      providers: providers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[WorkflowEmbedding] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to embed workflow',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/extract-workflow
 * Extract workflow metadata from an embedded output
 * 
 * Query params:
 * - output: JSON string of the output object
 * 
 * Response:
 * {
 *   success: boolean
 *   workflow: Object|null - Extracted workflow or null
 *   providers: Array - Array of provider IDs
 *   timestamp: string|null - Original timestamp
 * }
 */
router.get('/extract-workflow', async (req, res) => {
  try {
    const { output } = req.query;

    if (!output) {
      return res.status(400).json({
        success: false,
        error: 'Output parameter is required'
      });
    }

    let outputObj;
    try {
      outputObj = JSON.parse(output);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON in output parameter'
      });
    }

    // Check if workflow is embedded
    if (!outputObj.nodeBananaWorkflow) {
      return res.json({
        success: true,
        workflow: null,
        providers: [],
        timestamp: null
      });
    }

    const embedded = outputObj.nodeBananaWorkflow;

    // Validate the embedded workflow structure
    if (!embedded.nodes || !Array.isArray(embedded.nodes) ||
        !embedded.edges || !Array.isArray(embedded.edges) ||
        !embedded.providers || !Array.isArray(embedded.providers)) {
      console.warn("[WorkflowEmbedding] Invalid embedded workflow structure");
      return res.status(400).json({
        success: false,
        error: 'Invalid embedded workflow structure'
      });
    }

    res.json({
      success: true,
      workflow: {
        nodes: embedded.nodes,
        edges: embedded.edges,
        providers: embedded.providers,
        timestamp: embedded.timestamp,
        metadata: embedded.metadata
      },
      providers: embedded.providers,
      timestamp: embedded.timestamp
    });

  } catch (error) {
    console.error('[WorkflowEmbedding] Extraction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract workflow'
    });
  }
});

export default router;