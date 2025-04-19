import { initMap, createTransportContainer, registerUser, logInUser, renderPopUp, renderHeader } from "./src/index.js";

const userId = localStorage.getItem('userId');
renderPopUp();

if (!userId) {
    registerUser()
} else {
    initMap();
    createTransportContainer();
    renderHeader();
}
