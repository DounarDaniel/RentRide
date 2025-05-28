import { DOCUMENT_ELEMENT, MAP_OPTIONS } from '../constants.js';
import { darkMapStyle, lightMapStyle } from '../mapStyles.js';
import { stopTracking } from '../index.js';

import { active as activeClass } from './profile.module.css';
import tripStyles from './tripHistory.module.css';
import settingsStyles from './settings.module.css';

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
                <option style="color: #007bff;" value="blue">Blue (basic)</option>
                <option style="color: #acdc7b;" value="green">Green</option>
                <option style="color: #FFA726;" value="orange">Orange</option>
                <option style="color: #9C27B0;" value="purple">Purple</option>
                <option style="color: #26C6DA;" value="turquoise">Turquoise</option>
            </select>
        </div>

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Watch Position</h3>
                <p id="watchPosText">Мы видим где вы прямо сейчас 😑. Хотите спрятаться?</p>
            </div>

            <label class=${settingsStyles.switch}>
                <input type="checkbox" class=${settingsStyles.switchCheckbox} checked="true" id="watchPos">
                <span class=${settingsStyles.slider}></span>
            </label>
        </div>

        <div class=${settingsStyles.settingItem}>
            <div class=${settingsStyles.settingText}>
                <h3>Main font</h3>
                <p>Choose your own main font!</p>
            </div>

            <select class=${settingsStyles.select} id="fontSelect">
                <option value="Montserrat Alternates">Montserrat Alternates (recommended)</option>
                <option value="Inter">Inter</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Playfair Display">Playfair Display</option>
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

    // Переключение темы
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

    // Выбор цвета
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

    // Геопозиция (на стадии разаботки)
    const watchId = localStorage.getItem('watchId');
    const watchPosInput = document.querySelector('#watchPos');
    const watchPosText = document.querySelector('#watchPosText');

    if (!watchId) {
        watchPosInput.checked = false;
        watchPosText.innerHTML = 'Мы больше не видим где вы 😔';
    } else {
        watchPosInput.checked = true;
        watchPosText.innerHTML = 'Мы видим где вы прямо сейчас 😑. Хотите спрятаться?';
    }

    watchPosInput.addEventListener('change', () => {
        if (!watchPosInput.checked) {
            watchPosText.innerHTML = 'Мы больше не видим где вы 😔';
            localStorage.removeItem('watchId')
            stopTracking(watchId);
        } else {
            watchPosText.innerHTML = 'Мы видим где вы прямо сейчас 😑. Хотите спрятаться?';
        }
    })

    // Смена главного шрифта
    const defaultMainFont = 'Montserrat Alternates'
    const fontSelect = document.querySelector('#fontSelect');
    const currentMainFont = localStorage.getItem('main-font') || defaultMainFont;

    if (currentMainFont !== defaultMainFont && !!currentMainFont) {
        for (let i = 0; i < fontSelect.length; i++) {
            const select = fontSelect[i];

            if (select.value === currentMainFont) {
                select.selected = true;
            }
        }
    }

    fontSelect.addEventListener('change', () => {
        const selectedOption = fontSelect.selectedOptions[fontSelect.selectedOptions.length - 1];
        const selectedFont = selectedOption.value;

        if (selectedFont === defaultMainFont || !selectedFont) {
            DOCUMENT_ELEMENT.removeAttribute('main-font')
            localStorage.setItem('main-font', defaultMainFont);
        } else {
            DOCUMENT_ELEMENT.setAttribute('main-font', selectedFont);
            localStorage.setItem('main-font', selectedFont);
        }
    });
}