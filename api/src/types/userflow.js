/**
 * User Flow Type Definitions
 * TypeScript-style JSDoc types for documentation
 */

/**
 * @typedef {Object} User
 * @property {string} uid - Firebase Auth UID
 * @property {string} email - User email
 * @property {string} displayName - User display name
 * @property {string|null} photoURL - Profile photo URL
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 * @property {boolean} emailVerified - Email verification status
 * @property {UserPreferences} preferences - User preferences
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} [language='en'] - User language
 * @property {string} [theme='light'] - UI theme preference
 * @property {boolean} [emailNotifications=true] - Email notifications enabled
 * @property {Object} [settings] - Additional custom settings
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} uid - User UID (matches Firebase Auth)
 * @property {string} [bio] - User bio
 * @property {string} [company] - Company name
 * @property {string} [website] - Personal website
 * @property {string} [location] - Location
 * @property {Object} [social] - Social media links
 * @property {number} [workflowsCount=0] - Total workflows created
 * @property {number} [totalGenerations=0] - Total AI generations
 * @property {string} [lastActiveAt] - Last activity timestamp
 * @property {string} [createdAt] - Profile creation timestamp
 * @property {string} [updatedAt] - Profile update timestamp
 */

/**
 * @typedef {Object} Workflow
 * @property {string} id - Workflow ID (auto-generated)
 * @property {string} uid - Owner user ID
 * @property {string} name - Workflow name
 * @property {string} [description] - Workflow description
 * @property {WorkflowNode[]} nodes - Workflow nodes
 * @property {WorkflowEdge[]} edges - Workflow edges/connections
 * @property {Object} [metadata] - Additional metadata
 * @property {string} [thumbnailUrl] - Workflow thumbnail URL
 * @property {boolean} isPublic - Public visibility
 * @property {string[]} [tags] - Workflow tags
 * @property {number} [version=1] - Workflow version
 * @property {string} [parentId] - Parent workflow ID (for forks)
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} WorkflowNode
 * @property {string} id - Node ID
 * @property {string} type - Node type (image-gen, video-gen, etc.)
 * @property {Object} data - Node configuration data
 * @property {number} x - X position
 * @property {number} y - Y position
 */

/**
 * @typedef {Object} WorkflowEdge
 * @property {string} id - Edge ID
 * @property {string} source - Source node ID
 * @property {string} target - Target node ID
 * @property {string} [sourceHandle] - Source handle
 * @property {string} [targetHandle] - Target handle
 */

/**
 * @typedef {Object} Subscription
 * @property {string} uid - User ID
 * @property {string} stripeCustomerId - Stripe customer ID
 * @property {string} [stripeSubscriptionId] - Stripe subscription ID
 * @property {'free'|'pro'|'team'|'enterprise'} plan - Subscription plan
 * @property {string} [planId] - Stripe price ID
 * @property {SubscriptionStatus} status - Subscription status
 * @property {number} currentPeriodStart - Current period start (Unix timestamp)
 * @property {number} currentPeriodEnd - Current period end (Unix timestamp)
 * @property {boolean} cancelAtPeriodEnd - Cancel at period end
 * @property {Object} [usage] - Usage tracking
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} SubscriptionStatus
 * @property {boolean} active - Subscription is active
 * @property {string} [cancellationReason] - Reason for cancellation
 * @property {number} [creditsRemaining] - Remaining credits (if applicable)
 * @property {number} [creditsTotal] - Total credits for period
 * @property {number} [generationsUsed] - Generations used in period
 * @property {number} [generationsLimit] - Generations limit for period
 */

/**
 * @typedef {Object} UsageRecord
 * @property {string} id - Record ID
 * @property {string} uid - User ID
 * @property {string} type - Usage type (image_gen, video_gen, etc.)
 * @property {number} creditsUsed - Credits consumed
 * @property {Object} [metadata] - Additional metadata
 * @property {string} createdAt - Usage timestamp
 */

/**
 * @typedef {Object} BillingInvoice
 * @property {string} id - Invoice ID
 * @property {string} uid - User ID
 * @property {string} stripeInvoiceId - Stripe invoice ID
 * @property {number} amount - Invoice amount (in cents)
 * @property {string} currency - Currency code
 * @property {'paid'|'pending'|'failed'|'refunded'} status - Invoice status
 * @property {string} description - Invoice description
 * @property {string} hostedUrl - Stripe hosted invoice URL
 * @property {string} createdAt - Creation timestamp
 * @property {string} [paidAt] - Payment timestamp
 */

export default {};
