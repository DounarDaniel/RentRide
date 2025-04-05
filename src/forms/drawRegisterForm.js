import { ROOT_ELEMENT } from "../constants";

// потом надо будет переделать, пока что это функция-заглушка
export function drawRegisterForm(){
    ROOT_ELEMENT.insertAdjacentHTML('beforeend', `
    <div class="container">
        <form action="" class="form" name="register">
            <h2 class="title">RentRide</h2>
            <p class="subtitle">Create an account</p>

            <div class="input-group">
                <label for="nickname">Nickname:</label>
                <input type="text" id="nickname" name="nickname" placeholder="Enter your nickname" minlength="2" required>
            </div>

            <div class="input-group">
                <label for="avatar">Profile Picture:</label>
                <input type="file" id="avatar" name="avatar" accept="image/*" placeholder="Chose your avatar">
            </div>

            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" minlength="4" required>
            </div>

            <div class="input-group">
                <label for="confirm_password">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm your password"
                    required minlength="4">
            </div>

            <button type="submit">Register</button>
            <p class="login-text">Already have an account? <a href="#" class="login-link">Log In</a></p>
        </form>
    </div>`)
}