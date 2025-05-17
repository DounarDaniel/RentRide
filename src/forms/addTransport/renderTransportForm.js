import { ROOT_ELEMENT, TRANSPORT_LIST } from '../../constants';
import { renderMainPage, startLoading, triggerPopUp } from '../../index.js';
import { createAndAppendFormContainer } from '../createFormContainer'

import generalStyles from '../style.module.css'
import { submitErrorHandle } from '../submitHandlers.js';
import additionalStyles from './addTransport.module.css'

export function renderTransportForm() {
    const container = createAndAppendFormContainer();
    ROOT_ELEMENT.style.overflow = 'visible'

    const form = `
    <form class=${generalStyles.form} name="addTransport" action="" id="addTransportForm">
        <h2 class=${generalStyles.title}>RentRide</h2>
        <p class=${generalStyles.subtitle}>Добавить транспорт</p>

        <div class=${generalStyles.inputGroup}>
            <label for="transportImage">Картинка транспорта (вживую)*</label>
            <input type="file" id="transportImage" name="transportImage" required>
        </div>

        <div class=${generalStyles.inputGroup}>
            <select name="transportTypeSelect" id="transportTypeSelect" class=${additionalStyles.select}></select>
            <p class=${generalStyles.infoText}></p>
        </div>

        <div class=${generalStyles.inputGroup}>
            <label for="transportNumber">Номер транспорта*</label> 
            <input type="text" id="transportNumber" name="transportNumber" placeholder="Введите номер транспорта" required>
            <p class=${generalStyles.infoText}></p>
        </div>

        <div class=${generalStyles.inputGroup}>
            <label for="fuelLevel">Заряд батареи / Количество бензина*</label>

            <div class=${additionalStyles.sliderContainer}>  
                <div class=${additionalStyles.sliderFill} id='sliderFill'></div>

                <input type="range" class=${additionalStyles.slider} id="fuelLevel" min="1" max="100"
                    value="30" name="fuelLevel" required>
                <span class=${additionalStyles.batteryPercentage} id='batteryPercentage'>30%</span>
            </div>
        </div>

        <div class=${generalStyles.inputGroup}>
            <label for="nearby">Транспорт находится рядом с вами</label>
            <input type="checkbox" id="nearby" name="nearby">
        </div>

        <hr class=${generalStyles.orLine}>

        <div class=${generalStyles.inputGroup}>
            <label for="address ">Адрес транспорта</label> 
            <input type="text" id="address " name="address " placeholder="Введите адрес транспорта">
            <p class=${generalStyles.infoText}></p>
            <button type="button" id="addressSearch" class=${generalStyles.button}>Найти</button>
        </div>

        <button type="submit" class=${generalStyles.button}>Добавить</button>
        <button type="button" class=${generalStyles.button} id="cancelBtn">Отмена</button>
    </form>`

    // TODO: сделать так чтобы можно было вводить трансорт

    container.insertAdjacentHTML('afterbegin', form);
    ROOT_ELEMENT.appendChild(container);

    const batteryLevelInput = document.querySelector('#fuelLevel');
    const sliderFill = document.querySelector('#sliderFill');
    const batteryPercentageSpan = document.querySelector('#batteryPercentage');

    batteryLevelInput.addEventListener('input', function () {
        const percentage = this.value;
        sliderFill.style.width = percentage + '%';
        batteryPercentageSpan.textContent = percentage + '%';
    })

    const transportTypeSelect = document.querySelector('#transportTypeSelect');

    TRANSPORT_LIST.forEach(transportName => {
        const option = `<option value="${transportName}">${transportName}</option>`;
        transportTypeSelect.insertAdjacentHTML('afterbegin', option);
    })

    document.querySelector('#cancelBtn').addEventListener('click', function () {
        ROOT_ELEMENT.style.overflow = 'hidden';
        container.remove();
        renderMainPage(true);
    })

    const addressSearchBtn = document.querySelector('#address Search');
    const addressInput = document.querySelector('#address ')

    addressSearchBtn.addEventListener('click', async () => {
        const address = addressInput.value;

        if (address.trim().lenght > 0) {
            startLoading('default')
            const responce = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);

            if (!responce.ok) {
                submitErrorHandle([addressInput]);
                return;
            }

            console.log(responce)
        }
    })
}
