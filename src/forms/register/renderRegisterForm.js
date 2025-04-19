import { ROOT_ELEMENT } from "../../constants";
import { logInUser } from "../logIn/logInUser.js";

import styles from '../style.module.css'

export function renderRegisterForm() {
    let container = document.querySelector('#container');
    
    if (!container) {
        container = document.createElement('div');
        container.classList.add(styles.container);
        container.setAttribute('id', 'container');
    }

    const form = `
    <form action="" class=${styles.form} name="register">
          <h2 class=${styles.title}>RentRide</h2>
          <p class=${styles.subtitle}>Create an account</p>

        <div class=${styles.inputGroup}>
            <label for="nickname">Nickname:</label>
            <input type="text" id="nickname" name="nickname" placeholder="Enter your nickname" minlength="2" required>
        </div>

        <div class=${styles.inputGroup}>
            <label for="avatar">Profile Picture:</label>
            <input type="file" id="avatar" name="avatar" accept="image/*" placeholder="Chose your avatar">
        </div>

        <div class=${styles.inputGroup}>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" minlength="4" required value="">
        </div>

         <div class=${styles.inputGroup}>
            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm your password"
                required minlength="4">
        </div>

        <button type="submit" class=${styles.button}>Register</button>
        <p class=${styles.loginText}>Already have an account? <a href="#" class=${styles.loginLink} id="loginLink">Log In</a></p>
    </form>`

    container.insertAdjacentHTML('afterbegin', form);
    ROOT_ELEMENT.appendChild(container);

    ROOT_ELEMENT.style.overflow = 'visible';

    document.getElementById('loginLink').addEventListener('click', () => {
        logInUser(container);
    })
}