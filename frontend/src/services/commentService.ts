import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../config/firebase';
import type { Comment } from '../types/comment';

const WORKFLOWS_COLLECTION = 'workflows';
const COMMENTS_SUBCOLLECTION = 'comments';

export function subscribeToWorkflowComments(workflowId: string, callback: (comments: Comment[]) => void): Unsubscribe {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const q = query(
    collection(db, WORKFLOWS_COLLECTION, workflowId, COMMENTS_SUBCOLLECTION),
    orderBy('createdAt', 'asc') // Oldest first to build a natural thread
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        workflowId,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Comment;
    });
    callback(comments);
  });
}

export async function addWorkflowComment(workflowId: string, userId: string, content: string): Promise<string> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const db = getDb();
  
  const commentRef = await addDoc(collection(db, WORKFLOWS_COLLECTION, workflowId, COMMENTS_SUBCOLLECTION), {
    userId,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return commentRef.id;
}

export async function updateWorkflowComment(workflowId: string, commentId: string, content: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  
  await updateDoc(doc(db, WORKFLOWS_COLLECTION, workflowId, COMMENTS_SUBCOLLECTION, commentId), {
    content,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkflowComment(workflowId: string, commentId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  
  await deleteDoc(doc(db, WORKFLOWS_COLLECTION, workflowId, COMMENTS_SUBCOLLECTION, commentId));
}
