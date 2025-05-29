import { renderPrevPage, renderMainPage } from "./src/index.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { DOCUMENT_ELEMENT, MAP_OPTIONS, PIECE_OF_ADMIN_NICKNAME, ROOT_ELEMENT } from "./src/constants.js";
import { darkMapStyle, lightMapStyle } from "./src/mapStyles.js";

import './src/global.module.css'

// Получение основного шрифта
const defaultMainFont = 'Montserrat Alternates'
const currentMainFont = localStorage.getItem('main-font') || defaultMainFont;

if (currentMainFont === defaultMainFont || !currentMainFont) {
    DOCUMENT_ELEMENT.setAttribute('main-font', defaultMainFont);
} else {
    DOCUMENT_ELEMENT.setAttribute('main-font', currentMainFont);
}

// Получение основного цвета
const currentMainColor = localStorage.getItem('main-color') || 'blue';

if (currentMainColor === 'blue' || !currentMainColor) {
    DOCUMENT_ELEMENT.setAttribute('main-color', 'blue');
} else {
    DOCUMENT_ELEMENT.setAttribute('main-color', currentMainColor);
}

// Получение текущей темы
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    DOCUMENT_ELEMENT.setAttribute('data-theme', 'dark');
    MAP_OPTIONS.styles = darkMapStyle;
} else {
    DOCUMENT_ELEMENT.setAttribute('data-theme', 'light');
    MAP_OPTIONS.styles = lightMapStyle;
}

// Получение пользователя
const auth = getAuth();
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

        const isOnTrip = localStorage.getItem('isOnTrip') || false;
        renderMainPage(isAdmin, isOnTrip)
    } else {
        ROOT_ELEMENT.innerHTML = "";
        ROOT_ELEMENT.style.overflow = 'visible';
        renderPrevPage();
    }
})