import { drawRegisterForm } from "./drawRegisterForm.js";
import { firebase } from "../index.js";
import { USERS_COLLECTION_NAME, USERS_DOC_ID } from "../constants.js";

export function registerUser() {
    drawRegisterForm();
    const form = document.forms.register;

    // const form = drawRegisterForm();
    // функция отрисовывает форму и возвращает её элемент

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formsElements = event.target.elements;

        const passwordInput = formsElements.password;
        const confirmPasswordInput = formsElements.confirm_password;
        const nicknameInput = formsElements.nickname;

        if (passwordInput.value != confirmPasswordInput.value) {
            passwordInput.style.borderColor = 'red';
            confirmPasswordInput.style.borderColor = 'red';
        }

        const usersData = await firebase.getDoc(USERS_COLLECTION_NAME, USERS_DOC_ID);
        const usersList = usersData.users;

        const isNicknameUnique = !usersList.some(user =>
            user.nickname.toLowerCase() === nicknameInput.value.toLowerCase()
        );

        if(!isNicknameUnique){
            nicknameInput.style.borderColor = 'red';
        }

        console.log(isNicknameUnique)

        console.log(event.target.elements)
    })
}