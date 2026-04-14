import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as billing from '../billing.js';
import * as credits from '../../utils/credits.js';
import express from 'express';

vi.mock('../../utils/credits.js', () => ({
  addCredits: vi.fn(),
  getCreditBalance: vi.fn()
}));

const mockConstructEvent = vi.fn();
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({ url: 'http://test-url.com' })
        }
      },
      webhooks: {
        constructEvent: mockConstructEvent
      }
    }))
  };
});

describe('billing.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('stripeWebhookHandler', () => {
    let req, res, next;

    beforeEach(() => {
      process.env.STRIPE_SECRET_KEY = 'test_key';
      req = {
        headers: { 'stripe-signature': 'test_sig' },
        rawBody: 'test_body'
      };
      res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
        sendStatus: vi.fn()
      };
      next = vi.fn();
    });

    it('verifies signature and processes subscription', async () => {
      // Re-import to trigger initialization with env variable
      const { stripeWebhookHandler } = await import('../billing.js?update=' + Date.now());
      
      mockConstructEvent.mockReturnValueOnce({
        type: 'checkout.session.completed',
        data: {
          object: { client_reference_id: 'user-1', mode: 'subscription' }
        }
      });

      await stripeWebhookHandler(req, res, next);
      
      expect(mockConstructEvent).toHaveBeenCalledWith('test_body', 'test_sig', process.env.STRIPE_WEBHOOK_SECRET);
      expect(credits.addCredits).toHaveBeenCalledWith('user-1', 1000, true);
      expect(res.json).toHaveBeenCalledWith({ received: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('catches signature error and returns 400', async () => {
      const { stripeWebhookHandler } = await import('../billing.js?update2=' + Date.now());
      mockConstructEvent.mockImplementationOnce(() => { throw new Error('Bad sig'); });

      await stripeWebhookHandler(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Webhook Error: Bad sig');
    });

    it('passes unhandled errors to next()', async () => {
      const { stripeWebhookHandler } = await import('../billing.js?update3=' + Date.now());
      mockConstructEvent.mockReturnValueOnce({
        type: 'checkout.session.completed',
        data: {
          object: { client_reference_id: 'user-1', mode: 'subscription' }
        }
      });
      credits.addCredits.mockRejectedValueOnce(new Error('DB failure'));

      await stripeWebhookHandler(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'DB failure' }));
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
