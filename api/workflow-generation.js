/**
 * AI Workflow Generation Endpoint
 * 
 * Features:
 * - Prompt-to-workflow conversion
 * - Provider-aware workflow embedding
 * - Workflow preview generation
 * - Multi-provider support
 */

const express = require('express');
const router = express.Router();
const { generateWorkflowFromPrompt } = require('../utils/workflowAI');
const { validateWorkflow } = require('../utils/workflowValidation');

/**
 * Generate workflow from text prompt
 * POST /api/generate-workflow
 */
router.post('/generate-workflow', async (req, res) => {
  try {
    const { prompt, providerPreferences, constraints } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required for workflow generation' 
      });
    }

    // Generate workflow using AI
    const workflow = await generateWorkflowFromPrompt({
      prompt,
      providerPreferences: providerPreferences || [],
      constraints: constraints || {},
    });

    // Validate generated workflow
    const validationResult = validateWorkflow(workflow);
    if (!validationResult.valid) {
      return res.status(400).json({ 
        error: 'Generated workflow validation failed',
        details: validationResult.errors
      });
    }

    res.json({
      success: true,
      workflow,
      validation: validationResult,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Workflow generation error:', error);
    res.status(500).json({ 
      error: 'Workflow generation failed',
      details: error.message
    });
  }
});

/**
 * Get workflow generation status
 * GET /api/workflow-status/:workflowId
 */
router.get('/workflow-status/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    // In a real implementation, this would check a job queue
    // For now, return a mock response
    res.json({
      workflowId,
      status: 'completed',
      progress: 100,
      nodesGenerated: 5,
      edgesGenerated: 4,
      providersUsed: ['freepik', 'anthropic'],
    });

  } catch (error) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

/**
 * Preview workflow generation
 * POST /api/preview-workflow
 */
router.post('/preview-workflow', async (req, res) => {
  try {
    const { prompt, maxNodes = 3 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate a preview with limited nodes
    const preview = await generateWorkflowFromPrompt({
      prompt,
      previewMode: true,
      maxNodes,
    });

    res.json({
      preview,
      nodeCount: preview.nodes.length,
      edgeCount: preview.edges.length,
      isComplete: false,
    });

  } catch (error) {
    res.status(500).json({ error: 'Preview generation failed' });
  }
});

/**
 * Get available workflow templates
 * GET /api/workflow-templates
 */
router.get('/workflow-templates', async (req, res) => {
  try {
    // Return available workflow templates
    const templates = [
      {
        id: 'image-generation',
        name: 'Image Generation Pipeline',
        description: 'Generate and enhance images using multiple providers',
        categories: ['image', 'generation'],
      },
      {
        id: 'video-production',
        name: 'Video Production Workflow',
        description: 'Complete video creation from script to final render',
        categories: ['video', 'production'],
      },
      {
        id: 'audio-processing',
        name: 'Audio Processing Chain',
        description: 'Multi-stage audio enhancement and effects',
        categories: ['audio', 'processing'],
      },
    ];

    res.json({ templates, count: templates.length });

  } catch (error) {
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

module.exports = router;
