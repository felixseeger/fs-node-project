import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  // need to grab env from api or frontend .env
};
// actually, I can just use playwright to run a script in the browser console of User A to query firestore!
