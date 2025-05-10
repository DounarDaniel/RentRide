import styles from './popUp.module.css'
import { renderPopUp } from './renderPopUp';

export function triggerPopUp({ title, text }) {
    let popUp = document.querySelector('#popUp');

    if (!popUp) {
        popUp = renderPopUp();
    }

    const popUpText = document.querySelector('#popUpText');
    const popUpTitle = document.querySelector('#popUpTitle');

    popUpText.textContent = text;
    popUpTitle.textContent = title;

    popUp.classList.add(styles.active);
}