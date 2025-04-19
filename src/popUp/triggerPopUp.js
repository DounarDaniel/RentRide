import styles from './popUp.module.css'

export function triggerPopUp({ title, text }) {
    const popUp = document.querySelector('#popUp');
    const popUpText = document.querySelector('#popUpText');
    const popUpTitle = document.querySelector('#popUpTitle');

    popUpText.textContent = text;
    popUpTitle.textContent = title;

    popUp.classList.add(styles.active);
}