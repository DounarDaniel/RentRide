import { renderRegisterForm } from "./renderRegisterForm.js";
import { firebase, encryptPassword, initMap, createTransportContainer, renderPopUp } from "../../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID, DEFAULT_AVATAR, ROOT_ELEMENT } from "../../constants.js";

import styles from '../style.module.css'

export function registerUser() {
    renderRegisterForm();
    const form = document.forms.register;

    form.addEventListener('submit', async function (event) {
        event.preventDefault()

        const form = event.target
        const formsElements = form.elements;

        const passwordInput = formsElements.password;
        const confirmPasswordInput = formsElements.confirm_password;
        const nicknameInput = formsElements.nickname;

        const avatarInput = formsElements.avatar;
        let avatar;

        if (!avatarInput.files[0]) {
            avatar = DEFAULT_AVATAR;
        } else {
            avatar = URL.createObjectURL(avatarInput.files[0])
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordInput.classList.add(styles.error);
            confirmPasswordInput.classList.add(styles.error);
            return;
        } else {
            passwordInput.classList.add(styles.successfull);
            confirmPasswordInput.classList.add(styles.successfull);
        }

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const isNicknameUnique = !usersList.some(user =>
            user.nickname.toLowerCase() === nicknameInput.value.toLowerCase()
        );

        if (!isNicknameUnique) {
            nicknameInput.classList.add(styles.error);
            return;
        } else {
            nicknameInput.classList.add(styles.error);
        }

        const userId = new Date().getTime() + nicknameInput.value;
        localStorage.setItem('userId', userId);

        const exampleOfPieceOfAdminPassword = 'adminLK0'
        const isAdmin = !!passwordInput.value.includes(exampleOfPieceOfAdminPassword)

        const encryptedPassword = encryptPassword(passwordInput.value)

        const firebaseUserData = {
            isAdmin,
            avatar,
            id: userId,
            nickname: nicknameInput.value,
            password: encryptedPassword,
        }

        firebase.addDataToFirebase(USERS_COLLECTION_NAME, USERS_DOC_ID, 'users', firebaseUserData);

        this.remove();
        document.querySelector('#container').remove();

        ROOT_ELEMENT.style.overflow = 'hidden';
        initMap();
        createTransportContainer();
        renderPopUp();
    })
}

