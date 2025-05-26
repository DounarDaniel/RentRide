import { registerUser, renderMainPage } from "./src/index.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { PIECE_OF_ADMIN_NICKNAME, ROOT_ELEMENT } from "./src/constants.js";

import './src/global.module.css'

const auth = getAuth();
// todo: сделать предстраницу с лого посередине и кнопочкой при нажатии открыть формы login
onAuthStateChanged(auth, user => {
    if (user) {
        let isAdmin;

        if (user.displayName) {
            isAdmin = user.displayName.includes(PIECE_OF_ADMIN_NICKNAME);
        } else {
            isAdmin = false;
        }

        ROOT_ELEMENT.innerHTML = "";
        ROOT_ELEMENT.style.overflow = 'hidden';
        renderMainPage(isAdmin)
    } else {
        ROOT_ELEMENT.innerHTML = "";
        ROOT_ELEMENT.style.overflow = 'visible';
        registerUser()
    }
})