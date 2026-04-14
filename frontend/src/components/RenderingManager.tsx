import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRenderingJobs, RenderingJob } from '../hooks/useRenderingJobs';

export default function RenderingManager() {
  const { jobs, isLoading, error } = useRenderingJobs();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);

  const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'processing' || j.status === 'paused');
  const completedJobs = jobs.filter(j => j.status === 'completed' || j.status === 'failed');

  const handleGlobalPause = async () => {
    try {
      await fetch('/api/queue/pause', { method: 'POST' });
      setIsGlobalPaused(true);
    } catch (err) {
      console.error('Failed to pause queue', err);
    }
  };

  const handleGlobalResume = async () => {
    try {
      await fetch('/api/queue/resume', { method: 'POST' });
      setIsGlobalPaused(false);
    } catch (err) {
      console.error('Failed to resume queue', err);
    }
  };

  const handleJobPause = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/pause`, { method: 'POST' });
    } catch (err) {
      console.error(`Failed to pause job ${jobId}`, err);
    }
  };

  const handleJobResume = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/resume`, { method: 'POST' });
    } catch (err) {
      console.error(`Failed to resume job ${jobId}`, err);
    }
  };

  if (isLoading && jobs.length === 0) return null;

  return (
    <div style={{
      width: 320,
      background: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #333',
      borderRadius: 12,
      padding: 12,
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'auto'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#aaa',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
          cursor: 'pointer'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Rendering Jobs
          <motion.svg 
            animate={{ rotate: isExpanded ? 180 : 0 }} 
            transition={{ duration: 0.2 }}
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6"/>
          </motion.svg>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isGlobalPaused && (
            <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 'bold' }}>QUEUE PAUSED</span>
          )}
          {activeJobs.length > 0 && (
            <span style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 10,
              fontSize: 10
            }}>{activeJobs.length} Active</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button 
                onClick={(e) => { e.stopPropagation(); isGlobalPaused ? handleGlobalResume() : handleGlobalPause(); }}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  background: isGlobalPaused ? '#22c55e' : '#f59e0b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {isGlobalPaused ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Resume All
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    Pause All
                  </>
                )}
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              maxHeight: 300,
              overflowY: 'auto',
              paddingRight: 4
            }}>
              {jobs.length === 0 && (
                <div style={{ color: '#666', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>
                  No rendering jobs
                </div>
              )}
              
              {jobs.map((job) => (
                <div key={job.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.05)',
                  padding: '8px 10px',
                  borderRadius: 6,
                  borderLeft: `2px solid ${
                    job.status === 'processing' ? '#3b82f6' : 
                    job.status === 'completed' ? '#22c55e' : 
                    job.status === 'failed' ? '#ef4444' : 
                    job.status === 'paused' ? '#f59e0b' : '#888'
                  }`
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 500,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{job.provider}</span>
                      <span style={{ 
                        fontSize: 10, 
                        color: job.status === 'failed' ? '#ef4444' : '#888',
                        textTransform: 'uppercase'
                      }}>
                        {job.status}
                      </span>
                    </div>
                    
                    {(job.status === 'processing' || job.status === 'pending' || job.status === 'paused') && (
                      <div style={{ marginTop: 6, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${job.progress || 0}%`, 
                          background: job.status === 'paused' ? '#f59e0b' : '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                    
                    {job.error && (
                      <div style={{
                        fontSize: 10,
                        color: '#ef4444',
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {job.error}
                      </div>
                    )}
                  </div>
                  
                  {(job.status === 'pending' || job.status === 'processing' || job.status === 'paused') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        job.status === 'paused' ? handleJobResume(job.id) : handleJobPause(job.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 4,
                        color: '#fff',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {job.status === 'paused' ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
