import { describe, it, expect, vi, beforeEach } from 'vitest';

// We must mock dependencies before importing the module
vi.mock('bullmq', () => {
  return {
    Worker: vi.fn().mockImplementation((name, processor, opts) => {
      // Expose processor for testing
      globalThis.__workerProcessor = processor;
      return {
        on: vi.fn()
      };
    })
  };
});

vi.mock('../utils/redis.js', () => ({
  createRedisConnection: vi.fn(() => ({}))
}));

vi.mock('../jobTrackerService.js', () => ({
  updateJobStatus: vi.fn(),
  getJob: vi.fn()
}));

vi.mock('../processorRegistry.js', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('renderingWorker.js', () => {
  let updateJobStatus, getJob, processorRegistry;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_WORKER = 'true';
    
    // Import dynamically so mocks are fresh
    const jobTracker = await import('../jobTrackerService.js');
    updateJobStatus = jobTracker.updateJobStatus;
    getJob = jobTracker.getJob;
    
    const registry = await import('../processorRegistry.js');
    processorRegistry = registry.default;
    
    // Import worker to run initialization
    await import('../renderingWorker.js?update=' + Date.now());
  });

  it('throws if no processor registered', async () => {
    processorRegistry.get.mockReturnValue(null);
    const processor = globalThis.__workerProcessor;
    
    await expect(processor({ data: { jobId: '1', jobType: 'unknown', payload: {} } }))
      .rejects.toThrow('No processor registered for jobType: unknown');
  });

  it('runs processor, updates progress, and marks complete', async () => {
    const mockProcessorFn = vi.fn().mockImplementation(async (payload, progressCb) => {
      await progressCb(50);
      return { url: 'http://result.com' };
    });
    processorRegistry.get.mockReturnValue(mockProcessorFn);
    getJob.mockResolvedValue({ status: 'processing' });
    updateJobStatus.mockResolvedValue();

    const processor = globalThis.__workerProcessor;
    const result = await processor({ data: { jobId: '1', jobType: 'vfx', payload: { a: 1 } } });
    
    expect(result).toEqual({ url: 'http://result.com' });
    expect(mockProcessorFn).toHaveBeenCalledWith({ a: 1 }, expect.any(Function));
    expect(updateJobStatus).toHaveBeenCalledWith('1', { status: 'processing' });
    expect(updateJobStatus).toHaveBeenCalledWith('1', { progress: 50 });
    expect(updateJobStatus).toHaveBeenCalledWith('1', {
      status: 'completed',
      progress: 100,
      resultUrl: 'http://result.com',
      resultData: { url: 'http://result.com' }
    });
  });

  it('marks job as failed on error', async () => {
    const mockProcessorFn = vi.fn().mockRejectedValue(new Error('VFX Failed'));
    processorRegistry.get.mockReturnValue(mockProcessorFn);
    updateJobStatus.mockResolvedValue();

    const processor = globalThis.__workerProcessor;
    
    await expect(processor({ data: { jobId: '2', jobType: 'vfx', payload: {} } }))
      .rejects.toThrow('VFX Failed');
      
    expect(updateJobStatus).toHaveBeenCalledWith('2', { status: 'processing' });
    expect(updateJobStatus).toHaveBeenCalledWith('2', {
      status: 'failed',
      error: 'VFX Failed'
    });
  });
});
