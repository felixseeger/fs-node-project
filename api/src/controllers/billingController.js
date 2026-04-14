/**
 * Billing Controller
 * Handles subscription and billing endpoints
 */
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import * as billingService from '../services/billingService.js';

/**
 * GET /api/billing
 * Get billing information for current user
 */
export const getBillingInfo = asyncHandler(async (req, res) => {
  const billing = await billingService.getBillingInfo(req.user.uid);

  res.json({
    success: true,
    data: billing,
  });
});

/**
 * POST /api/billing/checkout
 * Create Stripe checkout session
 */
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { plan, successUrl, cancelUrl } = req.body;

  if (!plan || !successUrl || !cancelUrl) {
    throw new AppError('plan, successUrl, and cancelUrl are required', 400, 'MISSING_PARAMS');
  }

  const session = await billingService.createCheckoutSession(req.user.uid, {
    plan,
    successUrl,
    cancelUrl,
    customerData: {
      email: req.user.email,
      name: req.user.displayName,
    },
  });

  res.json({
    success: true,
    data: session,
  });
});

/**
 * POST /api/billing/portal
 * Create billing portal session for managing subscription
 */
export const createBillingPortalSession = asyncHandler(async (req, res) => {
  const { returnUrl } = req.body;

  if (!returnUrl) {
    throw new AppError('returnUrl is required', 400, 'MISSING_PARAMS');
  }

  const portal = await billingService.createBillingPortalSession(req.user.uid, {
    returnUrl,
  });

  res.json({
    success: true,
    data: portal,
  });
});

/**
 * POST /api/billing/cancel
 * Cancel subscription
 */
export const cancelSubscription = asyncHandler(async (req, res) => {
  await billingService.cancelSubscription(req.user.uid);

  res.json({
    success: true,
    message: 'Subscription cancelled. Access continues until end of billing period.',
  });
});

/**
 * GET /api/billing/usage
 * Get usage records
 */
export const getUsageRecords = asyncHandler(async (req, res) => {
  const { limit, type } = req.query;
  const usage = await billingService.getUsageRecords(req.user.uid, {
    limit: parseInt(limit) || 50,
    type,
  });

  res.json({
    success: true,
    data: usage,
  });
});

/**
 * GET /api/billing/invoices
 * Get invoice history
 */
export const getInvoices = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const invoices = await billingService.getInvoices(req.user.uid, {
    limit: parseInt(limit) || 20,
  });

  res.json({
    success: true,
    data: invoices,
  });
});

/**
 * POST /api/billing/usage
 * Record AI generation usage (internal or manual)
 */
export const recordUsage = asyncHandler(async (req, res) => {
  const { type, creditsUsed = 1 } = req.body;

  if (!type) {
    throw new AppError('type is required', 400, 'MISSING_PARAMS');
  }

  const record = await billingService.recordGenerationUsage(
    req.user.uid,
    type,
    creditsUsed
  );

  res.status(201).json({
    success: true,
    data: record,
  });
});

export default {
  getBillingInfo,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  getUsageRecords,
  getInvoices,
  recordUsage,
};
