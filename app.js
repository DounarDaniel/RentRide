import { registerUser, renderMainPage } from "./src/index.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { MAP_OPTIONS, PIECE_OF_ADMIN_NICKNAME, ROOT_ELEMENT } from "./src/constants.js";
import { darkMapStyle, lightMapStyle } from "./src/mapStyles.js";

import './src/global.module.css'

const currentTheme = localStorage.getItem('theme') || 'light';
const documentElement = document.documentElement;

if (currentTheme === 'dark') {
    documentElement.setAttribute('data-theme', 'dark');
    MAP_OPTIONS.styles = darkMapStyle;
} else {
    documentElement.setAttribute('data-theme', 'light');
    MAP_OPTIONS.styles = lightMapStyle;
}

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