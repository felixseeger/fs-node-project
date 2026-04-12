import { Timestamp } from 'firebase/firestore';

export interface Wallet {
  uid: string;
  balance: number;
  totalPurchased: number;
  totalConsumed: number;
  updatedAt: string | Timestamp;
  createdAt: string | Timestamp;
}

export type TransactionType = 'grant' | 'purchase' | 'consumption' | 'refund';

export interface CreditTransaction {
  id?: string;
  uid: string;
  amount: number; // positive for recharge/grant, negative for consumption
  type: TransactionType;
  description: string;
  nodeType?: string; // which node consumed the credit
  modelId?: string;  // which model was used
  createdAt: string | Timestamp;
}

export type PricingCategory = 'image' | 'video' | 'audio' | 'text' | 'utility';

export interface NodePricing {
  id: string;
  name: string;
  baseCost: number;
  category: PricingCategory;
  description?: string;
}
