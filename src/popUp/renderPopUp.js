import { ROOT_ELEMENT, ESC_KEY_CODE } from '../constants.js';

import styles from './popUp.module.css';

export function renderPopUp() {
    const popUpElem = `    
    <div class=${styles.popUp} id="popUp">
        <div class=${styles.popUpBody}>
            <section class=${styles.content}>
                <a class=${styles.close} id="popUp_close"></a>

                <h2 class=${styles.title} id="popUpTitle"></h2>
                <p class=${styles.text} id="popUpText"></p>
            </section>
        </div>
    </div>`

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', popUpElem);

    const closeBtn = document.querySelector('#popUp_close');
    closeBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const popUp = this.closest('#popUp');
        popUp.classList.remove(styles.active);
    })

    document.addEventListener('keydown', (event) => {
        const popUp = document.querySelector('#popUp');

        if (!popUp.classList.contains('active') && event.which === ESC_KEY_CODE) {
            popUp.classList.remove(styles.active);
        }
    })

    return document.querySelector('#popUp');
}
