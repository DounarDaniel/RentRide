import { FIREBASE_CONFIG } from "./constants.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, doc, collection, getDoc, updateDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

class FirebaseService {
    async getDoc(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.warn("Document is undifined!");
            return null;
        }
    };

    async updateDoc(collectionName, docId, updatedFirebaseDoc) {
        const docRef = doc(db, collectionName, docId);

        // const updatedFirebaseDoc = {};
        // updatedFirebaseDoc[propertyName] = firebaseUpdatedData;

        try {
            await updateDoc(docRef, updatedFirebaseDoc);
        } catch (error) {
            console.warn("Error in updating doc:", error);
        }
    };

    async setDoc(collectionName, docId, data) {
        try {
            const doc = doc(db, collectionName, docId)
            await setDoc(doc, data, { merge: true })
        } catch (error) {
            console.warn('Error in setting data to firebase!', error)
        }
    };

    async addDoc(collectionName, data) {
        try {
            const firebaseCollection = collection(db, collectionName);
            await addDoc(firebaseCollection, data);
        } catch (error) {
            console.warn('Error in adding document!', error)
        }
    }

    async addDataToFirebase(collectionName, docId, propertyName, newData) {
        const firebaseDoc = await this.getDoc(collectionName, docId)
        let firebaseData = firebaseDoc[propertyName];

        if (!(Array.isArray(firebaseData)) && typeof firebaseData === 'object' && !Object.keys(firebaseData).length) {
            console.warn('Error in firebaseData.');
            firebaseData = [];
        }

        if (typeof firebaseData === 'undefined') {
            firebaseData = [];
        }

        const isDuplicate = firebaseData.some(item => item.id === newData.id);

        if (isDuplicate) {
            console.warn('Объект с таким ID уже существует');
            return;
        }

        firebaseData.push(newData);

        const updatedFirebaseDoc = {};
        updatedFirebaseDoc[propertyName] = firebaseData;

        this.updateDoc(collectionName, docId, updatedFirebaseDoc);
    };

    async deleteDataFromFirebase(collectionName, docId, propertyName, identifier, itemToDeleteId) {
        const firebaseDoc = await this.getDoc(collectionName, docId);
        let firebaseData = firebaseDoc[propertyName];

        const filteredFirebaseData = firebaseData.filter(item => {
            if (typeof item[identifier] === 'object' && typeof itemToDeleteId === 'object') {
                return JSON.stringify(item[identifier]) !== JSON.stringify(itemToDeleteId);
            }

            return item[identifier] !== itemToDeleteId;
        });

        const updatedFirebaseDoc = {};
        updatedFirebaseDoc[propertyName] = filteredFirebaseData;

        this.updateFirebaseData(collectionName, docId, updatedFirebaseDoc);
    };
}

export const firebase = new FirebaseService();

// Пример использования:
// const transportList = await firebase.getDataFromFirebase(TRANSPORT_COLLECTION_NAME, TRANSPORT_DOC_NAME)

// const newTransport = {
//     name: "car",
//     additional_info: "Max distant: 1km",
//     basic_info: "An electric car IX3",
//     batery: 2,

//     cords: {
//         lat: "11.353",
//         lon: "1.921"
//     },
// }

// firebase.setDataToFirebase(TRANSPORT_COLLECTION_NAME, TRANSPORT_DOC_NAME, 'transportList', newTransport);
// firebase.deleteFirebaseData(TRANSPORT_COLLECTION_NAME, TRANSPORT_DOC_ID, TRANSPORT_DOC_NAME, 'cords', {lat: "11.353", lon: "1.921"});
