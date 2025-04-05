<<<<<<< HEAD
import { initMap, createTransportContainer, registerUser, logInUser } from "./src/index.js";
=======
import { initMap, createTransportContainer, registerUser } from "./src/index.js";
import { logInUser } from "./src/index.js";
>>>>>>> 5b577db (fit: add lodIn form logic)

// const userId = localStorage.getItem('userId');

<<<<<<< HEAD
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
=======
// if (!userId) {
//     registerUser()  
// } else {
//     initMap();
//     createTransportContainer();
// }

console.log(logInUser())
>>>>>>> 5b577db (fit: add lodIn form logic)
