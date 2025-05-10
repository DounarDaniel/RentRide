import { ROOT_ELEMENT } from '../constants.js';
import { addTransportLoader, mapLoader, defaultLoader } from './loaders.js';

import styles from './container.module.css'

export function startLoading(loaderType) {
    ROOT_ELEMENT.style.overflow = "hidden";
    let loader;

    switch (loaderType) {
        case 'addTransportLoader':
            loader = addTransportLoader;
            break;

        case 'mapLoader':
            loader = mapLoader;
            break;

        case 'default':
            loader = defaultLoader
            break;

        default:
            loader = defaultLoader
            break;
    }

    renderLoader(ROOT_ELEMENT, loader);
}

function renderLoader(loaderParent, loader) {
    let loaderContainer = document.querySelector('#loaderContainer');

    if (!loaderContainer) {
        loaderContainer = document.createElement('div');
        loaderContainer.setAttribute('id', 'loaderContainer');
        loaderContainer.classList.add(styles.container);
    }

    loaderContainer.insertAdjacentHTML('afterbegin', loader);
    loaderParent.appendChild(loaderContainer)
}

export function stopLoading() {
    ROOT_ELEMENT.style.overflow = "visible";
    const loaderContainer = document.querySelector('#loaderContainer');

    if (loaderContainer) {
        loaderContainer.remove();
    }
}