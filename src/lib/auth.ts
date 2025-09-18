"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export async function signUp(email: string, password: string):Promise<{error?: string}> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a new document in the 'users' collection with the user's UID
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
    });

    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signIn(email: string, password: string):Promise<{error?: string}> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
}
