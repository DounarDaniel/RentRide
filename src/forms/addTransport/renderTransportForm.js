import { MAP_OPTIONS, ROOT_ELEMENT, TRANSPORT_LIST } from '../../constants';
import { renderMainPage, triggerPopUp } from '../../index.js';
import { createAndAppendFormContainer } from '../createFormContainer';

import generalStyles from '../style.module.css'
import additionalStyles from './addTransport.module.css'

export function renderTransportForm() {
    const container = createAndAppendFormContainer();
    ROOT_ELEMENT.style.overflow = 'visible'

    const form = `
    <form class=${generalStyles.form} name="addTransport" action="" id="addTransportForm">
        <h2 class=${generalStyles.title}>RentRide</h2>
        <p class=${generalStyles.subtitle}>Добавить транспорт</p>

        <div class=${generalStyles.inputGroup}>
            <label for="transportImage">Картинка транспорта (вживую)</label>
            <input type="file" id="transportImage" name="transportImage">
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

        <div class=${additionalStyles.addressInputGroup}>
            <label for="address">Адрес транспорта</label> 

            <div class=${additionalStyles.addressBox} id="addressBox">
                <input type="text" id="address" name="address" placeholder="Введите адрес транспорта" class=${additionalStyles.addressInput}>
                <p class=${generalStyles.infoText}></p>
                <button type="button" id="addressSearch" class="${additionalStyles.searchAddressBtn} ${generalStyles.button}">Найти</button>
            </div>
        </div>

        <div class=${additionalStyles.inputGroup} id="addresses"></div>
        <p id="choosenAddress"></p>

        <button type="submit" class=${generalStyles.button}>Добавить</button>
        <button type="button" class=${generalStyles.button} id="cancelBtn">Отмена</button>
    </form>`

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

    const addressSearchBtn = document.querySelector('#addressSearch');
    const addressInput = document.querySelector('#address');

    const addressList = document.querySelector('#addresses');

    addressSearchBtn.addEventListener('click', async () => {
        const address = addressInput.value;

        if (address.trim().length < 0) {
            return;
        }

        const responce = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);

        if (!responce.ok) {
            triggerPopUp({ title: 'Адрес не найден', text: 'Перепроверьте адрес и введите его ещё раз!' });
            return;
        }

        const result = await responce.json();

        if (result.length === 0) {
            triggerPopUp({ title: 'Адрес не найден', text: 'Перепроверьте адрес и введите его ещё раз!' });
            return;
        }

        let transportMap = document.querySelector('#transportMap')

        if (!!transportMap) {
            transportMap.remove();
        }

        const mapElem = document.createElement('div');
        mapElem.setAttribute('id', 'transportMap');
        mapElem.style.width = '100%';
        mapElem.style.height = '150px';

        addressList.appendChild(mapElem);

        const map = new google.maps.Map(document.querySelector('#transportMap'), MAP_OPTIONS);

        result.forEach((address) => {
            const position = {
                lat: +address.lat,
                lng: +address.lon,
            }

            const chooseBtn = document.createElement('button');
            chooseBtn.innerText = 'Выбрать'
            chooseBtn.classList.add(additionalStyles.chooseBtn);
            chooseBtn.setAttribute('type', 'button');

            console.log(address)
            chooseBtn.onclick = () => {
                const isSure = confirm(`Вы точно хотите выбрать этот адрес: ${address.display_name}`)

                if (isSure) {
                    mapElem.remove();
                    addressInput.value = '';

                    document.querySelector('#choosenAddress').innerText = `Выбранный адрес: ${address.display_name}`
                    localStorage.setItem('choosenPosition', JSON.stringify(position));
                }
            }

            const infoWindow = new google.maps.InfoWindow({
                content: chooseBtn,
                position,
            })

            const marker = new google.maps.Marker({
                position,
                map,
                icon: {
                    url: '../../../location.png',
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 15)
                },

                info: infoWindow,
            })

            marker.addListener('click', function () {
                this.info.open(map, this);
            });
        })
    })
}