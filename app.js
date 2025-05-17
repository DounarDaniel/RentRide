import { registerUser, renderMainPage } from "./src/index.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { ROOT_ELEMENT } from "./src/constants.js";

import './src/general.module.css'

const auth = getAuth();
onAuthStateChanged(auth, user => {
    if (user) {
        ROOT_ELEMENT.innerHTML = "";
        ROOT_ELEMENT.style.overflow = 'hidden';
        renderMainPage(true)
    } else {
        ROOT_ELEMENT.innerHTML = "";
        ROOT_ELEMENT.style.overflow = 'visible';
        registerUser()
    }
})