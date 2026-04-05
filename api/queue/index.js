import PQueue from 'p-queue';

/**
 * We create queues to restrict the concurrency of outgoing requests to third-party endpoints.
 * This prevents our server from slamming external providers and causing rate-limit errors on their side,
 * or exhausting our own connection pools.
 */

// General generation queue (handles most image/video gen endpoints)
// Adjust concurrency based on what Freepik, Anthropic, or other APIs permit.
export const generateQueue = new PQueue({ concurrency: 5 });

// Dedicated background polling queue (if needed, otherwise we can use the same)
export const pollQueue = new PQueue({ concurrency: 10 });

// Export the default general AI queue
export default generateQueue;
