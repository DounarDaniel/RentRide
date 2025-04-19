import styles from '../style.module.css'
import { registerUser } from '../register/registerUser.js';

export function renderLogInForm(container) {
    const form = `
    <form action="" method="GET" class=${styles.form} name="logIn">
        <h2 class=${styles.title}>RentRide</h2>
        <p class=${styles.subtitle}>Log In</p>

        <div class=${styles.inputGroup}>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Username" required>
        </div>

        <div class=${styles.inputGroup}>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
            <button type="button" class=${styles.togglePassword}>
                <img src="./visibility_off.png" alt="closeEye">
            </button>
        </div>

        <button type="submit">Sign In</button>
        <p class=${styles.loginText}>No account? <a href="#" class=${styles.loginLink} id="registerLink">Create an account</a></p>
    </form>`

    if (document.forms.length > 0 && !!document.forms.register) {
        document.forms.register.remove();
    }

    container.insertAdjacentHTML('afterbegin', form);

    document.getElementById('registerLink').addEventListener('click', () => {
        document.forms.logIn.remove();
        registerUser();
    })

    // const passwordInput = document.getElementById("password");
    // const toggleButton = document.getElementById("togglePassword");

    // toggleButton.addEventListener("click", function () {
    //     const openEye = `<img src="./visibility_off.png" alt="openEye">`;
    //     const closeEye = `<img src="./visibility.png" alt="closeEye">`;

    //     if (passwordInput.type === "password") {
    //         if (toggleButton.children.length > 0) {
    //             toggleButton.innerHTML = "";
    //         }
    //         passwordInput.type = "text";
    //         toggleButton.insertAdjacentHTML('afterbegin', openEye);
    //     } else {
    //         if (toggleButton.children.length > 0) {
    //             toggleButton.innerHTML = "";
    //         }
    //         passwordInput.type = "password";
    //         toggleButton.insertAdjacentHTML('afterbegin', closeEye);
    //     }
    // });
}