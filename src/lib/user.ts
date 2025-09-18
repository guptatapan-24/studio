
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: Date;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return {
            uid: userId,
            email: data.email,
            displayName: data.displayName,
            createdAt: data.createdAt.toDate(),
        };
    } else {
        console.warn("No user profile found for UID:", userId);
        return null;
    }
}
