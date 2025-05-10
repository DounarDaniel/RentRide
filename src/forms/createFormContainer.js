import { ROOT_ELEMENT } from "../constants";
import { container as containerStyles } from './style.module.css'

export function createAndAppendFormContainer() {
    let container = document.querySelector('#container');

    if (!container) {
        container = document.createElement('div');
        container.classList.add(containerStyles);
        container.setAttribute('id', 'container');

        ROOT_ELEMENT.appendChild(container);
    }

    return container
}