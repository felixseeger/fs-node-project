/**
 * Billing Routes
 */
import { Router } from 'express';
import * as billingController from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/billing
 * @desc    Get billing information
 * @access  Private
 */
router.get('/', billingController.getBillingInfo);

/**
 * @route   GET /api/billing/usage
 * @desc    Get usage records
 * @access  Private
 */
router.get('/usage', billingController.getUsageRecords);

/**
 * @route   POST /api/billing/usage
 * @desc    Record AI generation usage
 * @access  Private
 */
router.post('/usage', billingController.recordUsage);

/**
 * @route   GET /api/billing/invoices
 * @desc    Get invoice history
 * @access  Private
 */
router.get('/invoices', billingController.getInvoices);

/**
 * @route   POST /api/billing/checkout
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router.post('/checkout', billingController.createCheckoutSession);

/**
 * @route   POST /api/billing/portal
 * @desc    Create billing portal session
 * @access  Private
 */
router.post('/portal', billingController.createBillingPortalSession);

/**
 * @route   POST /api/billing/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', billingController.cancelSubscription);

export default router;
