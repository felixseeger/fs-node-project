import { logAuditEvent } from '../services/auditLogger.js';
import admin from 'firebase-admin';

/**
 * Get user credit balance
 */
export async function getCreditBalance(uid) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();
  
  if (!doc.exists) {
    // Initial free credits for new users
    const initialCredits = parseInt(process.env.INITIAL_FREE_CREDITS || '50');
    await userRef.set({
      credits: initialCredits,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isPro: false
    });
    return initialCredits;
  }
  
  return doc.data().credits || 0;
}

/**
 * Deduct credits from user balance
 * @returns {Promise<number>} New balance
 */
export async function deductCredits(uid, amount) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    
    let currentCredits = 0;
    let isNewUser = false;
    
    if (!doc.exists) {
      // Initialize if missing
      const initialCredits = parseInt(process.env.INITIAL_FREE_CREDITS || '50');
      currentCredits = initialCredits;
      isNewUser = true;
    } else {
      currentCredits = doc.data().credits || 0;
    }
    
    if (currentCredits < amount) {
      throw new Error('INSUFFICIENT_CREDITS');
    }
    
    const newBalance = currentCredits - amount;
    
    if (isNewUser) {
      transaction.set(userRef, {
        credits: newBalance,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUsageAt: admin.firestore.FieldValue.serverTimestamp(),
        isPro: false
      });
    } else {
      transaction.update(userRef, { 
        credits: newBalance,
        lastUsageAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Audit logging
    logAuditEvent({
      action: 'DEDUCT_CREDITS',
      userId: uid,
      details: { amount, newBalance, isNewUser },
      status: 'SUCCESS'
    });
    return newBalance;
  });
}

/**
 * Add credits to user balance (e.g. from payment)
 */
export async function addCredits(uid, amount, isPro = false) {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  
  const updateData = {
    credits: admin.firestore.FieldValue.increment(amount),
    lastTopupAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  // Audit logging
  logAuditEvent({
    action: 'ADD_CREDITS',
    userId: uid,
    details: { amount, isPro },
    status: 'SUCCESS'
  });
  
  if (isPro) {
    updateData.isPro = true;
  }
  
  try {
    await userRef.update(updateData);
  } catch (error) {
    if (error.code === 5 || error.message.includes('NOT_FOUND')) {
      const initialCredits = parseInt(process.env.INITIAL_FREE_CREDITS || '50');
      await userRef.set({
        credits: initialCredits + amount,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastTopupAt: admin.firestore.FieldValue.serverTimestamp(),
        isPro: isPro
      });
    } else {
      throw error;
    }
  }
}
