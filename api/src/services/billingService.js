/**
 * Billing Service
 * Stripe integration and subscription management
 */
import Stripe from 'stripe';
import {
  createOrUpdateSubscription,
  getSubscription,
  recordUsage,
  getUsageRecords,
  createInvoice,
  getInvoices,
  checkUsageLimit,
  PLANS,
  PLAN_LIMITS,
} from '../models/subscription.js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  timeout: 20000,
});

/**
 * Create or retrieve Stripe customer
 * @param {string} uid - User ID
 * @param {Object} customerData - Customer data
 * @returns {Promise<string>} Stripe customer ID
 */
export async function getOrCreateStripeCustomer(uid, customerData) {
  const subscription = await getSubscription(uid);

  if (subscription.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: customerData.email,
    name: customerData.name,
    metadata: {
      uid,
    },
  });

  await createOrUpdateSubscription(uid, {
    stripeCustomerId: customer.id,
    plan: PLANS.FREE,
    currentPeriodStart: Math.floor(Date.now() / 1000),
    currentPeriodEnd: Math.floor(Date.now() / 1000),
  });

  return customer.id;
}

/**
 * Create checkout session for subscription
 * @param {string} uid - User ID
 * @param {Object} options - Checkout options
 * @returns {Promise<Object>} Checkout session
 */
export async function createCheckoutSession(uid, options) {
  const {
    plan = PLANS.PRO,
    successUrl,
    cancelUrl,
    customerId,
  } = options;

  // Get Stripe price ID for plan
  const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}`];
  if (!priceId) {
    throw new Error(`No price configured for plan: ${plan}`);
  }

  const customerId = await getOrCreateStripeCustomer(uid, options.customerData);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      uid,
      plan,
    },
    subscription_data: {
      metadata: {
        uid,
        plan,
      },
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Create billing portal session
 * @param {string} uid - User ID
 * @param {Object} options - Portal options
 * @returns {Promise<Object>} Portal session
 */
export async function createBillingPortalSession(uid, options) {
  const subscription = await getSubscription(uid);

  if (!subscription.stripeCustomerId) {
    throw new Error('No Stripe customer found for user');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: options.returnUrl,
  });

  return {
    url: portalSession.url,
  };
}

/**
 * Handle webhook: subscription created/updated
 * @param {Object} event - Stripe event
 * @returns {Promise<void>}
 */
export async function handleSubscriptionUpdated(event) {
  const subscription = event.data.object;
  const { uid, plan } = subscription.metadata;

  if (!uid) {
    console.warn('Webhook received without uid metadata');
    return;
  }

  await createOrUpdateSubscription(uid, {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    plan: plan || PLANS.PRO,
    planId: subscription.items.data[0]?.price.id,
    status: {
      active: subscription.status === 'active' || subscription.status === 'trialing',
      cancellationReason: subscription.cancellation_details?.reason || null,
      creditsRemaining: 0,
      creditsTotal: 0,
      generationsUsed: 0,
      generationsLimit: PLAN_LIMITS[plan || PLANS.PRO]?.generationsLimit ?? 500,
    },
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

/**
 * Handle webhook: subscription cancelled
 * @param {Object} event - Stripe event
 * @returns {Promise<void>}
 */
export async function handleSubscriptionCancelled(event) {
  const subscription = event.data.object;
  const { uid } = subscription.metadata;

  if (!uid) return;

  await createOrUpdateSubscription(uid, {
    stripeSubscriptionId: subscription.id,
    status: {
      active: false,
      cancellationReason: subscription.cancellation_details?.reason || 'user_cancelled',
      creditsRemaining: 0,
      creditsTotal: 0,
      generationsUsed: 0,
      generationsLimit: PLAN_LIMITS[PLANS.FREE].generationsLimit,
    },
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    plan: PLANS.FREE,
  });
}

/**
 * Handle webhook: invoice paid
 * @param {Object} event - Stripe event
 * @returns {Promise<void>}
 */
export async function handleInvoicePaid(event) {
  const invoice = event.data.object;
  const { uid } = invoice.metadata || {};

  if (!uid) {
    // Try to find uid from customer metadata
    const customer = await stripe.customers.retrieve(invoice.customer);
    if (!customer.metadata?.uid) {
      console.warn('Invoice paid webhook without uid metadata');
      return;
    }
  }

  const finalUid = uid || customer.metadata.uid;

  await createInvoice(finalUid, {
    stripeInvoiceId: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    description: invoice.description || 'Subscription payment',
    hostedUrl: invoice.hosted_invoice_url,
    paidAt: new Date(invoice.status_transitions?.paid_at * 1000).toISOString(),
  });
}

/**
 * Record AI generation usage
 * @param {string} uid - User ID
 * @param {string} type - Generation type
 * @param {number} [creditsUsed=1] - Credits used
 * @returns {Promise<Object>} Usage record
 */
export async function recordGenerationUsage(uid, type, creditsUsed = 1) {
  // Check if user has available credits
  const limitCheck = await checkUsageLimit(uid);

  if (!limitCheck.canUse) {
    throw new Error('Usage limit reached. Please upgrade your plan.');
  }

  return recordUsage(uid, type, creditsUsed, { timestamp: Date.now() });
}

/**
 * Get user's billing information
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Billing info
 */
export async function getBillingInfo(uid) {
  const [subscription, invoices, usage] = await Promise.all([
    getSubscription(uid),
    getInvoices(uid, { limit: 10 }),
    checkUsageLimit(uid),
  ]);

  return {
    subscription,
    planLimits: PLAN_LIMITS[subscription.plan] || PLAN_LIMITS[PLANS.FREE],
    usage,
    invoices,
  };
}

/**
 * Cancel subscription
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Updated subscription
 */
export async function cancelSubscription(uid) {
  const subscription = await getSubscription(uid);

  if (!subscription.stripeSubscriptionId) {
    throw new Error('No active subscription to cancel');
  }

  await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

  return getSubscription(uid);
}

export default {
  getOrCreateStripeCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  handleSubscriptionUpdated,
  handleSubscriptionCancelled,
  handleInvoicePaid,
  recordGenerationUsage,
  getBillingInfo,
  cancelSubscription,
  stripe,
  PLANS,
  PLAN_LIMITS,
};
