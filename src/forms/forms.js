import { drawRegisterForm } from "./drawRegisterForm.js";
import { firebase } from "../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID } from "../constants.js";

export function registerUser() {
    drawRegisterForm();
    const form = document.forms.register;

    // const form = drawRegisterForm();
    // функция отрисовывает форму и возвращает её элемент

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        const formsElements = event.target.elements;

        const passwordInput = formsElements.password;
        const confirmPasswordInput = formsElements.confirm_password;
        const nicknameInput = formsElements.nickname;

        const avatarInput = formsElements.avatar;
        const avatar = URL.createObjectURL(avatarInput.files[0]);

        if (passwordInput.value != confirmPasswordInput.value) {
            passwordInput.style.borderColor = 'red';
            confirmPasswordInput.style.borderColor = 'red';
            return;
        }

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const isNicknameUnique = !usersList.some(user =>
            user.nickname.toLowerCase() === nicknameInput.value.toLowerCase()
        );

        if(!isNicknameUnique){
            nicknameInput.style.borderColor = 'red';
            return;
        }

        const userId = new Date().getTime() + nicknameInput.value;
        localStorage.setItem('userData', userId);

        const exampleOfPieceOfAdminPassword = 'adminLK0'
        const isAdmin = !!passwordInput.value.includes(exampleOfPieceOfAdminPassword)

        const firebaseUserData = {
            isAdmin,
            avatar,
            userId,
            nickname: nicknameInput.value,
            password: passwordInput.value,
        }

        firebase.addDataToFirebase(USERS_COLLECTION_NAME, USERS_DOC_ID, 'users', firebaseUserData);
    })
}