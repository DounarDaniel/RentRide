import { renderRegisterForm } from "./renderRegisterForm.js";
import { firebaseAuth, triggerPopUp, renderPopUp, firebaseFirestore } from "../../index.js";
import { DEFAULT_AVATAR, TRIPS_COLLECTION_NAME } from "../../constants.js";
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
            avatar = new Blob(['../../../public/person.png'], { type: 'image/png' });
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

        const profileInfo = {
            displayName: nicknameInput.value,
            photoURL: avatar,
        }

        // Регистрация пользователя
        const user = await firebaseAuth.createUser(userEmail, passwordInput.value, profileInfo);

        // Создание базы данных для поездок пользователя
        await firebaseFirestore.setDoc(TRIPS_COLLECTION_NAME, user.uid, {trips: []});
    })
}
