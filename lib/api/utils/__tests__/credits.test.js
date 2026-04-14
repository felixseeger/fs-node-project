import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCreditBalance, deductCredits, addCredits } from '../credits.js';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();
const mockRunTransaction = vi.fn();

const mockDoc = {
  get: mockGet,
  set: mockSet,
  update: mockUpdate
};

const mockCollection = {
  doc: vi.fn(() => mockDoc)
};

vi.mock('firebase-admin', () => {
  return {
    default: {
      firestore: Object.assign(
        vi.fn(() => mockCollection),
        {
          FieldValue: {
            serverTimestamp: vi.fn(() => 'mock-timestamp'),
            increment: vi.fn((val) => `increment(${val})`)
          }
        }
      )
    }
  };
});

describe('credits.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INITIAL_FREE_CREDITS = '50';
    // attach runTransaction here to be able to mock it inside the test
    const admin = require('firebase-admin').default;
    admin.firestore().runTransaction = mockRunTransaction;
  });

  describe('getCreditBalance', () => {
    it('returns existing balance', async () => {
      mockGet.mockResolvedValueOnce({
        exists: true,
        data: () => ({ credits: 100 })
      });
      const balance = await getCreditBalance('user-1');
      expect(balance).toBe(100);
      expect(mockSet).not.toHaveBeenCalled();
    });

    it('initializes new user with default credits', async () => {
      mockGet.mockResolvedValueOnce({ exists: false });
      mockSet.mockResolvedValueOnce({});
      
      const balance = await getCreditBalance('user-new');
      expect(balance).toBe(50);
      expect(mockSet).toHaveBeenCalledWith({
        credits: 50,
        createdAt: 'mock-timestamp',
        isPro: false
      });
    });
  });

  describe('deductCredits', () => {
    it('deducts credits inside a transaction', async () => {
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ credits: 100 })
        }),
        update: vi.fn(),
        set: vi.fn()
      };
      
      mockRunTransaction.mockImplementationOnce(async (cb) => cb(mockTransaction));

      const newBalance = await deductCredits('user-1', 20);
      expect(newBalance).toBe(80);
      expect(mockTransaction.get).toHaveBeenCalled();
      expect(mockTransaction.update).toHaveBeenCalledWith(mockDoc, {
        credits: 80,
        lastUsageAt: 'mock-timestamp'
      });
    });

    it('throws INSUFFICIENT_CREDITS if not enough balance', async () => {
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ credits: 10 })
        })
      };
      
      mockRunTransaction.mockImplementationOnce(async (cb) => cb(mockTransaction));

      await expect(deductCredits('user-1', 20)).rejects.toThrow('INSUFFICIENT_CREDITS');
    });

    it('initializes new user and deducts in transaction if doc does not exist', async () => {
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({ exists: false }),
        set: vi.fn()
      };
      
      mockRunTransaction.mockImplementationOnce(async (cb) => cb(mockTransaction));

      const newBalance = await deductCredits('user-new', 20);
      expect(newBalance).toBe(30); // 50 - 20
      expect(mockTransaction.set).toHaveBeenCalledWith(mockDoc, {
        credits: 30,
        createdAt: 'mock-timestamp',
        lastUsageAt: 'mock-timestamp',
        isPro: false
      });
    });
  });

  describe('addCredits', () => {
    it('increments credits for existing user', async () => {
      mockUpdate.mockResolvedValueOnce({});
      await addCredits('user-1', 100, true);
      expect(mockUpdate).toHaveBeenCalledWith({
        credits: 'increment(100)',
        lastTopupAt: 'mock-timestamp',
        isPro: true
      });
    });

    it('creates user with combined credits if not found', async () => {
      const error = new Error('NOT_FOUND');
      error.code = 5;
      mockUpdate.mockRejectedValueOnce(error);
      mockSet.mockResolvedValueOnce({});

      await addCredits('user-new', 100);
      expect(mockSet).toHaveBeenCalledWith({
        credits: 150, // 50 initial + 100
        createdAt: 'mock-timestamp',
        lastTopupAt: 'mock-timestamp',
        isPro: false
      });
    });
  });
});
