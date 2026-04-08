import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';

const TEMPLATES_COLLECTION = 'templates';

function timestampToString(timestamp: Timestamp | null | undefined): string | undefined {
  if (!timestamp) return undefined;
  return timestamp.toDate().toISOString();
}

function serializeTemplate(template: any): any {
  return {
    name: template.name || 'Untitled Template',
    description: template.description || '',
    nodes: JSON.parse(JSON.stringify(template.nodes || [])),
    edges: JSON.parse(JSON.stringify(template.edges || [])),
    inputs: JSON.parse(JSON.stringify(template.inputs || [])),
    outputs: JSON.parse(JSON.stringify(template.outputs || [])),
    updatedAt: serverTimestamp(),
  };
}

function deserializeTemplate(id: string, data: any): any {
  return {
    ...data,
    id,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
  };
}

export async function createTemplate(userId: string, template: any): Promise<any> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const templatesRef = collection(db, TEMPLATES_COLLECTION);
  
  const templateData = {
    ...serializeTemplate(template),
    userId,
    createdAt: serverTimestamp(),
    isDeleted: false,
  };

  const docRef = await Promise.race([
    addDoc(templatesRef, templateData),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timed out')), 10000)
    ),
  ]);

  return { ...template, id: docRef.id };
}

export async function getTemplate(templateId: string): Promise<any | null> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().isDeleted) return null;
  return deserializeTemplate(snapshot.id, snapshot.data());
}

export async function updateTemplate(templateId: string, updates: any, userId?: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);

  if (userId) {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() || snapshot.data().userId !== userId) {
      throw new Error('Permission denied');
    }
  }

  const updateData = { ...updates, updatedAt: serverTimestamp() };
  await updateDoc(docRef, updateData);
}

export async function deleteTemplate(templateId: string, userId?: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);

  if (userId) {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() || snapshot.data().userId !== userId) {
      throw new Error('Permission denied');
    }
  }

  await updateDoc(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
}

export function subscribeToUserTemplates(userId: string, callback: (templates: any[]) => void): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  const q = query(
    collection(db, TEMPLATES_COLLECTION),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const templates = snapshot.docs.map(doc => deserializeTemplate(doc.id, doc.data()));
    callback(templates);
  }, (error) => {
    console.error('[TemplateService] Subscription error:', error);
    callback([]);
  });
}