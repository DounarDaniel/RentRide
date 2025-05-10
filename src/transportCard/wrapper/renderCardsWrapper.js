import { wrapper } from '../transportCard.module.css'

export function renderCardsWrapper() {
    const transportCardWrapper = document.createElement('section');
    transportCardWrapper.classList.add(wrapper);
    transportCardWrapper.setAttribute('id', 'transportCardWrapper');

    return transportCardWrapper;
}
