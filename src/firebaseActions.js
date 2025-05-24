import { FIREBASE_CONFIG } from "./constants.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"

const app = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(app);
const auth = getAuth(app);

class FirebaseFirestoreService {
    async getDoc(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.error("Document is undefined");
        }
    };

    async updateDoc(collectionName, docId, updatedFirebaseDoc) {
        const docRef = doc(db, collectionName, docId);

        try {
            await updateDoc(docRef, updatedFirebaseDoc);
        } catch (error) {
            console.error("Error in updating doc:", error);
        }
    };

    async setDoc(collectionName, docId, data) {
        try {
            const firebaseDoc = doc(db, collectionName, docId);
            await setDoc(firebaseDoc, data, { merge: true });
        } catch (error) {
            console.warn('Error in setting data to firebase!', error);
        }
    };
}

class FirebaseAuthService {
    async createUser(email, password, profileInfo) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        await updateProfile(user, profileInfo);

        return user
    }

    getCurrentUser() {
        return auth.currentUser
    }

    async signInUser(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user
        return user
    }

    async logoutUser() {
        await signOut(auth)
    }
}

export const firebaseFirestore = new FirebaseFirestoreService();
export const firebaseAuth = new FirebaseAuthService();
