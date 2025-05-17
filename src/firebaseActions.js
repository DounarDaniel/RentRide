import { FIREBASE_CONFIG } from "./constants.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, collection, getDoc, updateDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"

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

    async addDoc(collectionName, data) {
        try {
            const firebaseCollection = collection(db, collectionName);
            const docRef = await addDoc(firebaseCollection, data);

            return docRef.id;
        } catch (error) {
            console.error("Error in adding document!", error);
        }
    }

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
    async createUser(email, password) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        return user
    }

    async lodinUser(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user
        return user
    }

    async logoutUser() {
        console.log(await signOut(auth))
    }
}

export const firebaseFirestore = new FirebaseFirestoreService();
export const firebaseAuth = new FirebaseAuthService();
