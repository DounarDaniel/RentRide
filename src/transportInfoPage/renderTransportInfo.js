import { PIECE_OF_ADMIN_NICKNAME, ROOT_ELEMENT, TRANSPORT_COLLECTION_NAME, TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID } from '../constants.js';
import { displayWeather, firebaseAuth, firebaseFirestore, renderMainPage, startLoading, stopLoading, triggerPopUp } from '../index.js';

import styles from './transportInfo.module.css';
import { active as weatherActive } from '../weather/weather.module.css'

export async function renderTransportInfo(transportData) {
    ROOT_ELEMENT.innerHTML = '';

    const transportInfoPage = `
    <section class=${styles.top}>
        <div class=${styles.arrowBox}>
            <button class=${styles.arrow}>
                <img src="../../arrow_back.png" alt="arrow" id="arrowBack">
            </button>

            <h2>${transportData.type[0].toUpperCase() + transportData.type.slice(1)}</h2>
        </div>

        <button class=${styles.button} id="rentButton">Арендовать</button>
    </section>

    <main>
        <div class=${styles.sliderContainer}>
            <div class=${styles.slider} id="slider">
                <img src="../../mapIcons/car.png" alt="transport" class="${styles.active}" id="slide">
                <img src="../../mapIcons/bike.png" alt="transport" id="slide">
                <img src="../../mapIcons/electric_bike.png" alt="transport" id="slide">
            </div>

            <button class=${styles.prevButton} type="button" id="prevButton">
                <img src="../../arrow_back.png" alt="arrow">
            </button>

            <button class=${styles.nextButton} type="button" id="nextButton">
                <img src="../../arrow_back.png" alt="arrow">
            </button>
        </div>

        <section>
            <h3 class=${styles.name}>${transportData.model}</h3>
            <p class=${styles.text}>${transportData.basic_info}</p>
            <p class=${styles.text}>${transportData.additional_info}</p>
            <p class=${styles.text}>Заряд/топливо: ${transportData.fuelLevel}%</p>
            <p class=${styles.text}>Номер: ${transportData.plate_number}</p>
        </section>

        <div class=${styles.prices}>
            <div class=${styles.price}>
                <svg class=${styles.icon} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3" xml:space="preserve"><g><path d="M191,475.95l-76.6-0.4c-3.6,0-6.5-2.9-6.5-6.5l-1.4-40.4l-72.7-87.6c-10.7-11.4-18-24.2-20.3-39.6l-0.7-4.5L0.1,174.05 c-0.6-6.1,1.5-12.3,6.2-16.1c5.7-4.6,14.7-6.3,21.4,1.3c4.7,5.4,7,22.2,7.8,26.7c2.7,16.1,5.4,39.1,5.8,55.3c0,1.1,0.1,2.6,0.2,3.7 c0.4,7.1,2.1,13.7,5.1,20.2c16.4,35.6,49.3,80.6,49.3,80.6l1.8,2.7c1.4,2,4.1,2.7,6.3,1.5c2.4-1.3,3.2-4.4,1.8-6.7l-43.6-71.1 c-4.7-7.9-2-19.1,6.5-24.3c8.5-5.2,19.7-2.6,24.4,5.3l45.3,58.2c3,3.8,8.5,9.3,12.4,12.1c40.7,29.3,46.2,59.1,49.8,74.3 c0,0,0.3,3.4,0.4,8.3l0,0l0,0c0,4.1-0.1,9.2-0.8,14.3l-2.7,48.9C197.5,473.05,194.6,475.95,191,475.95z M46,167.85 c1.3,4.3,2.2,8.7,2.9,12.9c2.3,13.9,5.8,39,6,52.3c0,1.4,0.1,2.7,0.1,4.1c1.5-1.3,3.1-2.6,4.9-3.7c2.2-1.4,4.5-2.4,6.9-3.2 c0.1-0.2,0.2-0.3,0.3-0.4c-1.7-12.7-6.2-36.7-9.5-49.1C55.9,174.45,52.3,169.85,46,167.85z M70.4,185.45c2,9.2,7.2,26.1,8.4,35.1 l0.8,6.1c0.1,0.6,0.1,1.2,0.1,1.8c3.7,0.1,7.4,0.9,10.9,2.2c-1.2-8.2-6.7-24.6-8.7-32.3C80.1,192.05,76.5,187.55,70.4,185.45z M460.7,159.25c-4.7,5.4-7,22.2-7.8,26.7c-2.7,16.1-5.4,39.1-5.8,55.3c0,1.1-0.1,2.6-0.2,3.7c-0.4,7.1-2.1,13.7-5.1,20.2 c-16.4,35.6-49.3,80.6-49.3,80.6l-1.8,2.7c-1.4,2-4.1,2.7-6.3,1.5c-2.4-1.3-3.2-4.4-1.8-6.7l43.5-71c4.7-7.9,2-19.1-6.5-24.3 c-8.5-5.2-19.7-2.6-24.4,5.3l-45.3,58.2c-3,3.8-8.5,9.3-12.4,12.1c-40.7,29.3-46.2,59.1-49.8,74.3c0,0-0.3,3.4-0.4,8.3l0,0 c0,4.1,0.1,9.2,0.8,14.3l2.7,48.9c0,3.6,2.9,6.5,6.5,6.5l76.6-0.4c3.6,0,6.5-2.9,6.5-6.5l1.4-40.4l72.7-87.6 c10.7-11.4,18-24.2,20.3-39.6l0.7-4.5l12.7-122.9c0.6-6.1-1.5-12.3-6.2-16.1C476.4,153.35,467.4,151.65,460.7,159.25z M421.4,229.75c0.1,0.2,0.2,0.3,0.3,0.4c2.4,0.8,4.7,1.9,6.9,3.2c1.8,1.1,3.4,2.3,4.9,3.7c0-1.4,0.1-2.7,0.1-4.1 c0.3-13.3,3.7-38.4,6-52.3c0.7-4.2,1.5-8.5,2.9-12.9c-6.3,2.1-10,6.6-11.6,12.8C427.5,193.05,423.1,217.15,421.4,229.75z M397.9,230.45c3.5-1.3,7.2-2,10.9-2.2c0-0.6,0-1.2,0.1-1.8l0.8-6.1c1.2-8.9,6.3-25.8,8.4-35.1c-6.2,2.1-9.8,6.6-11.4,12.8 C404.6,205.85,399.1,222.25,397.9,230.45z M386.5,220.95c0-6-4.8-10.8-10.8-10.8H116.2c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8 h259.5C381.7,231.75,386.5,226.95,386.5,220.95z M347.8,260.05c0-6-4.8-10.8-10.8-10.8H135.4c-6,0-10.8,4.8-10.8,10.8 s4.8,10.8,10.8,10.8H337C343,270.85,347.8,266.05,347.8,260.05z M171.5,288.45c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8h129.3 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8H171.5z M324.8,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C340.1,94.15,333.2,87.35,324.8,87.35z M163.6,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C179,94.15,172.1,87.35,163.6,87.35z M390.1,167.75c0,13.9-11.3,25.3-25.3,25.3H123.6 c-13.9,0-25.3-11.3-25.3-25.3V37.65c0-13.9,11.3-25.3,25.3-25.3h241.2c13.9,0,25.3,11.3,25.3,25.3L390.1,167.75L390.1,167.75z M368.5,64.95c-2,0.5-4.1,0.8-6.3,0.8c-14.1,0-25.6-11.5-25.6-25.6c0-2.2,0.3-4.2,0.8-6.2H149.5c0.3,1.5,0.4,3.1,0.4,4.7 c0,14.1-11.5,25.6-25.6,25.6c-1.5,0-3-0.1-4.5-0.4v77.7c1.5-0.3,3-0.4,4.5-0.4c14.1,0,25.6,11.5,25.6,25.6c0,1.6-0.2,3.2-0.4,4.7 h187.2c-0.1-1-0.2-2.1-0.2-3.2c0-14.1,11.5-25.6,25.6-25.6c2.2,0,4.3,0.3,6.3,0.8v-78.5H368.5z M299.6,102.65 c0,30.6-24.8,55.4-55.4,55.4s-55.4-24.8-55.4-55.4s24.8-55.4,55.4-55.4C274.8,47.35,299.6,72.15,299.6,102.65z M239,88.35 c0-2,0.5-3.6,1.5-4.8c1-1.3,2.5-1.9,4.5-1.9c2,0,3.6,0.8,4.8,2.3c1,1.2,1.6,3,1.7,5.2c0.1,1,1,1.8,2,1.8l10.4-0.2 c1.1,0,2.1-1,2-2.1c-0.3-4.5-1.7-8.3-4.4-11.4c-2.7-3.2-6.4-5.2-10.9-6.1v-7.8c0-1-0.8-1.7-1.7-1.7h-6.3c-1,0-1.7,0.8-1.7,1.7v7.6 c-4.8,0.7-8.7,2.5-11.7,5.3c-3.3,3.2-4.9,7.2-4.9,12c0,5.4,1.6,9.5,4.7,12.3c3.1,2.8,8.1,5.5,14.9,8.2c2.8,1.2,4.7,2.4,5.8,3.7 c1.1,1.3,1.6,3,1.6,5.3c0,2-0.5,3.5-1.6,4.8c-1.1,1.2-2.6,1.8-4.7,1.8c-2.5,0-4.5-0.8-6.1-2.4c-1.3-1.3-2-3.3-2.3-5.9 c-0.1-1-1-1.8-2.1-1.8l-10.3,0.2c-1.1,0-2.1,1-2,2.1c0.3,5.5,2,9.7,5.3,12.7c3.6,3.2,8,5.2,13.3,5.8v7.1c0,1,0.8,1.7,1.7,1.7h6.3 c1,0,1.7-0.8,1.7-1.7v-7.3c4.3-0.8,7.7-2.5,10.4-5.1c3.2-3.1,4.7-7.1,4.7-12.1c0-5.3-1.6-9.3-4.7-12.2c-3.1-2.8-8.1-5.7-14.8-8.5 c-2.9-1.3-4.9-2.5-5.9-3.8C239.5,91.95,239,90.25,239,88.35z"/></g></svg>
                <h4>За минуту</h4>
                <p>${transportData.price.per_minute}$</p>
            </div>

            <div class=${styles.price}>
                <svg class=${styles.icon} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3" xml:space="preserve"><g><path d="M191,475.95l-76.6-0.4c-3.6,0-6.5-2.9-6.5-6.5l-1.4-40.4l-72.7-87.6c-10.7-11.4-18-24.2-20.3-39.6l-0.7-4.5L0.1,174.05 c-0.6-6.1,1.5-12.3,6.2-16.1c5.7-4.6,14.7-6.3,21.4,1.3c4.7,5.4,7,22.2,7.8,26.7c2.7,16.1,5.4,39.1,5.8,55.3c0,1.1,0.1,2.6,0.2,3.7 c0.4,7.1,2.1,13.7,5.1,20.2c16.4,35.6,49.3,80.6,49.3,80.6l1.8,2.7c1.4,2,4.1,2.7,6.3,1.5c2.4-1.3,3.2-4.4,1.8-6.7l-43.6-71.1 c-4.7-7.9-2-19.1,6.5-24.3c8.5-5.2,19.7-2.6,24.4,5.3l45.3,58.2c3,3.8,8.5,9.3,12.4,12.1c40.7,29.3,46.2,59.1,49.8,74.3 c0,0,0.3,3.4,0.4,8.3l0,0l0,0c0,4.1-0.1,9.2-0.8,14.3l-2.7,48.9C197.5,473.05,194.6,475.95,191,475.95z M46,167.85 c1.3,4.3,2.2,8.7,2.9,12.9c2.3,13.9,5.8,39,6,52.3c0,1.4,0.1,2.7,0.1,4.1c1.5-1.3,3.1-2.6,4.9-3.7c2.2-1.4,4.5-2.4,6.9-3.2 c0.1-0.2,0.2-0.3,0.3-0.4c-1.7-12.7-6.2-36.7-9.5-49.1C55.9,174.45,52.3,169.85,46,167.85z M70.4,185.45c2,9.2,7.2,26.1,8.4,35.1 l0.8,6.1c0.1,0.6,0.1,1.2,0.1,1.8c3.7,0.1,7.4,0.9,10.9,2.2c-1.2-8.2-6.7-24.6-8.7-32.3C80.1,192.05,76.5,187.55,70.4,185.45z M460.7,159.25c-4.7,5.4-7,22.2-7.8,26.7c-2.7,16.1-5.4,39.1-5.8,55.3c0,1.1-0.1,2.6-0.2,3.7c-0.4,7.1-2.1,13.7-5.1,20.2 c-16.4,35.6-49.3,80.6-49.3,80.6l-1.8,2.7c-1.4,2-4.1,2.7-6.3,1.5c-2.4-1.3-3.2-4.4-1.8-6.7l43.5-71c4.7-7.9,2-19.1-6.5-24.3 c-8.5-5.2-19.7-2.6-24.4,5.3l-45.3,58.2c-3,3.8-8.5,9.3-12.4,12.1c-40.7,29.3-46.2,59.1-49.8,74.3c0,0-0.3,3.4-0.4,8.3l0,0 c0,4.1,0.1,9.2,0.8,14.3l2.7,48.9c0,3.6,2.9,6.5,6.5,6.5l76.6-0.4c3.6,0,6.5-2.9,6.5-6.5l1.4-40.4l72.7-87.6 c10.7-11.4,18-24.2,20.3-39.6l0.7-4.5l12.7-122.9c0.6-6.1-1.5-12.3-6.2-16.1C476.4,153.35,467.4,151.65,460.7,159.25z M421.4,229.75c0.1,0.2,0.2,0.3,0.3,0.4c2.4,0.8,4.7,1.9,6.9,3.2c1.8,1.1,3.4,2.3,4.9,3.7c0-1.4,0.1-2.7,0.1-4.1 c0.3-13.3,3.7-38.4,6-52.3c0.7-4.2,1.5-8.5,2.9-12.9c-6.3,2.1-10,6.6-11.6,12.8C427.5,193.05,423.1,217.15,421.4,229.75z M397.9,230.45c3.5-1.3,7.2-2,10.9-2.2c0-0.6,0-1.2,0.1-1.8l0.8-6.1c1.2-8.9,6.3-25.8,8.4-35.1c-6.2,2.1-9.8,6.6-11.4,12.8 C404.6,205.85,399.1,222.25,397.9,230.45z M386.5,220.95c0-6-4.8-10.8-10.8-10.8H116.2c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8 h259.5C381.7,231.75,386.5,226.95,386.5,220.95z M347.8,260.05c0-6-4.8-10.8-10.8-10.8H135.4c-6,0-10.8,4.8-10.8,10.8 s4.8,10.8,10.8,10.8H337C343,270.85,347.8,266.05,347.8,260.05z M171.5,288.45c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8h129.3 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8H171.5z M324.8,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C340.1,94.15,333.2,87.35,324.8,87.35z M163.6,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C179,94.15,172.1,87.35,163.6,87.35z M390.1,167.75c0,13.9-11.3,25.3-25.3,25.3H123.6 c-13.9,0-25.3-11.3-25.3-25.3V37.65c0-13.9,11.3-25.3,25.3-25.3h241.2c13.9,0,25.3,11.3,25.3,25.3L390.1,167.75L390.1,167.75z M368.5,64.95c-2,0.5-4.1,0.8-6.3,0.8c-14.1,0-25.6-11.5-25.6-25.6c0-2.2,0.3-4.2,0.8-6.2H149.5c0.3,1.5,0.4,3.1,0.4,4.7 c0,14.1-11.5,25.6-25.6,25.6c-1.5,0-3-0.1-4.5-0.4v77.7c1.5-0.3,3-0.4,4.5-0.4c14.1,0,25.6,11.5,25.6,25.6c0,1.6-0.2,3.2-0.4,4.7 h187.2c-0.1-1-0.2-2.1-0.2-3.2c0-14.1,11.5-25.6,25.6-25.6c2.2,0,4.3,0.3,6.3,0.8v-78.5H368.5z M299.6,102.65 c0,30.6-24.8,55.4-55.4,55.4s-55.4-24.8-55.4-55.4s24.8-55.4,55.4-55.4C274.8,47.35,299.6,72.15,299.6,102.65z M239,88.35 c0-2,0.5-3.6,1.5-4.8c1-1.3,2.5-1.9,4.5-1.9c2,0,3.6,0.8,4.8,2.3c1,1.2,1.6,3,1.7,5.2c0.1,1,1,1.8,2,1.8l10.4-0.2 c1.1,0,2.1-1,2-2.1c-0.3-4.5-1.7-8.3-4.4-11.4c-2.7-3.2-6.4-5.2-10.9-6.1v-7.8c0-1-0.8-1.7-1.7-1.7h-6.3c-1,0-1.7,0.8-1.7,1.7v7.6 c-4.8,0.7-8.7,2.5-11.7,5.3c-3.3,3.2-4.9,7.2-4.9,12c0,5.4,1.6,9.5,4.7,12.3c3.1,2.8,8.1,5.5,14.9,8.2c2.8,1.2,4.7,2.4,5.8,3.7 c1.1,1.3,1.6,3,1.6,5.3c0,2-0.5,3.5-1.6,4.8c-1.1,1.2-2.6,1.8-4.7,1.8c-2.5,0-4.5-0.8-6.1-2.4c-1.3-1.3-2-3.3-2.3-5.9 c-0.1-1-1-1.8-2.1-1.8l-10.3,0.2c-1.1,0-2.1,1-2,2.1c0.3,5.5,2,9.7,5.3,12.7c3.6,3.2,8,5.2,13.3,5.8v7.1c0,1,0.8,1.7,1.7,1.7h6.3 c1,0,1.7-0.8,1.7-1.7v-7.3c4.3-0.8,7.7-2.5,10.4-5.1c3.2-3.1,4.7-7.1,4.7-12.1c0-5.3-1.6-9.3-4.7-12.2c-3.1-2.8-8.1-5.7-14.8-8.5 c-2.9-1.3-4.9-2.5-5.9-3.8C239.5,91.95,239,90.25,239,88.35z"/></g></svg>
                <h4>За час</h4>
                <p>${transportData.price.per_hour}$</p>
            </div>

            <div class=${styles.price}>
                <svg class=${styles.icon} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3"><g>
                 <path d="M191,475.95l-76.6-0.4c-3.6,0-6.5-2.9-6.5-6.5l-1.4-40.4l-72.7-87.6c-10.7-11.4-18-24.2-20.3-39.6l-0.7-4.5L0.1,174.05 c-0.6-6.1,1.5-12.3,6.2-16.1c5.7-4.6,14.7-6.3,21.4,1.3c4.7,5.4,7,22.2,7.8,26.7c2.7,16.1,5.4,39.1,5.8,55.3c0,1.1,0.1,2.6,0.2,3.7 c0.4,7.1,2.1,13.7,5.1,20.2c16.4,35.6,49.3,80.6,49.3,80.6l1.8,2.7c1.4,2,4.1,2.7,6.3,1.5c2.4-1.3,3.2-4.4,1.8-6.7l-43.6-71.1 c-4.7-7.9-2-19.1,6.5-24.3c8.5-5.2,19.7-2.6,24.4,5.3l45.3,58.2c3,3.8,8.5,9.3,12.4,12.1c40.7,29.3,46.2,59.1,49.8,74.3 c0,0,0.3,3.4,0.4,8.3l0,0l0,0c0,4.1-0.1,9.2-0.8,14.3l-2.7,48.9C197.5,473.05,194.6,475.95,191,475.95z M46,167.85 c1.3,4.3,2.2,8.7,2.9,12.9c2.3,13.9,5.8,39,6,52.3c0,1.4,0.1,2.7,0.1,4.1c1.5-1.3,3.1-2.6,4.9-3.7c2.2-1.4,4.5-2.4,6.9-3.2 c0.1-0.2,0.2-0.3,0.3-0.4c-1.7-12.7-6.2-36.7-9.5-49.1C55.9,174.45,52.3,169.85,46,167.85z M70.4,185.45c2,9.2,7.2,26.1,8.4,35.1 l0.8,6.1c0.1,0.6,0.1,1.2,0.1,1.8c3.7,0.1,7.4,0.9,10.9,2.2c-1.2-8.2-6.7-24.6-8.7-32.3C80.1,192.05,76.5,187.55,70.4,185.45z M460.7,159.25c-4.7,5.4-7,22.2-7.8,26.7c-2.7,16.1-5.4,39.1-5.8,55.3c0,1.1-0.1,2.6-0.2,3.7c-0.4,7.1-2.1,13.7-5.1,20.2 c-16.4,35.6-49.3,80.6-49.3,80.6l-1.8,2.7c-1.4,2-4.1,2.7-6.3,1.5c-2.4-1.3-3.2-4.4-1.8-6.7l43.5-71c4.7-7.9,2-19.1-6.5-24.3 c-8.5-5.2-19.7-2.6-24.4,5.3l-45.3,58.2c-3,3.8-8.5,9.3-12.4,12.1c-40.7,29.3-46.2,59.1-49.8,74.3c0,0-0.3,3.4-0.4,8.3l0,0 c0,4.1,0.1,9.2,0.8,14.3l2.7,48.9c0,3.6,2.9,6.5,6.5,6.5l76.6-0.4c3.6,0,6.5-2.9,6.5-6.5l1.4-40.4l72.7-87.6 c10.7-11.4,18-24.2,20.3-39.6l0.7-4.5l12.7-122.9c0.6-6.1-1.5-12.3-6.2-16.1C476.4,153.35,467.4,151.65,460.7,159.25z M421.4,229.75c0.1,0.2,0.2,0.3,0.3,0.4c2.4,0.8,4.7,1.9,6.9,3.2c1.8,1.1,3.4,2.3,4.9,3.7c0-1.4,0.1-2.7,0.1-4.1 c0.3-13.3,3.7-38.4,6-52.3c0.7-4.2,1.5-8.5,2.9-12.9c-6.3,2.1-10,6.6-11.6,12.8C427.5,193.05,423.1,217.15,421.4,229.75z M397.9,230.45c3.5-1.3,7.2-2,10.9-2.2c0-0.6,0-1.2,0.1-1.8l0.8-6.1c1.2-8.9,6.3-25.8,8.4-35.1c-6.2,2.1-9.8,6.6-11.4,12.8 C404.6,205.85,399.1,222.25,397.9,230.45z M386.5,220.95c0-6-4.8-10.8-10.8-10.8H116.2c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8 h259.5C381.7,231.75,386.5,226.95,386.5,220.95z M347.8,260.05c0-6-4.8-10.8-10.8-10.8H135.4c-6,0-10.8,4.8-10.8,10.8 s4.8,10.8,10.8,10.8H337C343,270.85,347.8,266.05,347.8,260.05z M171.5,288.45c-6,0-10.8,4.8-10.8,10.8s4.8,10.8,10.8,10.8h129.3 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8H171.5z M324.8,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C340.1,94.15,333.2,87.35,324.8,87.35z M163.6,87.35c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3 c8.5,0,15.3-6.9,15.3-15.3C179,94.15,172.1,87.35,163.6,87.35z M390.1,167.75c0,13.9-11.3,25.3-25.3,25.3H123.6 c-13.9,0-25.3-11.3-25.3-25.3V37.65c0-13.9,11.3-25.3,25.3-25.3h241.2c13.9,0,25.3,11.3,25.3,25.3L390.1,167.75L390.1,167.75z M368.5,64.95c-2,0.5-4.1,0.8-6.3,0.8c-14.1,0-25.6-11.5-25.6-25.6c0-2.2,0.3-4.2,0.8-6.2H149.5c0.3,1.5,0.4,3.1,0.4,4.7 c0,14.1-11.5,25.6-25.6,25.6c-1.5,0-3-0.1-4.5-0.4v77.7c1.5-0.3,3-0.4,4.5-0.4c14.1,0,25.6,11.5,25.6,25.6c0,1.6-0.2,3.2-0.4,4.7 h187.2c-0.1-1-0.2-2.1-0.2-3.2c0-14.1,11.5-25.6,25.6-25.6c2.2,0,4.3,0.3,6.3,0.8v-78.5H368.5z M299.6,102.65 c0,30.6-24.8,55.4-55.4,55.4s-55.4-24.8-55.4-55.4s24.8-55.4,55.4-55.4C274.8,47.35,299.6,72.15,299.6,102.65z M239,88.35 c0-2,0.5-3.6,1.5-4.8c1-1.3,2.5-1.9,4.5-1.9c2,0,3.6,0.8,4.8,2.3c1,1.2,1.6,3,1.7,5.2c0.1,1,1,1.8,2,1.8l10.4-0.2 c1.1,0,2.1-1,2-2.1c-0.3-4.5-1.7-8.3-4.4-11.4c-2.7-3.2-6.4-5.2-10.9-6.1v-7.8c0-1-0.8-1.7-1.7-1.7h-6.3c-1,0-1.7,0.8-1.7,1.7v7.6 c-4.8,0.7-8.7,2.5-11.7,5.3c-3.3,3.2-4.9,7.2-4.9,12c0,5.4,1.6,9.5,4.7,12.3c3.1,2.8,8.1,5.5,14.9,8.2c2.8,1.2,4.7,2.4,5.8,3.7 c1.1,1.3,1.6,3,1.6,5.3c0,2-0.5,3.5-1.6,4.8c-1.1,1.2-2.6,1.8-4.7,1.8c-2.5,0-4.5-0.8-6.1-2.4c-1.3-1.3-2-3.3-2.3-5.9 c-0.1-1-1-1.8-2.1-1.8l-10.3,0.2c-1.1,0-2.1,1-2,2.1c0.3,5.5,2,9.7,5.3,12.7c3.6,3.2,8,5.2,13.3,5.8v7.1c0,1,0.8,1.7,1.7,1.7h6.3 c1,0,1.7-0.8,1.7-1.7v-7.3c4.3-0.8,7.7-2.5,10.4-5.1c3.2-3.1,4.7-7.1,4.7-12.1c0-5.3-1.6-9.3-4.7-12.2c-3.1-2.8-8.1-5.7-14.8-8.5 c-2.9-1.3-4.9-2.5-5.9-3.8C239.5,91.95,239,90.25,239,88.35z">
                     </g></svg>
                <h4>За день</h4>
                <p>${transportData.price.per_day}$</p>
            </div>
        </div>

        <form name="reviewForm" class=${styles.reviewForm} action="">
            <h2>Оставьте отзыв о транспорте</h2>
            <p>Это поможет нам узнать какой транспорт не пользуется
                популярностью и убрать его, а те которые понравились - зарядить побольше!</p>

            <div class=${styles.rating}>
                <input value="5" name="rating" id="star5" type="radio" required>
                <label for="star5"></label>

                <input value="4" name="rating" id="star4" type="radio">
                <label for="star4"></label>

                <input value="3" name="rating" id="star3" type="radio">
                <label for="star3"></label>

                <input value="2" name="rating" id="star2" type="radio">
                <label for="star2"></label>

                <input value="1" name="rating" id="star1" type="radio">
                <label for="star1"></label>
            </div>

            <h2>Расскажите о товаре</h2>

            <div class=${styles.inputGroup}>
                <label>Опишите плюсы транспорта*</label>
                <input required type="text" name="pluses" class=${styles.reviewInput} placeholder="Плюсы транспорта">
            </div>

            <div class=${styles.inputGroup}>
                <label>Опишите недостатки транспорта*</label>
                <input required type="text" name="cons" class=${styles.reviewInput} placeholder="Недостатки транспорта -">
            </div>

            <div class=${styles.inputGroup}>
                <label>Дополнительные комментарии</label>
                <input type="text" name="comments" class=${styles.reviewInput} placeholder="Дополнительные комментарии">
            </div>

            <button type="submit" class="${styles.submitButton} ${styles.button}">Отправить
                отзыв</button>
        </form>
    </main>

    <div class=${styles.reviewContainer} id="reviewContainer">
        <h2>Отзывы</h2>
    </div>

    <footer class=${styles.footer}>
        <button class=${styles.button} id="rentButton">Арендовать</button>

        <div class=${styles.help}>
            <h3>Tex поддержка</h3>
            <button class=${styles.button}>Связаться</button>
        </div>
    </footer>
    
    <script src="./script.js"></script>
    `

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', transportInfoPage);

    // Слайдер
    const prevButton = document.querySelector('#prevButton');
    const nextButton = document.querySelector('#nextButton');

    const slides = Array.from(document.querySelectorAll('#slide'));
    const slideCount = slides.length;
    let slideIndex = 0;

    slides.forEach((slide, index) => {
        slide.classList.toggle(styles.active, index === slideIndex);
    });

    prevButton.addEventListener('click', () => {
        slideIndex = (slideIndex - 1 + slideCount) % slideCount;

        slides.forEach((slide, index) => {
            slide.classList.toggle(styles.active, index === slideIndex);
        });
    });

    nextButton.addEventListener('click', () => {
        slideIndex = (slideIndex + 1) % slideCount;

        slides.forEach((slide, index) => {
            slide.classList.toggle(styles.active, index === slideIndex);
        });
    });

    const currentUser = firebaseAuth.getCurrentUser();
    // Выход на основную страницу
    document.querySelector('#arrowBack').addEventListener('click', () => {
        ROOT_ELEMENT.innerHTML = '';

        let isAdmin;

        if (currentUser.displayName) {
            isAdmin = currentUser.displayName.includes(PIECE_OF_ADMIN_NICKNAME);
        } else {
            isAdmin = false;
        }

        renderMainPage(isAdmin);
    });

    // Отзывы
    const reviewContainer = document.querySelector('#reviewContainer');

    if (transportData.reviews.length) {
        transportData.reviews.forEach((review) => {
            const reviewElement = `
            <div class=${styles.review}>
                <div class=${styles.reviewTop}>
                    <div class=${styles.userInfo}>
                        <p${review?.owner || 'anonim'}</p>
                        <p>${review.date}</p>
                    </div>
                </div>
                
                <div class=${styles.reviewSection}>
                    <div class="${styles.sectionTitle} ${styles.pluses}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L4 12l8 10 8-10z"/>
                        </svg>
                        Плюсы
                    </div>

                    <div>${review.pluses}</div>
                </div>
                
                <div class=${styles.reviewSection}>
                    <div class="${styles.sectionTitle} ${styles.cons}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22L4 12l8-10 8 10z"/>
                        </svg>
                        Минусы
                    </div>
                    <div>${review.cons}</div>
                </div>
                
                <div class=${styles.reviewSection} id="commentsSection">
                    <div class="${styles.sectionTitle} ${styles.comments}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 
                                6.115l-.78 2.77 3.116-1.65c.88.275 1.823.425 2.775.425 4.97 
                                0 9-3.186 9-7.115C21 6.186 16.97 3 12 3z"/>
                        </svg>
                        Дополнительные комментарии
                    </div>

                    <div>${review?.comments}</div>
                </div>
            </div>`

            reviewContainer.insertAdjacentHTML('beforeend', reviewElement);

            if (!review.comments) {
                document.querySelector('#commentsSection').remove();
            }
        })
    } else {
        reviewContainer.innerHTML = ''
    }

    // Добавление отзывов
    const reviewForm = document.forms.reviewForm;

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const form = event.target
        const formElements = form.elements;

        const rating = document.querySelector('input[name="rating"]:checked').value;

        const pluses = formElements.pluses.value;
        const cons = formElements.cons.value;
        const comments = formElements.comments.value;

        const review = {
            owner: currentUser.displayName || 'anonim',
            rating: Number(rating),
            pluses,
            cons,
            comments,
            date: new Date().toLocaleString()
        };

        triggerPopUp({
            title: 'Спасибо!',
            text: 'Ваше мнение – топливо для нашего прогресса ⚡',
        })

        transportData.reviews.push(review);
        firebaseFirestore.updateDoc(TRANSPORT_COLLECTION_NAME, transportData.plate_number, transportData)
    });

    // Аренда
    const rentButtons = document.querySelectorAll('#rentButton');

    for (let i = 0; i < rentButtons.length; i++) {
        const rentButton = rentButtons[i];

        rentButton.addEventListener('click', async () => {
            startLoading('default');

            ROOT_ELEMENT.innerHTML = '';

            let isAdmin;

            if (currentUser.displayName) {
                isAdmin = currentUser.displayName.includes(PIECE_OF_ADMIN_NICKNAME);
            } else {
                isAdmin = false;
            }

            transportData.status = 'rented';

            const markersData = await firebaseFirestore.getDoc(
                TRANSPORT_MARKERS_COLLECTION_NAME,
                TRANSPORT_MARKERS_DOC_ID
            );

            const transportMarkerData = markersData.transportData;

            const rentedTransport = transportMarkerData.find(
                (transport) => transport.plate_number === transportData.plate_number
            )

            rentedTransport.status = 'rented';

            await firebaseFirestore.updateDoc(
                TRANSPORT_COLLECTION_NAME,
                transportData.plate_number,
                transportData
            );

            await firebaseFirestore.updateDoc(
                TRANSPORT_MARKERS_COLLECTION_NAME,
                TRANSPORT_MARKERS_DOC_ID,
                { transportData: transportMarkerData }
            );

            localStorage.setItem('rentedTransportId', rentedTransport.plate_number)
            stopLoading();

            const isOnTrip = true;

            renderMainPage(isAdmin, isOnTrip);

            await displayWeather();

            const weatherCard = document.querySelector('#weatherCard');

            setTimeout(() => {
                weatherCard.classList.add(weatherActive);
            }, 1000)
        })
    }
}