import { describe, it, expect, vi, beforeEach } from 'vitest';
import { creditGuard } from '../creditGuard.js';
import * as credits from '../../utils/credits.js';

vi.mock('../../utils/credits.js', () => ({
  deductCredits: vi.fn()
}));

describe('creditGuard', () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      user: { uid: 'user-1' },
      body: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
  });

  it('returns 401 if user is not authenticated', async () => {
    req.user = null;
    const middleware = creditGuard(10);
    await middleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    expect(next).not.toHaveBeenCalled();
    expect(credits.deductCredits).not.toHaveBeenCalled();
  });

  it('deducts credits atomically and calls next', async () => {
    credits.deductCredits.mockResolvedValueOnce(90); // New balance
    const middleware = creditGuard(10);
    await middleware(req, res, next);

    expect(credits.deductCredits).toHaveBeenCalledWith('user-1', 10);
    expect(req.creditInfo).toEqual({
      deducted: 10,
      newBalance: 90
    });
    expect(next).toHaveBeenCalledWith(); // Called without error
  });

  it('handles function-based cost calculation', async () => {
    credits.deductCredits.mockResolvedValueOnce(80);
    const costFn = (r) => (r.body.isPro ? 20 : 5);
    req.body.isPro = true;

    const middleware = creditGuard(costFn);
    await middleware(req, res, next);

    expect(credits.deductCredits).toHaveBeenCalledWith('user-1', 20);
    expect(req.creditInfo).toEqual({
      deducted: 20,
      newBalance: 80
    });
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 402 if INSUFFICIENT_CREDITS error is thrown', async () => {
    credits.deductCredits.mockRejectedValueOnce(new Error('INSUFFICIENT_CREDITS'));
    const middleware = creditGuard(15);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Insufficient credits',
      code: 'PAYMENT_REQUIRED',
      required: 15
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('passes other errors to next()', async () => {
    const dbError = new Error('Database connection failed');
    credits.deductCredits.mockRejectedValueOnce(dbError);
    const middleware = creditGuard(10);
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
    expect(res.status).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
