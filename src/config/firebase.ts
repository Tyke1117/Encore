import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAW9FCsSAtIRjhDli75AVNY7OA3BvB9fRA",
  authDomain: "encore-6a677.firebaseapp.com",
  projectId: "encore-6a677",
  storageBucket: "encore-6a677.firebasestorage.app",
  messagingSenderId: "583541227315",
  appId: "1:583541227315:android:d846efc4fce5db532b0846"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default firebaseConfig;
