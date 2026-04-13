import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToWorkflowComments,
  addWorkflowComment,
  updateWorkflowComment,
  deleteWorkflowComment,
} from '../services/commentService';
import type { Comment } from '../types/comment';

export function useComments(workflowId: string | undefined | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workflowId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToWorkflowComments(workflowId, (newComments) => {
        setComments(newComments);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  }, [workflowId]);

  const postComment = useCallback(async (userId: string, content: string) => {
    if (!workflowId) throw new Error('No active workflow specified');
    return await addWorkflowComment(workflowId, userId, content);
  }, [workflowId]);

  const editComment = useCallback(async (commentId: string, content: string) => {
    if (!workflowId) throw new Error('No active workflow specified');
    await updateWorkflowComment(workflowId, commentId, content);
  }, [workflowId]);

  const removeComment = useCallback(async (commentId: string) => {
    if (!workflowId) throw new Error('No active workflow specified');
    await deleteWorkflowComment(workflowId, commentId);
  }, [workflowId]);

  return { 
    comments, 
    loading, 
    error, 
    postComment, 
    editComment, 
    removeComment 
  };
}
