import { initMap, createTransportContainer, registerUser, logInUser } from "./src/index.js";

const userId = localStorage.getItem('userId');

if (!userId) {
    registerUser()
} else {
    initMap();
    createTransportContainer();
}
