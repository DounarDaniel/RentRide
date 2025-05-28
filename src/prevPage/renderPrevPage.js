import { ROOT_ELEMENT } from '../constants.js';
import { registerUser, logInUser } from '../index.js';

import styles from './prevPage.module.css'

export function renderPrevPage() {
    const prevPage = `
    <div class=${styles.wrapper}>
        <div class=${styles.bubbles}>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
            <div class=${styles.bubble}></div>
        </div>

        <div class=${styles.container}>
            <div class=${styles.iconWrapper}>
                <div class=${styles.icon}></div>
            </div>

            <h1 class=${styles.title}>Добро пожаловать</h1>
            <div class=${styles.buttons}>
                <button class="${styles.btn}" id="loginBtn">Войти</button>
                <button class="${styles.btn}" id="registerBtn">Зарегистрироваться</button>
            </div>
        </div>
    </div>
    `

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', prevPage);

    const bubblesContainer = document.querySelector(`.${styles.bubbles}`);

    const intervalId = setInterval(() => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 3}s`;

        bubble.addEventListener('click', (event) => {
            event.target.remove();
        })

        bubblesContainer.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 11000);
    }, 900);

    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');
    const prevPageWrapper = document.querySelector(`.${styles.wrapper}`);

    loginBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        prevPageWrapper.remove();
        logInUser();
    });

    registerBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        prevPageWrapper.remove();
        registerUser();
    });
}