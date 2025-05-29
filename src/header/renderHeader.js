import { ROOT_ELEMENT, TRANSPORT_COLLECTION_NAME, TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID, TRIPS_COLLECTION_NAME } from '../constants.js'
import { initMap, renderProfile, addTransport, renderTransportContainer, triggerPopUp, startLoading, firebaseAuth, firebaseFirestore, stopLoading } from '../index.js';

import styles from './header.module.css'
import { active as weatherActive } from '../weather/weather.module.css'

export function renderHeader(isAdmin, isOnTrip = false) {
    const headerElem = `
    <header>
        <img class=${styles.logo} src="../../RentRide_logo.png" id="headerIcon" alt="RentRide">

        <nav>
            <ul class=${styles.menu}>
                <li id="homeLi">
                    <svg class=${styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 21V12H15V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <span class=${styles.text}>Home</span>
                </li>
                
                <li id="profileLi">
                    <svg class=${styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="9" r="3" fill="currentColor"/>
                        <path d="M5 19C5 16.2386 8.13401 14 12 14C15.866 14 19 16.2386 19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>

                    <span class=${styles.text}>Profile</span>
                </li>

                <li id="chatLi">
                    <svg class=${styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 14V7C19 4.79086 17.2091 3 15 3H5C2.79086 3 1 4.79086 1 7V15C1 17.2091 2.79086 19 5 19H6V22L10.6 19H15C17.2091 19 19 17.2091 19 15V14Z" 
                                stroke="currentColor"/>
                    </svg>

                    <span class=${styles.text}>Chat</span>
                </li>
            </ul>
        </nav>
    </header>`

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', headerElem);

    const adminButton = `
    <li id="addTransportLi">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class=${styles.icon}>
            <path d="M12 4V20M4 12H20" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round"/>
        </svg>

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
        const headerIcon = document.querySelector('#headerIcon');

        const onTripBox = `
        <div class=${styles.stopwatch} id="stopwatch">
            <div class=${styles.display} id="display">00:00:00</div>
            <button class=${styles.stopBtn} id="stopButton">Закончить поездку</button>
        </div>
        `

        headerIcon.insertAdjacentHTML('afterend', onTripBox);

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

            const weatherCard = document.querySelector('#weatherCard');

            if (weatherCard) {
                weatherCard.classList.remove(weatherActive);
            }

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