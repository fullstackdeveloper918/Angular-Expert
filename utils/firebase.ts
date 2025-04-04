// utils/firebase.ts

// Firebase v9+ modular imports
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import necessary methods from firebase/storage
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';  // Import necessary methods from firebase/firestore

// Firebase configuration object (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyA7GpxmHUqofA_rSTAsOJJNsxTCK6YdTEU",
  authDomain: "new-craftsmen.firebaseapp.com",
  databaseURL: "https://new-craftsmen-default-rtdb.firebaseio.com",
  projectId: "new-craftsmen",
  storageBucket: "new-craftsmen.firebasestorage.app",
  messagingSenderId: "395444933967",
  appId: "1:395444933967:web:f710a557b45bc787c2613a",
  measurementId: "G-L5M5S24N54"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

// Export necessary services and functions
export { 
  auth, 
  setPersistence, 
  browserLocalPersistence, 
  signInWithEmailAndPassword, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  firestore, 
  collection, 
  addDoc, 
  serverTimestamp 
};
