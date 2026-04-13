import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function formatRelativeTime(date: Date | number) {
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}

interface ColabHubCommentsProps {
  workflowId: string;
  currentUserId: string;
  currentUserName?: string;
}

export default function ColabHubComments({ workflowId, currentUserId, currentUserName = 'Anonymous' }: ColabHubCommentsProps) {
  const { comments, loading, error, postComment, removeComment } = useComments(workflowId);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    
    setIsSubmitting(true);
    try {
      // In a real scenario, you'd likely want to include the user's name/avatar in the document or 
      // fetch it dynamically, but here we just store the content and let the hook handle the rest.
      await postComment(currentUserId, newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#ef4444', textAlign: 'center' }}>
        Failed to load comments. Please ensure you have permission.
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      maxWidth: '600px', 
      background: 'rgba(0,0,0,0.2)', 
      borderRadius: '12px', 
      border: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        fontWeight: 600,
        color: '#e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Project Discussion</span>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '400px'
      }}>
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
              {/* Simple Avatar Placeholder */}
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#3b82f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                flexShrink: 0
              }}>
                {comment.userId.substring(0, 1).toUpperCase()}
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500, fontSize: '13px', color: '#e2e8f0' }}>
                    User {comment.userId.substring(0, 5)} {/* Replace with real username if fetched */}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {comment.createdAt ? formatRelativeTime(comment.createdAt) : 'Just now'}
                  </span>
                </div>
                
                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {comment.content}
                </p>

                {comment.userId === currentUserId && (
                  <button 
                    onClick={() => comment.id && removeComment(comment.id)}
                    style={{ 
                      alignSelf: 'flex-start', 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#ef4444', 
                      fontSize: '11px', 
                      cursor: 'pointer', 
                      padding: 0,
                      marginTop: '4px',
                      opacity: 0.7 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={isSubmitting || !currentUserId}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              outline: 'none',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || !currentUserId}
            style={{
              background: newComment.trim() && !isSubmitting ? '#3b82f6' : 'rgba(255,255,255,0.1)',
              color: newComment.trim() && !isSubmitting ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '0 16px',
              fontWeight: 600,
              cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
