import { initMap, createTransportContainer, registerUser, logInUser } from "./src/index.js";

const userId = localStorage.getItem('userId');

if (!userId) {
<<<<<<< HEAD
    registerUser()
=======
    registerUser()  
>>>>>>> 4363412 (added user registration logic)
} else {
    initMap();
    createTransportContainer();
}
