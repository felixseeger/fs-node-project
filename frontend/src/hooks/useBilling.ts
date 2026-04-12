import { useState, useEffect } from 'react';

import { getWallet, subscribeToWallet, getRecentTransactions } from '../services/billingService';
import { Wallet, CreditTransaction } from '../types/billing';

export function useBilling(uid: string | null | undefined) {
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setWallet(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: () => void;

    const initBilling = async () => {
      try {
        // Initial fetch to ensure wallet exists
        await getWallet(uid!);
        
        // Fetch recent transactions
        const recentTxs = await getRecentTransactions(uid!);
        setTransactions(recentTxs);

        // Subscribe to real-time wallet changes
        unsubscribe = subscribeToWallet(uid!, (updatedWallet) => {
          setWallet(updatedWallet);
          setLoading(false);
        });
      } catch (err) {
        console.error('[useBilling] Error initializing billing:', err);
        setError('Failed to load billing information');
        setLoading(false);
      }
    };

    initBilling();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [uid]);

  const refreshTransactions = async () => {
    if (!uid) return;
    try {
      const recentTxs = await getRecentTransactions(uid!);
      setTransactions(recentTxs);
    } catch (err) {
      console.error('[useBilling] Error refreshing transactions:', err);
    }
  };

  return {
    wallet,
    balance: wallet?.balance || 0,
    transactions,
    loading,
    error,
    refreshTransactions
  };
}
