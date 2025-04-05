import { ROOT_ELEMENT } from "../../constants.js";

export function drawLogInForm() {
    ROOT_ELEMENT.insertAdjacentHTML('beforeend', `
    <div class="container">
        <form action="" method="GET" class="form" name="logIn">
            <h2 class="title">RentRide</h2>
            <p class="subtitle">Log In</p>

            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Username" required>
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>

            <button type="submit">Sign In</button>
            <p class="login-text">No account? <a href="#" class="login-link">Create an account</a></p>
        </form>
    </div>`)
}