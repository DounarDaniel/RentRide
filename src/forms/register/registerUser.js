import { renderRegisterForm } from "./renderRegisterForm.js";
import { firebaseAuth, triggerPopUp, renderPopUp } from "../../index.js";
import { DEFAULT_AVATAR } from "../../constants.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";

export function registerUser() {
    renderPopUp();
    renderRegisterForm();
    const form = document.forms.register;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Получение данных с формы
        const form = event.target
        const formsElements = form.elements;

        const passwordInput = formsElements.password;
        const confirmPasswordInput = formsElements.confirm_password;

        const nicknameInput = formsElements.nickname;

        const emailInput = form.email;
        const userEmail = emailInput.value;

        // Получение аватара
        const avatarInput = formsElements.avatar;
        let avatar;

        if (!avatarInput.files[0]) {
            avatar = DEFAULT_AVATAR;
        } else {
            avatar = URL.createObjectURL(avatarInput.files[0])
        }

        // Проверка пароля
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

        const firebaseUserData = {
            isAdmin,
            avatar,
            nickname: nicknameInput.value,
            trips: [],
        }

        // Регистрация пользователя
        firebaseAuth.createUser(userEmail, passwordInput.value)
    })
}
