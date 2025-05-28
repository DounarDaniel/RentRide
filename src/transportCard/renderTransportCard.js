import { TRANSPORT_COLLECTION_NAME } from "../constants.js";
import { firebaseFirestore, renderTransportContainer, renderTransportInfo } from "../index.js";

import styles from './transportCard.module.css'

export async function renderTransportCard(transportId) {
    const transportContainer = document.querySelector('#transportContainer');
    let wrapper;

    if (!transportContainer) {
        wrapper = renderTransportContainer();
    } else{
        wrapper = document.querySelector('#transportCardWrapper')
    }

    const transportData = await firebaseFirestore.getDoc(TRANSPORT_COLLECTION_NAME, transportId);

    const reviews = transportData.reviews
    let averageRating = 5;

    if (reviews.length) {
        averageRating = reviews.reduce((total, review) => total + review.rating, 0)
    }

    const card = `
    <div class=${styles.card}>
        <div class=${styles.image}>
            <span class=${styles.rating}>${averageRating}⭐</span>

            <div class=${styles.imageInfo}>
                <span class=${styles.badge}>${transportData.type}</span>
                <h2 class=${styles.model}>${transportData.model}</h2>
            </div>
        </div>

        <div class=${styles.info}>
            <div class=${styles.meta}>
                <span>Топливо: ${transportData.fuelLevel}%</span>
                <span>${transportData.price.per_hour}$/hr</span>
            </div>
            
            <button class=${styles.detailsBtn} id="${transportId}">More Details</button>
        </div>
    </div>
    `

    wrapper.insertAdjacentHTML('beforeend', card);

    document.querySelector(`#${transportId}`).addEventListener('click', () => {
        renderTransportInfo(transportData)
    })
}   