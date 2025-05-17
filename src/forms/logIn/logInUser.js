import { renderLogInForm } from "./renderLodInForm.js";
import { firebaseAuth } from "../../index.js";
import { ROOT_ELEMENT } from "../../constants.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";

export function logInUser(container = null) {
    renderLogInForm(container);
    const form = document.forms.logIn;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formsElements = event.target.elements;

        const passwordInput = formsElements.password;
        const emailInput = formsElements.email;

        const allInputs = [passwordInput, emailInput];

        try {
            await firebaseAuth.lodinUser(emailInput.value, passwordInput.value);
            submitSuccessHandle(allInputs);
        } catch (error) {
            submitErrorHandle(allInputs);
        }

        ROOT_ELEMENT.style.overflow = 'hidden';
    });
}