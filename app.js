import { initMap, createTransportContainer, registerUser, logInUser, renderPopUp } from "./src/index.js";

const userId = localStorage.getItem('userId');
renderPopUp();

if (!userId) {
    registerUser()
} else {
    initMap();
    createTransportContainer();
}
