import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuRLeR5S7xaU2Ieymb9BedCs0IWu16GaU",
  authDomain: "golf-game-17243678-9965e.firebaseapp.com",
  projectId: "golf-game-17243678-9965e",
  storageBucket: "golf-game-17243678-9965e.appspot.com",
  messagingSenderId: "155274901018",
  appId: "1:155274901018:web:61fd6bf46fc6f7335e43a3",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
