import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  type Unsubscribe
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import { type Wallet, type CreditTransaction, type TransactionType } from '../types/billing';
import { DEFAULT_STARTING_CREDITS } from '../config/pricing';

const WALLETS_COLLECTION = 'wallets';
const TRANSACTIONS_COLLECTION = 'credit_transactions';

/**
 * Initialize a new wallet for a user with default starting credits
 */
export async function initializeWallet(uid: string): Promise<Wallet> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const walletRef = doc(db, WALLETS_COLLECTION, uid);
  
  const walletData: Wallet = {
    uid,
    balance: DEFAULT_STARTING_CREDITS,
    totalPurchased: 0,
    totalConsumed: 0,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  await setDoc(walletRef, walletData, { merge: true });

  // Record the initial grant transaction
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  await addDoc(txRef, {
    uid,
    amount: DEFAULT_STARTING_CREDITS,
    type: 'grant',
    description: 'Initial signup credits',
    createdAt: serverTimestamp()
  });

  const snapshot = await getDoc(walletRef);
  return { ...snapshot.data(), uid } as Wallet;
}

/**
 * Get user wallet
 */
export async function getWallet(uid: string): Promise<Wallet | null> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, WALLETS_COLLECTION, uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    // Initialize if it doesn't exist
    return await initializeWallet(uid);
  }
  return { ...snapshot.data(), uid } as Wallet;
}

/**
 * Subscribe to wallet changes
 */
export function subscribeToWallet(uid: string, callback: (wallet: Wallet | null) => void): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, WALLETS_COLLECTION, uid);

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ ...snapshot.data(), uid } as Wallet);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('[BillingService] Wallet subscription error:', error);
    callback(null);
  });
}

/**
 * Process a credit deduction for an operation
 */
export async function deductCredits(
  uid: string, 
  amount: number, 
  description: string,
  nodeType?: string,
  modelId?: string
): Promise<boolean> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  if (amount <= 0) return true; // Free operation

  const db = getDb();
  const walletRef = doc(db, WALLETS_COLLECTION, uid);
  const txsRef = collection(db, TRANSACTIONS_COLLECTION);

  try {
    await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef);
      
      if (!walletDoc.exists()) {
        throw new Error('Wallet does not exist');
      }

      const currentBalance = walletDoc.data().balance || 0;
      
      if (currentBalance < amount) {
        throw new Error('Insufficient credits');
      }

      const newBalance = currentBalance - amount;
      const totalConsumed = (walletDoc.data().totalConsumed || 0) + amount;

      transaction.update(walletRef, {
        balance: newBalance,
        totalConsumed,
        updatedAt: serverTimestamp()
      });

      const newTxRef = doc(txsRef);
      transaction.set(newTxRef, {
        uid,
        amount: -amount,
        type: 'consumption',
        description,
        nodeType: nodeType || null,
        modelId: modelId || null,
        createdAt: serverTimestamp()
      });
    });
    
    return true;
  } catch (error) {
    console.error('[BillingService] Failed to deduct credits:', error);
    return false; // Could be insufficient funds or transaction error
  }
}

/**
 * Fetch recent transactions for a user
 */
export async function getRecentTransactions(uid: string, count: number = 20): Promise<CreditTransaction[]> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  const q = query(
    txRef,
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as CreditTransaction));
}
