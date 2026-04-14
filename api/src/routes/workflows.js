/**
 * Workflow Routes
 */
import { Router } from 'express';
import * as workflowController from '../controllers/workflowController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateWorkflow, validateWorkflowId, validatePagination } from '../middleware/validation.js';

const router = Router();

/**
 * @route   GET /api/workflows/public
 * @desc    List public workflows (discovery)
 * @access  Public
 */
router.get('/public', optionalAuth, validatePagination, workflowController.listPublicWorkflows);

// All routes below require authentication
router.use(authenticate);

/**
 * @route   POST /api/workflows
 * @desc    Create a new workflow
 * @access  Private
 */
router.post('/', validateWorkflow, workflowController.createWorkflow);

/**
 * @route   GET /api/workflows
 * @desc    List current user's workflows
 * @access  Private
 */
router.get('/', validatePagination, workflowController.listMyWorkflows);

/**
 * @route   GET /api/workflows/:id
 * @desc    Get a specific workflow
 * @access  Private
 */
router.get('/:id', validateWorkflowId, workflowController.getWorkflow);

/**
 * @route   PUT /api/workflows/:id
 * @desc    Update a workflow
 * @access  Private
 */
router.put('/:id', validateWorkflowId, validateWorkflow, workflowController.updateWorkflow);

/**
 * @route   DELETE /api/workflows/:id
 * @desc    Delete a workflow
 * @access  Private
 */
router.delete('/:id', validateWorkflowId, workflowController.deleteWorkflow);

/**
 * @route   POST /api/workflows/:id/fork
 * @desc    Fork a public workflow
 * @access  Private
 */
router.post('/:id/fork', validateWorkflowId, workflowController.forkWorkflow);

/**
 * @route   POST /api/workflows/:id/duplicate
 * @desc    Duplicate own workflow
 * @access  Private
 */
router.post('/:id/duplicate', validateWorkflowId, workflowController.duplicateWorkflow);

export default router;
