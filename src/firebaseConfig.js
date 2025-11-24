import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9_Ech69TlN2Iw6fNuJFrxD2FnGY9EC2I",
  authDomain: "smiling-rhythm-458113-p4.firebaseapp.com",
  projectId: "smiling-rhythm-458113-p4",
  storageBucket: "smiling-rhythm-458113-p4.firebasestorage.app",
  messagingSenderId: "506882005035",
  appId: "1:506882005035:web:e84a505c5b23e857f2726e",
  measurementId: "G-YTS90D3VHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);