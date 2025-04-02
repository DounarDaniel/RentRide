import { ROOT_ELEMENT } from "../constants.js";
import styles from './transportContainer.module.css'

export function createTransportContainer() {
    const transportContainer = document.createElement('section');
    transportContainer.classList.add(styles.transportContainer);

    const slider = document.createElement('div');
    slider.classList.add(styles.slider);

    transportContainer.appendChild(slider);

    transportContainer.addEventListener('click', () => {
        transportContainer.classList.toggle(styles.active)
    })

    ROOT_ELEMENT.appendChild(transportContainer);
}
