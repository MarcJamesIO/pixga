// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { isSupported } from "firebase/analytics";
import { setLogLevel } from "firebase/app";

// Set Firebase logging to 'silent' to suppress all logs
setLogLevel("silent");
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE10fM7-QWCFOBPQXhvfH6DX7a1P6fQQ4",
  authDomain: "pixga-e854f.firebaseapp.com",
  projectId: "pixga-e854f",
  storageBucket: "pixga-e854f.appspot.com",
  messagingSenderId: "347884982674",
  appId: "1:347884982674:web:ba5c99ceae541b00b5f14b",
  measurementId: "G-K7WY3YMZNZ",
};
//
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// Initialize Analytics only if on the client-side
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      // const analytics = getAnalytics(app);
    }
  });
}

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  db,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  storage,

  // analytics,
  analytics,
};
