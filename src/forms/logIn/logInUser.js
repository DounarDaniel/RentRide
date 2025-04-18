import { renderLogInForm } from "./renderLodInForm.js";
import { firebase, decryptPassword, renderMainPage } from "../../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID, ROOT_ELEMENT } from "../../constants.js";

import styles from '../style.module.css'

export function logInUser(container) {
    renderLogInForm(container);
    const form = document.forms.logIn;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formsElements = event.target.elements;

        const usernameInput = formsElements.username;
        const passwordInput = formsElements.password;

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const user = usersList.find(user => user.nickname === usernameInput.value);
        const decryptedPassword = decryptPassword(user.password);

        if (!user || decryptedPassword !== passwordInput.value) {
            usernameInput.classList.add(styles.error);
            passwordInput.classList.add(styles.error);
            return;
        }

        localStorage.setItem('userId', user.id);

        this.remove();
        document.querySelector('#container').remove();

        ROOT_ELEMENT.style.overflow = 'hidden';
        renderMainPage();
    });
}