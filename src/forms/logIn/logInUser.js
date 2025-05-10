import { renderLogInForm } from "./renderLodInForm.js";
import { firebase, renderMainPage, encryptPassword, decryptPassword } from "../../index.js";
import { USERS_COLLECTION_NAME, ROOT_ELEMENT } from "../../constants.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";

export function logInUser(container) {
    renderLogInForm(container);
    const form = document.forms.logIn;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formsElements = event.target.elements;

        const nicknameInput = formsElements.username;
        const passwordInput = formsElements.password;
        const emailInput = formsElements.email;

        let user;
        const allInputs = [nicknameInput, passwordInput, emailInput];

        try {
            user = await firebase.lodinUser(emailInput.value, passwordInput.value)
            submitSuccessHandle(allInputs)
        } catch (error) {
            submitErrorHandle(allInputs);
        }

        console.log(user)

        // const decryptedPassword = decryptPassword(user.password);

        // if (nicknameInput.value !== user.nickname || passwordInput.value !== decryptedPassword) {
        //     submitErrorHandle([nicknameInput, passwordInput]);
        //     return;
        // }

        return;

        this.remove();
        document.querySelector('#container').remove();

        ROOT_ELEMENT.style.overflow = 'hidden';

        const isAdmin = user.isAdmin;
        renderMainPage(isAdmin);
    });
}