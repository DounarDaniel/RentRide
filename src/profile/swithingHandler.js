import { DOCUMENT_ELEMENT, MAP_OPTIONS } from '../constants.js'

import { active as activeClass } from './profile.module.css'
import tripStyles from './tripHistory.module.css'
import settingsStyles from './settings.module.css'
import { darkMapStyle, lightMapStyle } from '../mapStyles.js';

export function removeActiveFromAllBtns(switchingBtns) {
    for (let i = 0; i < switchingBtns.length; i++) {
        const button = switchingBtns[i];

        if (button.classList.contains(activeClass)) {
            button.classList.remove(activeClass)
        }
    }
}

export function renderTripsBox(trips, switchingContent) {
    let tripsBox = document.querySelector('#trips');

    if (tripsBox) {
        return;
    }

    switchingContent.innerHTML = '';

    // create tripsBox
    tripsBox = document.createElement('div');
    tripsBox.setAttribute('id', 'trips');
    tripsBox.classList.add(tripStyles.trips)

    // add users trips
    let trip;

    if (!trips.length || !trips) {
        trip = `
            <h3>У вас ещё нет поездок</h3>
            <button class=${tripStyles.startTripBtn}>Начать поездку</button>
        `
    } else {
        trips.forEach(trip => {
            trip = `
            <div class=${tripStyles.trip}>
                <div>
                    <h4>${trip.transport}</h4>
                    <p class=${tripStyles.date}>${trip.date}</p>
                </div>

                <p>Distance: ${trip.distance}</p>
            </div>`
        })
    }

    // insert HTML elements
    tripsBox.insertAdjacentHTML('beforeend', trip);
    switchingContent.appendChild(tripsBox, switchingContent);

}

export function renderSettings(switchingContent) {
    let settings = document.querySelector('#settings');

    if (settings) {
        return;
    }

    settings = `
        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Dark mode</h3>
                <p>Toggle dark theme</p>
            </div>

            <label class=${settingsStyles.switch}>
                <input type="checkbox" class=${settingsStyles.switchCheckbox} id="themeToggle">
                <span class=${settingsStyles.slider}></span>
            </label>
        </div>

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Main color</h3>
                <p>Choose your own main color!</p>
            </div>

            <select class=${settingsStyles.select} id="colorSelect" >
                <option style="background-color: #007bff;" value="blue">Blue (basic)</option>
                <option style="background-color: #acdc7b;" value="green">Green</option>
                <option style="background-color: #FFA726;" value="orange">Orange</option>
                <option style="background-color: #9C27B0;" value="purple">Purple</option>
                <option style="background-color: #26C6DA;" value="turquoise">Turquoise</option>
            </select>
        </div>

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Watch Position</h3>
                <p>Stop watching your pos?</p>
            </div>

            <label class=${settingsStyles.switch}>
                <input type="checkbox" class=${settingsStyles.switchCheckbox} checked="true">
                <span class=${settingsStyles.slider}></span>
            </label>
        </div>
        // todo: do logic for stop watching pos

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Main font</h3>
                <p>Choose your own main font!</p>
            </div>

            <select class=${settingsStyles.select}>
                <option>Montserrat Alternates, sans-serif</option>
                <option>Inter</option>
                // todo: choose fonts and do logic
            </select>
        </div>

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Header shadow</h3>
                <p>Choose your own main color!</p>
            </div>

            // todo: choose shadows and do logic
            <select class=${settingsStyles.select}>
                <option style="background-color: var(--secondary-color); color: var(--white)">Blue (basic)</option>
                <option>Grey</option>
            </select>
        </div>
    `
    switchingContent.innerHTML = '';
    switchingContent.insertAdjacentHTML('beforeend', settings);

    const themeToggleInput = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        themeToggleInput.checked = true;
    }

    themeToggleInput.addEventListener('change', () => {
        if (themeToggleInput.checked) {
            DOCUMENT_ELEMENT.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            MAP_OPTIONS.styles = darkMapStyle;
        } else {
            DOCUMENT_ELEMENT.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            MAP_OPTIONS.styles = lightMapStyle;
        }
    });

    const colorSelect = document.querySelector('#colorSelect');
    const currentMainColor = localStorage.getItem('main-color') || 'blue';

    if (currentMainColor !== 'blue' && !!currentMainColor) {
        for (let i = 0; i < colorSelect.length; i++) {
            const select = colorSelect[i];

            if (select.value === currentMainColor) {
                select.selected = true;
            }
        }
    }

    colorSelect.addEventListener('change', () => {
        const selectedOption = colorSelect.selectedOptions[colorSelect.selectedOptions.length - 1];
        const selectedColor = selectedOption.value;

        if (selectedColor === 'blue' || !selectedColor) {
            DOCUMENT_ELEMENT.removeAttribute('main-color')
            localStorage.setItem('main-color', 'blue');
        } else {
            DOCUMENT_ELEMENT.setAttribute('main-color', selectedColor);
            localStorage.setItem('main-color', selectedColor);
        }
    });
}