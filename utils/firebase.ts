// utils/firebase.ts

// Firebase v9+ modular imports
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import necessary methods from firebase/storage
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';  // Import necessary methods from firebase/firestore

// Firebase configuration object (replace with your own config)
const firebaseConfig = {
  apiKey:  "AIzaSyDqYgP14ixdD2V5GKxEi-wiiV7qiMNmSLI",
  authDomain: "nabh-41663.firebaseapp.com",
  databaseURL: "https://nabh-41663-default-rtdb.firebaseio.com",
  projectId: "nabh-41663",
  storageBucket: "nabh-41663.appspot.com",
  messagingSenderId: "720960124468",
  appId: "1:720960124468:web:2e85c1f341f10a5461bc61",
  measurementId: "G-YNTENEH3KR"
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
