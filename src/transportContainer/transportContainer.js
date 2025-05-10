import { ROOT_ELEMENT } from "../constants.js";
import { renderCardsWrapper } from "../transportCard/wrapper/renderCardsWrapper.js";

import styles from './transportContainer.module.css'

export function renderTransportContainer() {
    const transportContainer = document.createElement('section');
    transportContainer.classList.add(styles.transportContainer);
    transportContainer.setAttribute('id', 'transportContainer');

    const slider = document.createElement('div');
    slider.classList.add(styles.slider);

    transportContainer.appendChild(slider);

    transportContainer.addEventListener('click', () => {
        transportContainer.classList.toggle(styles.active);
        transportContainer.scroll({
            top: 0,
            behavior: "smooth",
        })
    })

    const transportCardsWrapper = renderCardsWrapper();
    transportContainer.appendChild(transportCardsWrapper);

    ROOT_ELEMENT.appendChild(transportContainer);
    return transportCardsWrapper;
}
