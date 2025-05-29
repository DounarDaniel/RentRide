import { ROOT_ELEMENT, TRANSPORT_COLLECTION_NAME, TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID, TRIPS_COLLECTION_NAME } from '../constants.js'
import { initMap, renderProfile, addTransport, renderTransportContainer, triggerPopUp, startLoading, firebaseAuth, firebaseFirestore, stopLoading } from '../index.js';

import styles from './header.module.css'

export function renderHeader(isAdmin, isOnTrip = false) {
    const headerElem = `
    <header>
        <h2 class=${styles.title} id="headerTitle">RentRide</h2>

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

    if (Boolean(isOnTrip)) {
        localStorage.setItem('isOnTrip', true);
        const headerTitle = document.querySelector('#headerTitle');

        const onTripBox = `
        <div class=${styles.stopwatch} id="stopwatch">
            <div class=${styles.display} id="display">00:00:00</div>
            <button class=${styles.stopBtn} id="stopButton">Закончить поездку</button>
        </div>
        `

        headerTitle.insertAdjacentHTML('afterend', onTripBox);

        const display = document.querySelector('#display');
        const stopButton = document.querySelector('#stopButton');
        const stopwatch = document.querySelector('#stopwatch');

        let startTime;

        const savedStartTime = localStorage.getItem('startTime');

        if (!savedStartTime) {
            startTime = Date.now();
            localStorage.setItem('startTime', startTime);
        } else {
            startTime = savedStartTime;
        }

        let timerInterval = setInterval(() => {
            const currentTime = Date.now() - startTime;
            display.textContent = formatTime(currentTime);
        }, 1000);

        stopButton.addEventListener('click', async () => {
            startLoading('default')

            clearInterval(timerInterval);

            stopwatch.remove();

            triggerPopUp({
                title: 'Поездка закончена!',
                text: 'Благодарим, что воспользывались нашим приложением, теперь вы сможете оставить отзыв о транспорте, перейдя на его страницу'
            })

            const rentedTransportId = localStorage.getItem('rentedTransportId');

            if (!rentedTransportId) {
                return;
            }

            const rentedTransport = await firebaseFirestore.getDoc(TRANSPORT_COLLECTION_NAME, rentedTransportId);
            rentedTransport.status = 'active';

            await firebaseFirestore.updateDoc(TRANSPORT_COLLECTION_NAME, rentedTransportId, rentedTransport)

            const markersData = await firebaseFirestore.getDoc(
                TRANSPORT_MARKERS_COLLECTION_NAME,
                TRANSPORT_MARKERS_DOC_ID
            );

            const transportMarkerData = await markersData.transportData;

            const rentedMarkerTransport = transportMarkerData.find(
                (transport) => transport.plate_number === rentedTransportId
            )

            rentedMarkerTransport.status = 'active';

            await firebaseFirestore.updateDoc(
                TRANSPORT_MARKERS_COLLECTION_NAME,
                TRANSPORT_MARKERS_DOC_ID,
                { transportData: transportMarkerData }
            );

            localStorage.removeItem('isOnTrip');
            localStorage.removeItem('startTime');

            const currentUser = await firebaseAuth.getCurrentUser();

            const usersTripsData = await firebaseFirestore.getDoc(TRIPS_COLLECTION_NAME, currentUser.uid);
            const usersTrips = usersTripsData.trips;

            const newTrip = {
                transport: rentedTransport.model,
                date: new Date().toLocaleString(),
                duration: display.innerHTML,
            }

            usersTrips.push(newTrip);

            await firebaseFirestore.updateDoc(TRIPS_COLLECTION_NAME, currentUser.uid, { trips: usersTrips })

            stopLoading();
        });
    }

    document.querySelector('#homeLi').addEventListener('click', () => {
        removeUnnecessaryChildren((child) => child.id === "map" || child.id === "transportContainer")
        ROOT_ELEMENT.style.overflow = 'hidden';

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

function formatTime(ms) {
    let date = new Date(ms);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}