import { TRANSPORT_COLLECTION_NAME, TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID } from "../../constants";
import { firebase, renderMainPage, triggerPopUp, startLoading, stopLoading } from "../../index.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";
import { renderTransportForm } from "./renderTransportForm";

export async function addTransport() {
    renderTransportForm();
    const form = document.forms.addTransport;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.target
        const formElements = form.elements;

        const imageInput = formElements.transportImage;

        const transportTypeSelect = formElements.transportTypeSelect;
        const transportType = transportTypeSelect.selectedOptions[0].value;

        const transportNumberInput = formElements.transportNumber
        const transportNumber = transportNumberInput.value;

        const fuelLevel = formElements.fuelLevel.value;

        const loaderType = 'addTransportLoader';
        startLoading(loaderType);

        let transportData;
        const TRANSPORT_URL = `
            https://68135912129f6313e210ff51.mockapi.io/api/rentride/vehicles?plate_number=${transportNumber}
        `

        try {
            const responce = await fetch(TRANSPORT_URL);

            if (!responce.ok) {
                throw new Error('Такого номера не существует!')
            }

            transportData = await responce.json();

            if (!transportData) {
                throw new Error('Не получена transportData');
            }

            transportData = transportData[0]

            submitSuccessHandle([transportNumberInput]);
        } catch (error) {
            stopLoading();
            console.error(error);

            submitErrorHandle([transportNumberInput]);
        }

        if (transportData.type !== transportType) {
            submitErrorHandle([transportTypeSelect, transportNumberInput]);
            stopLoading();
            return;
        } else {
            submitSuccessHandle([transportTypeSelect, transportNumberInput]);
        }

        if (await firebase.getDoc(TRANSPORT_COLLECTION_NAME, transportData.plate_number)) {
            stopLoading()
            submitErrorHandle([transportTypeSelect, transportNumberInput]);

            triggerPopUp({
                title: 'Error',
                text: 'Такой транспорт уже существует!'
            })

            return;
        } else {
            submitSuccessHandle([transportTypeSelect, transportNumberInput]);
        }

        const newTransport = {
            status: 'addedByAdmin',
            picture: URL.createObjectURL(imageInput.files[0]),
            plate_number: transportData.plate_number,
            type: transportData.type,
            basic_info: transportData.basic_info,
            additional_info: transportData.additional_info,
            model: transportData.model,
            price: transportData.prices,
            fuelLevel,
            reviews: [],
            cords: {}
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    newTransport.cords.lat = latitude;
                    newTransport.cords.lon = longitude;

                    const transportMarkersNewData = {
                        status: newTransport.status,
                        plate_number: newTransport.plate_number,
                        cords: newTransport.cords,
                        basic_info: newTransport.basic_info,
                        type: newTransport.type,
                    }

                    try {
                        await firebase.setDoc(
                            TRANSPORT_COLLECTION_NAME,
                            transportData.plate_number,
                            newTransport
                        )

                        const transportMarkersPrevData = await firebase.getDoc(
                            TRANSPORT_MARKERS_COLLECTION_NAME,
                            TRANSPORT_MARKERS_DOC_ID
                        )

                        await firebase.updateDoc(
                            TRANSPORT_MARKERS_COLLECTION_NAME,
                            TRANSPORT_MARKERS_DOC_ID,
                            { transportData: [...transportMarkersPrevData.transportData, transportMarkersNewData] }
                        )
                    } catch (error) {
                        console.error(error)
                        stopLoading();
                    }

                    stopLoading();
                    form.remove();

                    renderMainPage(true);
                },
                (error) => {
                    switch (error.code) {
                        case 'PERMISSION_DENIED':
                            triggerPopUp({
                                title: 'Ошибка геолокации',
                                text: 'Доступ к геолокации запрещён. Разрешите его в настройках браузера'
                            })

                            break;
                        case 'POSITION_UNAVAILABLE':
                            triggerPopUp({
                                title: 'Ошибка геолокации',
                                text: 'Не удалось получить данные геолокации.'
                            })

                            break;
                        case 'TIMEOUT':
                            triggerPopUp({
                                title: 'Ошибка геолокации',
                                text: 'Время ожидания истекло.'
                            })

                            break;
                        default:
                            alert('Ошибка геолокации');
                            break;
                    }
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
    })
}