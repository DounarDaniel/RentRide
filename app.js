<<<<<<< HEAD
<<<<<<< HEAD
import { initMap, createTransportContainer, registerUser, logInUser } from "./src/index.js";
=======
import { initMap, createTransportContainer, registerUser } from "./src/index.js";
import { logInUser } from "./src/index.js";
>>>>>>> 5b577db (fit: add lodIn form logic)
=======
import { initMap, createTransportContainer, registerUser, logInUser } from "./src/index.js";
>>>>>>> 73b50af (redesigned the project architecture)

const userId = localStorage.getItem('userId');

<<<<<<< HEAD
<<<<<<< HEAD
if (!userId) {
<<<<<<< HEAD
    registerUser()
=======
    registerUser()  
>>>>>>> 4363412 (added user registration logic)
=======
if (!userId) {
<<<<<<< HEAD
    registerUser()  
>>>>>>> 73b50af (redesigned the project architecture)
=======
    registerUser()
>>>>>>> d94e188 (fix bug with removing forms)
} else {
    initMap();
    createTransportContainer();
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
// if (!userId) {
//     registerUser()  
// } else {
//     initMap();
//     createTransportContainer();
// }

console.log(logInUser())
>>>>>>> 5b577db (fit: add lodIn form logic)
=======

logInUser()
>>>>>>> 73b50af (redesigned the project architecture)
=======
>>>>>>> d94e188 (fix bug with removing forms)
