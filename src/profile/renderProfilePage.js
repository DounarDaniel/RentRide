import { ROOT_ELEMENT, TRIPS_COLLECTION_NAME } from "../constants.js";
import { firebaseAuth, firebaseFirestore, registerUser, startLoading, stopLoading } from "../index.js";

import styles from './profile.module.css'

export async function renderProfile() {
    // getting current user
    const currentUser = firebaseAuth.getCurrentUser();

    if (!currentUser) {
        registerUser();
        console.error('Аккаунт утерен');
        return;
    }

    startLoading();

    // TODO: logic for avatarButton
    // TODO: logic for switching

    const trips = await firebaseFirestore.getDoc(TRIPS_COLLECTION_NAME, currentUser.uid);

    const profile = `
    <section class=${styles.profile} id="profile">
        <section class=${styles.profileTop}>
            <div class=${styles.avatar}>
                <div class=${styles.avatarPicture} 
                    style="background-image: url(${currentUser.photoURL || '../../person.png'})"></div>

                <div class=${styles.avatarButton}>
                    <label for="avatarPlusBtn">+</label>
                    <input type="file" id="avatarPlusBtn">
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
            <div class=${styles.switching}>
                <p class=${styles.active}>Trip History</p>
                <p>Settings</p>
            </div>

            <h2>Recent Trips</h2>

            <div class=${styles.trips} id="trips"></div>
        </section>
    </section>`

    stopLoading();
    ROOT_ELEMENT.insertAdjacentHTML('beforeend', profile);

    // get usre geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = +position.coords.latitude
                const lon = +position.coords.longitude

                const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.message);
                }

                document.querySelector('#yourPosition').textContent = `${data.address.city}, ${data.address.country}`
            },
            (error) => {
                console.error(error);
                alert("Ошибка в получении геолокации!");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            }
        );
    } else {
        console.error("Геолокация не поддерживается вашим браузером");
        alert("Ваш браузер не поддерживает геолокацию!");
    }

    // logout logic
    document.querySelector('#logoutBtn').addEventListener('click', async () => {
        const isSure = confirm("Вы точно хотите выйти из аккаунта?");

        if (isSure) {
            await firebaseAuth.logoutUser()
        }
    })

    // add users trips
    const tripsContainer = document.querySelector('#trips');
    let tripBox;

    if (!trips.length || !trips) {
        tripBox = `
            <h2>У вас ещё нет поездок</h2>
            <button class=${styles.startTripBtn}>Начать поездку</button>
        `
    } else {
        trips.forEach(trip => {
            tripBox = `
            <div class=${styles.trip}>
                <div>
                    <h4>${trip.transport}</h4>
                    <p class=${styles.date}>${trip.date}</p>
                </div>

                <p>Distance: ${trip.distance}</p>
            </div>`

        })
    }

    tripsContainer.insertAdjacentHTML('beforeend', tripBox);
}
