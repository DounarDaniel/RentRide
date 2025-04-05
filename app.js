import { initMap, createTransportContainer, registerUser } from "./src/index.js";

const userId = localStorage.getItem('userId');

if (!userId) {
    registerUser()  
} else {
    initMap();
    createTransportContainer();
}
