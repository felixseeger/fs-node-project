/**
 * Webhook Routes
 * Handles Stripe webhooks for subscription events
 */
import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as billingService from '../services/billingService.js';

const router = Router();

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 * Note: This route does NOT require authentication
 * Stripe sends webhooks without user tokens
 */
router.post('/stripe', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    event = billingService.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await billingService.handleSubscriptionUpdated(event);
      break;

    case 'customer.subscription.updated':
      await billingService.handleSubscriptionUpdated(event);
      break;

    case 'customer.subscription.deleted':
      await billingService.handleSubscriptionCancelled(event);
      break;

    case 'customer.subscription.paused':
      await billingService.handleSubscriptionCancelled(event);
      break;

    case 'customer.subscription.resumed':
      await billingService.handleSubscriptionUpdated(event);
      break;

    case 'invoice.paid':
      await billingService.handleInvoicePaid(event);
      break;

    case 'invoice.payment_failed':
      console.error('[Webhook] Payment failed:', event.data.object);
      // Handle failed payment (notify user, etc.)
      break;

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}));

// Import express for raw body parsing
import express from 'express';

export default router;
