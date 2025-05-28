import { ROOT_ELEMENT } from '../constants.js'
import { initMap, renderProfile, addTransport, renderTransportContainer } from '../index.js';

import styles from './header.module.css'

export function renderHeader(isAdmin) {
    const headerElem = `
    <header>
        <h2 class=${styles.title}>RentRide</h2>

        <nav>
            <ul class=${styles.menu}>
                <li id="homeLi">
                    <img src="../../headerIcons/home.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Home</span>
                </li>
                
                <li id="profileLi">
                    <img src="../../headerIcons/profile.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Profile</span>
                </li>

                <li id="settingsLi">
                    <img src="../../headerIcons/settings.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Settings</span>
                </li>

                <li id="chatLi">
                    <img src="../../headerIcons/chat.png" alt="" class=${styles.icon}>
                    <span class=${styles.text}>Chat</span>
                </li>
            </ul>
        </nav>
    </header>`

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', headerElem);

    const adminButton = `
    <li id="addTransportLi">
        <img src="../../headerIcons/add.png" alt="" class=${styles.icon}>
        <span class=${styles.text}>Add</span>
    </li>`

    if (isAdmin) {
        document.querySelector(`.${styles.menu}`).insertAdjacentHTML('beforeend', adminButton);

        document.querySelector('#addTransportLi').addEventListener('click', () => {
            removeUnnecessaryChildren(child => child.id === "container")

            const addTransportForm = document.querySelector('#addTransportForm');
            if (!addTransportForm) {
                addTransport();
            }

            const header = document.querySelector('header');
            header.style.position = 'sticky';
        });
    }

    document.querySelector('#homeLi').addEventListener('click', () => {
        removeUnnecessaryChildren((child) => child.id === "map" || child.id === "transportContainer")

        const map = document.querySelector('#map');
        if (!map) {
            initMap();
        }

        const transportContainer = document.querySelector('#transportContainer');
        if (!transportContainer) {
            renderTransportContainer();
        }

        const header = document.querySelector('header');
        header.style.position = 'fixed';
    });

    document.querySelector('#profileLi').addEventListener('click', () => {
        removeUnnecessaryChildren(child => child.id === "profile")

        const profile = document.querySelector('#profile');
        if (!profile) {
            renderProfile();
        }

        const header = document.querySelector('header');
        header.style.position = 'sticky';
    });

    document.querySelector('#settingsLi').addEventListener('click', () => {
        removeUnnecessaryChildren(child => child.id === "profile")

        const profile = document.querySelector('#profile');
        if (!profile) {
            const activeBlok = 'settings'
            renderProfile(activeBlok);
        }

        const header = document.querySelector('header');
        header.style.position = 'sticky';
    });

    document.querySelector('#chatLi').addEventListener('click', () => {
        console.log('Opening chat');
    });
}

function removeUnnecessaryChildren(callback) {
    const unnecessaryChildren = [];

    for (let i = 0; i < ROOT_ELEMENT.children.length; i++) {
        const child = ROOT_ELEMENT.children[i];
        const isChildNecessary = callback(child) || child.tagName === "HEADER";

        if (!isChildNecessary) {
            unnecessaryChildren.push(child)
        }
    }

    unnecessaryChildren.forEach(child => child.remove())
}