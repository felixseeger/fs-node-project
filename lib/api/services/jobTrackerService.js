import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// In-memory fallback for local dev without Firebase
const memoryJobs = new Map();

function createMemoryJob(provider, initialData) {
  const jobId = uuidv4();
  const jobData = {
    id: jobId,
    provider,
    status: 'pending',
    progress: 0,
    resultUrl: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...initialData
  };
  memoryJobs.set(jobId, jobData);
  return jobData;
}

function updateMemoryJob(jobId, updates) {
  const job = memoryJobs.get(jobId);
  if (!job) return null;
  
  const updatedJob = {
    ...job,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  memoryJobs.set(jobId, updatedJob);
  return updatedJob;
}

function getMemoryJob(jobId) {
  return memoryJobs.get(jobId) || null;
}

/**
 * Creates a new VFX job in Firestore.
 */
export async function createJob(provider, initialData = {}) {
  if (!admin.apps.length) {
    console.warn('[JobTracker] Firebase Admin is not initialized. Using in-memory fallback.');
    return createMemoryJob(provider, initialData);
  }

  const db = admin.firestore();
  const jobId = uuidv4();
  const jobRef = db.collection('vfx_jobs').doc(jobId);
  
  const jobData = {
    id: jobId,
    provider,
    status: 'pending',
    progress: 0,
    resultUrl: null,
    error: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    ...initialData
  };

  await jobRef.set(jobData);
  return jobData;
}

/**
 * Updates an existing VFX job.
 */
export async function updateJobStatus(jobId, updates) {
  if (!admin.apps.length) {
    return updateMemoryJob(jobId, updates);
  }

  const db = admin.firestore();
  const jobRef = db.collection('vfx_jobs').doc(jobId);
  
  const finalUpdates = {
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await jobRef.update(finalUpdates);
  return finalUpdates;
}

/**
 * Gets a VFX job by ID.
 */
export async function getJob(jobId) {
  if (!admin.apps.length) {
    return getMemoryJob(jobId);
  }

  const db = admin.firestore();
  const jobRef = db.collection('vfx_jobs').doc(jobId);
  const doc = await jobRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data();
}
