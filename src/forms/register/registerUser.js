import { drawRegisterForm } from "./drawRegisterForm.js";
<<<<<<< HEAD
import { firebase, encryptPassword, initMap, createTransportContainer } from "../../index.js";
=======
import { firebase, encryptPassword } from "../../index.js";
>>>>>>> 73b50af (redesigned the project architecture)
import { USERS_COLLECTION_NAME, USERS_DOC_ID, DEFAULT_AVATAR } from "../../constants.js";

export function registerUser() {
    drawRegisterForm();
    const form = document.forms.register;

    // const form = drawRegisterForm();
    // функция отрисовывает форму и возвращает её элемент

    form.addEventListener('submit', async function (event) {
        event.preventDefault()

<<<<<<< HEAD
        const form = event.target
        const formsElements = form.elements;
=======
        const formsElements = event.target.elements;
>>>>>>> 73b50af (redesigned the project architecture)

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
<<<<<<< HEAD
        form.remove();
        initMap();
        createTransportContainer();
=======
>>>>>>> 73b50af (redesigned the project architecture)
    })
}

