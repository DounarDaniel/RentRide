import styles from './header.module.css'
import { ROOT_ELEMENT } from '../constants.js'

export function renderHeader() {
    const headerElem = `
    <header>
        <h2 class=${styles.title}>RentRide</h2>

        <nav>
            <ul class=${styles.menu}>
                <li>
                    <img src="../../headerIcons/home.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Home</span>
                </li>
                <li>
                    <img src="../../headerIcons/profile.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Profile</span>
                </li>
                <li>
                    <img src="../../headerIcons/history.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>History</span>
                </li>
                <li>
                    <img src="../../headerIcons/chat.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Chat</span>
                </li>
            </ul>
        </nav>
    </header>`

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', headerElem);
}