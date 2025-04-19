import { registerUser, renderPopUp, renderMainPage } from "./src/index.js";

const userId = localStorage.getItem('userId');
renderPopUp();

if (!userId) {
    registerUser()
} else {
    renderMainPage();
}
