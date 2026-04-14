/**
 * Workflow Controller
 * Handles workflow CRUD endpoints
 */
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as workflowService from '../services/workflowService.js';

/**
 * POST /api/workflows
 * Create a new workflow
 */
export const createWorkflow = asyncHandler(async (req, res) => {
  const workflow = await workflowService.createUserWorkflow(req.user.uid, req.body);

  res.status(201).json({
    success: true,
    data: workflow,
  });
});

/**
 * GET /api/workflows
 * List current user's workflows
 */
export const listMyWorkflows = asyncHandler(async (req, res) => {
  const { limit, cursor, orderBy, order } = req.query;
  const result = await workflowService.getUserWorkflows(req.user.uid, {
    limit: parseInt(limit) || 20,
    cursor,
    orderBy: orderBy || 'updatedAt',
    order: order || 'desc',
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/workflows/public
 * List public workflows (discovery)
 */
export const listPublicWorkflows = asyncHandler(async (req, res) => {
  const { limit, cursor, tags } = req.query;
  const result = await workflowService.getPublicWorkflowsList({
    limit: parseInt(limit) || 20,
    cursor,
    tags: tags ? tags.split(',') : [],
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/workflows/:id
 * Get a specific workflow
 */
export const getWorkflow = asyncHandler(async (req, res) => {
  const workflow = await workflowService.getWorkflowWithAccess(
    req.params.id,
    req.user.uid
  );

  res.json({
    success: true,
    data: workflow,
  });
});

/**
 * PUT /api/workflows/:id
 * Update a workflow
 */
export const updateWorkflow = asyncHandler(async (req, res) => {
  const workflow = await workflowService.updateUserWorkflow(
    req.params.id,
    req.user.uid,
    req.body
  );

  res.json({
    success: true,
    data: workflow,
  });
});

/**
 * DELETE /api/workflows/:id
 * Delete a workflow
 */
export const deleteWorkflow = asyncHandler(async (req, res) => {
  await workflowService.deleteUserWorkflow(req.params.id, req.user.uid);

  res.json({
    success: true,
    message: 'Workflow deleted',
  });
});

/**
 * POST /api/workflows/:id/fork
 * Fork a public workflow
 */
export const forkWorkflow = asyncHandler(async (req, res) => {
  const forked = await workflowService.forkUserWorkflow(
    req.params.id,
    req.user.uid
  );

  res.status(201).json({
    success: true,
    data: forked,
  });
});

/**
 * POST /api/workflows/:id/duplicate
 * Duplicate own workflow
 */
export const duplicateWorkflow = asyncHandler(async (req, res) => {
  const duplicate = await workflowService.duplicateWorkflow(
    req.params.id,
    req.user.uid
  );

  res.status(201).json({
    success: true,
    data: duplicate,
  });
});

export default {
  createWorkflow,
  listMyWorkflows,
  listPublicWorkflows,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  forkWorkflow,
  duplicateWorkflow,
};
