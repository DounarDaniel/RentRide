import { wrapper } from '../transportCard.module.css'

import styles from './wrapper.module.css'

export function renderCardsWrapper() {
    const transportCardWrapper = document.createElement('section');
    transportCardWrapper.classList.add(styles.wrapper);
    transportCardWrapper.setAttribute('id', 'transportCardWrapper');

    return transportCardWrapper;
}
