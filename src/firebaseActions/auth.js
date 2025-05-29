import { FIREBASE_CONFIG } from "../constants.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

class FirebaseAuthService {
    async createUser(email, password, profileInfo) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        await this.updateUserProfile(user, profileInfo);

        return user
    }

    async updateUserProfile(user, profileInfo){
        await updateProfile(user, profileInfo);
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

export const firebaseAuth = new FirebaseAuthService();
