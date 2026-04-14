import { Router } from 'express';
import Stripe from 'stripe';
import { getCreditBalance, addCredits } from '../utils/credits.js';
import express from 'express';
import redis from '../utils/redis.js';


const router = Router();

// Initialize Stripe (if key is provided)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * GET /api/billing/balance
 * Returns the current user's credit balance
 */
router.get('/billing/balance', async (req, res, next) => {
  try {
    const balance = await getCreditBalance(req.user.uid);
    res.json({ balance });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/billing/create-checkout
 * Creates a Stripe Checkout session for Pro subscription or Top-ups
 */
router.post('/billing/create-checkout', async (req, res, next) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Billing service unavailable' });
  }

  const { type } = req.body; // 'pro_subscription' or 'topup_500'
  const uid = req.user.uid;
  const email = req.user.email;

  try {
    let sessionConfig = {
      payment_method_types: ['card'],
      client_reference_id: uid,
      customer_email: email,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/editor`,
    };

    if (type === 'pro_subscription') {
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [{
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      }];
    } else {
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [{
        price: process.env.STRIPE_TOPUP_500_PRICE_ID,
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/webhooks/stripe
 * Stripe Webhook handler (must be registered as public/unauthenticated)
 * Note: req.rawBody is needed for signature verification
 */
export const stripeWebhookHandler = async (req, res, next) => {
  try {
    if (!stripe) return res.sendStatus(503);

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Stripe requires the raw body for signature verification
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('[Webhook Error]', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
  // Idempotency check to prevent double-crediting
  const eventId = event.id;
  if (eventId) {
    const isProcessed = await redis.setnx(`webhook_processed:${eventId}`, '1');
    if (!isProcessed) {
      console.log(`[Billing] Webhook event ${eventId} already processed, skipping.`);
      return res.json({ received: true });
    }
    // Expire the idempotency key after 7 days
    await redis.expire(`webhook_processed:${eventId}`, 86400 * 7);
  }

  // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const uid = session.client_reference_id;
        
        // Determine what was bought
        // In a real app, you'd look up the line items or use metadata
        if (uid) {
          if (session.mode === 'subscription') {
            // Add 1000 credits for Pro monthly
            await addCredits(uid, 1000, true);
            console.log(`[Billing] Pro subscription completed for user ${uid}`);
          } else {
            // Add 500 credits for top-up
            await addCredits(uid, 500);
            console.log(`[Billing] Top-up completed for user ${uid}`);
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        // Handle failed recurring payments
        const invoice = event.data.object;
        console.warn(`[Billing] Payment failed for invoice ${invoice.id}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export default router;
