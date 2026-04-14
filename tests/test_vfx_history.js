import { createJob, updateJobStatus, getJob } from '../lib/api/services/jobTrackerService.js';
import admin from 'firebase-admin';

async function runTest() {
  console.log('🧪 Testing VFX Job History (Firestore)...');
  
  // Check if Firebase is initialized, otherwise it will use memory fallback
  const isFirebaseMode = admin.apps.length > 0;
  console.log(`Mode: ${isFirebaseMode ? 'Firebase Firestore' : 'Memory Fallback'}`);
  
  try {
    // 1. Create a job
    const provider = 'test-provider';
    const initialData = { 
      payload: { prompt: 'A futuristic city' },
      userId: 'test-user-123'
    };
    
    console.log('1. Creating job...');
    const job = await createJob(provider, initialData);
    console.log('✅ Job created:', job.id);
    
    // 2. Update job status
    console.log('2. Updating job status...');
    await updateJobStatus(job.id, { 
      status: 'processing', 
      progress: 50 
    });
    console.log('✅ Job status updated');
    
    // 3. Retrieve job and verify
    console.log('3. Retrieving job...');
    const retrievedJob = await getJob(job.id);
    
    if (!retrievedJob) {
      throw new Error('Failed to retrieve job');
    }
    
    console.log('✅ Job retrieved');
    if (retrievedJob.status !== 'processing' || retrievedJob.progress !== 50) {
      throw new Error('Job data mismatch');
    }
    
    // 4. Finalize job
    console.log('4. Finalizing job...');
    await updateJobStatus(job.id, { 
      status: 'completed', 
      progress: 100,
      resultUrl: 'https://example.com/result.mp4'
    });
    
    const finalJob = await getJob(job.id);
    console.log('✅ Job finalized');
    
    if (finalJob.status !== 'completed' || finalJob.resultUrl !== 'https://example.com/result.mp4') {
      throw new Error('Final job data mismatch');
    }
    
    console.log('\n✨ VFX Job History test PASSED');
    
  } catch (error) {
    console.error('\n❌ VFX Job History test FAILED');
    console.error(error);
    process.exit(1);
  }
}

runTest();
