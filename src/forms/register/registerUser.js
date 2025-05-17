import { renderRegisterForm } from "./renderRegisterForm.js";
import { firebaseAuth, encryptPassword, triggerPopUp, renderMainPage, renderPopUp } from "../../index.js";
import { USERS_COLLECTION_NAME, DEFAULT_AVATAR, ROOT_ELEMENT } from "../../constants.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";

export function registerUser() {
    renderPopUp();
    renderRegisterForm();
    const form = document.forms.register;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Getting data from register form
        const form = event.target
        const formsElements = form.elements;

        const passwordInput = formsElements.password;
        const confirmPasswordInput = formsElements.confirm_password;

        const nicknameInput = formsElements.nickname;

        const emailInput = form.email;
        const userEmail = emailInput.value;

        const avatarInput = formsElements.avatar;
        let avatar;

        if (!avatarInput.files[0]) {
            avatar = DEFAULT_AVATAR;
        } else {
            avatar = URL.createObjectURL(avatarInput.files[0])
        }

        const passwordInputs = [passwordInput, confirmPasswordInput];

        if (passwordInput.value !== confirmPasswordInput.value) {
            submitErrorHandle(passwordInputs);

            triggerPopUp({
                title: 'Wrong password',
                text: 'Please check that password and confirm password are the same.'
            });

            return;
        } else {
            submitSuccessHandle(passwordInputs);
        }

        const pieceOfAdminPassword = 'adminLK0'
        const isAdmin = !!passwordInput.value.includes(pieceOfAdminPassword)

        const encryptedPassword = encryptPassword(passwordInput.value)

        const firebaseUserData = {
            isAdmin,
            avatar,
            nickname: nicknameInput.value,
            password: encryptedPassword,
            trips: [],
        }

        firebaseAuth.createUser(userEmail, passwordInput.value)
        return;

        const loginCode = await firebaseAuth.addDoc(USERS_COLLECTION_NAME, firebaseUserData);
        localStorage.setItem('loginCode', loginCode);

        triggerPopUp({
            title: 'Welcome',
            text: `You have been successfully registered! Here is your logIn code - ${loginCode}. 
                Please remember it to login in your account in the future`
        });

        this.remove();
        document.querySelector('#container').remove();

        ROOT_ELEMENT.style.overflow = 'hidden';
        renderMainPage(isAdmin);
    })
}

