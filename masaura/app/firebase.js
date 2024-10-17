// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // If using Firestore
import { getStorage } from 'firebase/storage';     // If using Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-kDIHhX9SJV1PP6bv_96b05tPnI8DVDI",
  authDomain: "masaura-2c961.firebaseapp.com",
  projectId: "masaura-2c961",
  storageBucket: "masaura-2c961.appspot.com",
  messagingSenderId: "801830439600",
  appId: "1:801830439600:web:2440ea11410a5a38f5c975",
  measurementId: "G-DQV0TPB58J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services you want to use
const auth = getAuth(app);
const db = getFirestore(app); // Firestore
const storage = getStorage(app); // Storage

export { auth, db, storage };
