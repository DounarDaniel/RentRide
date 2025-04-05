import { drawRegisterForm } from "./drawRegisterForm.js";
import { firebase, encryptPassword, decryptPassword } from "../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID, DEFAULT_AVATAR } from "../constants.js";
import { drawLogInForm } from './drawLodInForm.js'

export function registerUser() {
    drawRegisterForm();
    const form = document.forms.register;

    // const form = drawRegisterForm();
    // функция отрисовывает форму и возвращает её элемент

    form.addEventListener('submit', async function (event) {
        event.preventDefault()

        const formsElements = event.target.elements;

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
            passwordInput.style.borderColor = 'red';
            confirmPasswordInput.style.borderColor = 'red';
            return;
        } else {
            passwordInput.style.borderColor = 'green';
            confirmPasswordInput.style.borderColor = 'green';
        }

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const isNicknameUnique = !usersList.some(user =>
            user.nickname.toLowerCase() === nicknameInput.value.toLowerCase()
        );

        if (!isNicknameUnique) {
            nicknameInput.style.borderColor = 'red';
            return;
        } else {
            nicknameInput.style.borderColor = 'green';
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
    })
}

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
            return user;
        }
    });
}