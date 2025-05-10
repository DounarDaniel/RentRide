import { registerUser, renderMainPage } from "./src/index.js";
import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"

import './src/general.module.css'

const auth = getAuth();
onAuthStateChanged(auth, user => {
    if (!user) {
        registerUser()
    } else {
        renderMainPage()
    }
})

// else {
//     let userData;
//     let isAdmin = false;

//     firebase.getDoc(USERS_COLLECTION_NAME, loginCode)
//         .then(data => userData = data)
//         .then(userData => isAdmin = userData.isAdmin)
//         .then(isAdmin => renderMainPage(isAdmin))
//         .catch(error => {
//             console.error(error);
//             registerUser();
//         });
// }
