import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function runTest() {
  try {
    const workflowId = "test-workflow-123";
    const testMessage = "Hello from test user 1 " + Date.now();

    console.log(`Signing in as ${process.env.TEST_USER_EMAIL}...`);
    const user1Credential = await signInWithEmailAndPassword(auth, process.env.TEST_USER_EMAIL, process.env.TEST_USER_PASSWORD);
    const user1 = user1Credential.user;
    console.log(`Signed in successfully. UID: ${user1.uid}`);

    console.log(`Sending message to workflow ${workflowId}...`);
    const docRef = await addDoc(collection(db, 'messages'), {
      workflowId,
      senderId: user1.uid,
      senderName: 'Test User 1',
      text: testMessage,
      type: 'message',
      timestamp: serverTimestamp()
    });
    console.log(`Message sent with ID: ${docRef.id}`);

    // Log out user 1 and log in user 2
    await auth.signOut();

    console.log(`Signing in as ${process.env.TEST_USER_2_EMAIL}...`);
    const user2Credential = await signInWithEmailAndPassword(auth, process.env.TEST_USER_2_EMAIL, process.env.TEST_USER_2_PASSWORD);
    const user2 = user2Credential.user;
    console.log(`Signed in successfully. UID: ${user2.uid}`);

    // Wait a brief moment to ensure server timestamp is applied and indexes update
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Fetching messages for workflow ${workflowId}...`);
    const q = query(
      collection(db, 'messages'),
      where('workflowId', '==', workflowId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    let found = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.text === testMessage) {
        found = true;
        console.log(`✅ FOUND MESSAGE from user2's perspective: "${data.text}" by ${data.senderName} at ${data.timestamp?.toDate()}`);
      }
    });

    if (!found) {
      console.error(`❌ ERROR: Could not find the message sent by user 1.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

runTest();
