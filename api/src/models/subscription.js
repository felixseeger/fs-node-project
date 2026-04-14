/**
 * Subscription Model
 * Handles user subscriptions and billing in Firestore
 */
import { db } from '../config/firebase.js';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const USAGE_RECORDS_COLLECTION = 'usage_records';
const INVOICES_COLLECTION = 'invoices';

// Plan definitions
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  TEAM: 'team',
  ENTERPRISE: 'enterprise',
};

export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    generationsLimit: 10,
    workflowsLimit: 3,
    maxResolution: '1024x1024',
    watermark: true,
    priority: 'low',
  },
  [PLANS.PRO]: {
    generationsLimit: 500,
    workflowsLimit: 50,
    maxResolution: '4096x4096',
    watermark: false,
    priority: 'normal',
  },
  [PLANS.TEAM]: {
    generationsLimit: 5000,
    workflowsLimit: -1, // unlimited
    maxResolution: '4096x4096',
    watermark: false,
    priority: 'high',
  },
  [PLANS.ENTERPRISE]: {
    generationsLimit: -1, // unlimited
    workflowsLimit: -1,
    maxResolution: '8192x8192',
    watermark: false,
    priority: 'highest',
  },
};

/**
 * Create or update subscription
 * @param {string} uid - User ID
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Subscription document
 */
export async function createOrUpdateSubscription(uid, subscriptionData) {
  const subscriptionRef = db.collection(SUBSCRIPTIONS_COLLECTION).doc(uid);
  const now = new Date().toISOString();
  const nowUnix = Math.floor(Date.now() / 1000);

  const subscriptionDoc = {
    uid,
    stripeCustomerId: subscriptionData.stripeCustomerId,
    stripeSubscriptionId: subscriptionData.stripeSubscriptionId || null,
    plan: subscriptionData.plan || PLANS.FREE,
    planId: subscriptionData.planId || null,
    status: {
      active: subscriptionData.status?.active ?? true,
      cancellationReason: subscriptionData.status?.cancellationReason || null,
      creditsRemaining: subscriptionData.status?.creditsRemaining ?? subscriptionData.creditsTotal ?? 0,
      creditsTotal: subscriptionData.status?.creditsTotal ?? 0,
      generationsUsed: subscriptionData.status?.generationsUsed ?? 0,
      generationsLimit: subscriptionData.status?.generationsLimit ?? PLAN_LIMITS[subscriptionData.plan || PLANS.FREE].generationsLimit,
    },
    currentPeriodStart: subscriptionData.currentPeriodStart ?? nowUnix,
    currentPeriodEnd: subscriptionData.currentPeriodEnd ?? nowUnix,
    cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd ?? false,
    usage: subscriptionData.usage || {},
    createdAt: subscriptionData.createdAt || now,
    updatedAt: now,
  };

  await subscriptionRef.set(subscriptionDoc, { merge: true });
  return subscriptionDoc;
}

/**
 * Get subscription by user ID
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} Subscription document or null
 */
export async function getSubscription(uid) {
  const subscriptionRef = db.collection(SUBSCRIPTIONS_COLLECTION).doc(uid);
  const doc = await subscriptionRef.get();

  if (!doc.exists) {
    // Return default free plan
    const nowUnix = Math.floor(Date.now() / 1000);
    return {
      uid,
      plan: PLANS.FREE,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      planId: null,
      status: {
        active: true,
        cancellationReason: null,
        creditsRemaining: 0,
        creditsTotal: 0,
        generationsUsed: 0,
        generationsLimit: PLAN_LIMITS[PLANS.FREE].generationsLimit,
      },
      currentPeriodStart: nowUnix,
      currentPeriodEnd: nowUnix,
      cancelAtPeriodEnd: false,
      usage: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Record usage for a user
 * @param {string} uid - User ID
 * @param {string} type - Usage type (image_gen, video_gen, etc.)
 * @param {number} creditsUsed - Credits consumed
 * @param {Object} [metadata] - Additional metadata
 * @returns {Promise<Object>} Usage record
 */
export async function recordUsage(uid, type, creditsUsed, metadata = {}) {
  const usageRef = db.collection(USAGE_RECORDS_COLLECTION).doc();
  const now = new Date().toISOString();

  const usageRecord = {
    id: usageRef.id,
    uid,
    type,
    creditsUsed,
    metadata,
    createdAt: now,
  };

  await usageRef.set(usageRecord);

  // Update subscription usage counters
  const subscriptionRef = db.collection(SUBSCRIPTIONS_COLLECTION).doc(uid);
  await db.runTransaction(async (transaction) => {
    const subDoc = await transaction.get(subscriptionRef);
    if (subDoc.exists) {
      const sub = subDoc.data();
      transaction.update(subscriptionRef, {
        'status.generationsUsed': (sub.status?.generationsUsed || 0) + 1,
        updatedAt: now,
      });
    }
  });

  return usageRecord;
}

/**
 * Get usage records for a user
 * @param {string} uid - User ID
 * @param {Object} [options] - Query options
 * @param {number} [options.limit=50] - Max results
 * @param {string} [options.type] - Filter by usage type
 * @returns {Promise<Object[]>} Array of usage records
 */
export async function getUsageRecords(uid, { limit = 50, type } = {}) {
  let query = db.collection(USAGE_RECORDS_COLLECTION)
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (type) {
    query = query.where('type', '==', type);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Create invoice record
 * @param {string} uid - User ID
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} Invoice record
 */
export async function createInvoice(uid, invoiceData) {
  const invoiceRef = db.collection(INVOICES_COLLECTION).doc();
  const now = new Date().toISOString();

  const invoiceDoc = {
    id: invoiceRef.id,
    uid,
    stripeInvoiceId: invoiceData.stripeInvoiceId,
    amount: invoiceData.amount,
    currency: invoiceData.currency || 'usd',
    status: invoiceData.status || 'pending',
    description: invoiceData.description,
    hostedUrl: invoiceData.hostedUrl || null,
    createdAt: now,
    paidAt: invoiceData.paidAt || null,
  };

  await invoiceRef.set(invoiceDoc);
  return invoiceDoc;
}

/**
 * Get invoices for a user
 * @param {string} uid - User ID
 * @param {Object} [options] - Query options
 * @param {number} [options.limit=20] - Max results
 * @returns {Promise<Object[]>} Array of invoices
 */
export async function getInvoices(uid, { limit = 20 } = {}) {
  const snapshot = await db.collection(INVOICES_COLLECTION)
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Check if user has available credits/limit
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Check result with canUse and remaining
 */
export async function checkUsageLimit(uid) {
  const subscription = await getSubscription(uid);
  const planLimits = PLAN_LIMITS[subscription.plan] || PLAN_LIMITS[PLANS.FREE];

  if (planLimits.generationsLimit === -1) {
    return { canUse: true, remaining: -1, plan: subscription.plan };
  }

  const remaining = planLimits.generationsLimit - (subscription.status?.generationsUsed || 0);
  return {
    canUse: remaining > 0,
    remaining,
    plan: subscription.plan,
    limit: planLimits.generationsLimit,
    used: subscription.status?.generationsUsed || 0,
  };
}

export default {
  createOrUpdateSubscription,
  getSubscription,
  recordUsage,
  getUsageRecords,
  createInvoice,
  getInvoices,
  checkUsageLimit,
  PLANS,
  PLAN_LIMITS,
};
