import { ROOT_ELEMENT } from '../../constants.js';
import { createAndAppendFormContainer } from '../createFormContainer.js';
import { registerUser } from '../register/registerUser.js';

import styles from '../style.module.css'

export function renderLogInForm() {
    const container = createAndAppendFormContainer();
    ROOT_ELEMENT.style.overflow = 'visible';

    const form = `
    <form action="" method="GET" class=${styles.form} name="logIn">
        <h2 class=${styles.title}>RentRide</h2>
        <p class=${styles.subtitle}>Log In</p>

        <div class=${styles.inputGroup}>
            <label for="email">Email*</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required>
            <p class=${styles.infoText}></p>
        </div>

        <div class=${styles.inputGroup}>
            <label for="password">Password*</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
            <p class=${styles.infoText}></p>
        </div>

        <button type="submit" class=${styles.button}>Sign In</button>
        <p class=${styles.loginText}>No account? <a href="#" class=${styles.loginLink} id="registerLink">Create an account</a></p>
    </form>`

    container.insertAdjacentHTML('afterbegin', form);

    document.getElementById('registerLink').addEventListener('click', () => {
        document.forms.logIn.remove();
        registerUser();
    })
}