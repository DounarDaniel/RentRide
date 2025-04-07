import { drawLogInForm } from './drawLodInForm.js';
import { firebase, decryptPassword, initMap, createTransportContainer } from "../../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID } from "../../constants.js";

export function logInUser() {
    drawLogInForm();
    const form = document.forms.logIn;

    // const form = drawLogInForm();
    // функция отрисовывает форму и возвращает её элемент, потом надо будет доделать

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formsElements = event.target.elements;

        const usernameInput = formsElements.username;
        const passwordInput = formsElements.password;

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const user = usersList.find(user => user.nickname === usernameInput.value);

        if (!user) {
            usernameInput.style.borderColor = 'red';
            console.warn('Error in username');
            return;
        }

        const decryptedPassword = decryptPassword(user.password)

        if (decryptedPassword !== passwordInput.value) {
            passwordInput.style.borderColor = 'red';
            console.warn('Error in password');
            return;
        } else {
            passwordInput.style.borderColor = 'green';
        }

        localStorage.setItem('userId', user.id);
        form.remove();
        initMap();
        createTransportContainer();
    });
}