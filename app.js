import { initMap, createTransportContainer, registerUser } from "./src/index.js";

const userData = JSON.parse(localStorage.getItem('userData'));

if (!userData || !userData.isLoged) {
    registerUser()  
} else {
    initMap();
    createTransportContainer();
}
