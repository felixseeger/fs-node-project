import PQueue from 'p-queue';

/**
 * VFX Worker Queue
 * Manages heavy backend processing tasks to avoid blocking the main API thread.
 * 
 * Configured with concurrency control and priority support.
 */
const vfxQueue = new PQueue({
  concurrency: process.env.VFX_CONCURRENCY ? parseInt(process.env.VFX_CONCURRENCY) : 2
});

vfxQueue.on('active', () => {
	console.log(`[VFX Queue] Task started. Size: ${vfxQueue.size}  Pending: ${vfxQueue.pending}`);
});

vfxQueue.on('completed', result => {
	console.log('[VFX Queue] Task completed.');
});

vfxQueue.on('error', error => {
	console.error('[VFX Queue] Task failed:', error);
});

export default vfxQueue;
