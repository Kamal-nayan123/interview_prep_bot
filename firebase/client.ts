import {getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyArfwe-wCwVKWzOoAOcUS7w8U9rqp_rYMY",
  authDomain: "prepwise-72618.firebaseapp.com",
  projectId: "prepwise-72618",
  storageBucket: "prepwise-72618.firebasestorage.app",
  messagingSenderId: "728706300631",
  appId: "1:728706300631:web:cb17bcabd08245615a4e92",
  measurementId: "G-4KCDRX8R9G"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db=getFirestore(app);
