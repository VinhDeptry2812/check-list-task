import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Firebase configuration từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDDM1i1nBbgPdrPLVd0zmqwem6cGJ1j4SQ",
  authDomain: "checklist-ban-hang.firebaseapp.com",
  projectId: "checklist-ban-hang",
  storageBucket: "checklist-ban-hang.firebasestorage.app",
  messagingSenderId: "305854036121",
  appId: "1:305854036121:web:05b8caff7da0d1a3372008",
  measurementId: "G-1T426EVVGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInAnonymously, onAuthStateChanged, doc, setDoc, getDoc, onSnapshot };
