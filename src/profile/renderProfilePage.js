import { DEFAULT_AVATAR, GEOLOCATION_OPTIONS, ROOT_ELEMENT, TRIPS_COLLECTION_NAME } from "../constants.js";
import { firebaseAuth, firebaseFirestore, registerUser, startLoading, stopLoading, triggerPopUp } from "../index.js";
import { removeActiveFromAllBtns, renderSettings, renderTripsBox } from "./swithingHandler.js";

import styles from './profile.module.css'

export async function renderProfile(activeBlock = 'tripHistory') {
    // getting current user
    const currentUser = firebaseAuth.getCurrentUser();

    if (!currentUser) {
        console.error('Аккаунт утерен');
        triggerPopUp({
            title: 'Аккаунт утерен',
            text: 'Войдите в свой старый аккаунт или создайте новый'
        })

        registerUser();
        return;
    }

    startLoading();

    const tripsData = await firebaseFirestore.getDoc(TRIPS_COLLECTION_NAME, currentUser.uid);
    const trips = tripsData.trips;

    const profile = `
    <section class=${styles.profile} id="profile">
        <section class=${styles.profileTop}>
            <div class=${styles.avatar}>
                <div class=${styles.avatarPicture} 
                    style="background-image: url(${currentUser.photoURL || DEFAULT_AVATAR})"></div>

                <div class=${styles.avatarButton}>
                    <label for="avatarPlusInput">+</label>
                    <input type="file" id="avatarPlusInput">
                </div> 
            </div>

            <div class=${styles.info}>
                <h2>${currentUser.displayName}</h2>
                <p id="yourPosition"></p>
            </div>

            <div class=${styles.stats}>
                <div class=${styles.statBox}>
                    <p>${trips?.length || 0}</p>
                    <p>Trips</p>
                </div>
                <div class=${styles.statBox}>
                    <p>${trips?.length || 0}</p> 
                    <p>transports</p>
                </div>  
            </div>

            <button class=${styles.logout} id="logoutBtn">Log Out</button>
        </section>

        <section class=${styles.profileBottom}>
            <div class=${styles.switching} id="switching">
                <button id="tripHistoryBtn">Trip History</button>
                <button id="settingsBtn">Settings</button>
            </div>

            <h2 id="switchingTitle" class=${styles.switchingTitle}>Recent Trips</h2>

            <section id="switchingContent"></section>
        </section>
    </section>`

    stopLoading();
    ROOT_ELEMENT.insertAdjacentHTML('beforeend', profile);

    // getting all the neccesary elements for switching
    const switchingBtns = document.querySelector('#switching').children;
    const switchingContent = document.querySelector('#switchingContent');
    const switchingTitle = document.querySelector('#switchingTitle');
    const tripHistoryBtn = document.querySelector('#tripHistoryBtn');
    const settingsBtn = document.querySelector('#settingsBtn');

    if (activeBlock === 'tripHistory' || !activeBlock) {
        tripHistoryBtn.classList.add(styles.active);
    } else {
        removeActiveFromAllBtns(switchingBtns);
        settingsBtn.classList.add(styles.active);
        switchingTitle.innerHTML = 'Settings';

        renderSettings(switchingContent);
    }

    // get user geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = +position.coords.latitude
                const lon = +position.coords.longitude

                const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Error in responce');
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.message);
                }

                document.querySelector('#yourPosition').textContent = `${data.address.city}, ${data.address.country}`
            },
            (error) => {
                console.error(error);
            },
            GEOLOCATION_OPTIONS
        );
    } else {
        console.error("Геолокация не поддерживается вашим браузером");
        alert("Ваш браузер не поддерживает геолокацию!");
    }

    // logout logic
    document.querySelector('#logoutBtn').addEventListener('click', async () => {
        const isSure = confirm("Вы точно хотите выйти из аккаунта?");

        if (isSure) {
            await firebaseAuth.logoutUser();
            // await firebaseFirestore.deleteDoc(TRIPS_COLLECTION_NAME, currentUser.uid);
        }
    })

    // add event listeners to switch buttons
    tripHistoryBtn.addEventListener('click', () => {
        removeActiveFromAllBtns(switchingBtns);
        tripHistoryBtn.classList.add(styles.active);
        switchingTitle.innerHTML = 'Recent Trips';

        renderTripsBox(trips, switchingContent);
    })

    settingsBtn.addEventListener('click', () => {
        removeActiveFromAllBtns(switchingBtns);
        settingsBtn.classList.add(styles.active);
        switchingTitle.innerHTML = 'Settings';

        renderSettings(switchingContent);
    })

    if (tripHistoryBtn.classList.contains(styles.active)) {
        renderTripsBox(trips, switchingContent);
    }

    // logic for avatar input
    const avatarPlusInput = document.querySelector('#avatarPlusInput');

    avatarPlusInput.addEventListener('input', (e) => {
        e.preventDefault();

        const newAvatarPicture = avatarPlusInput.value;

        if (!newAvatarPicture) {
            return;
        }

        firebaseAuth.updateUserProfile(currentUser, {
            displayName: currentUser.displayName,
            photoURL: newAvatarPicture,
        })
    })
}
