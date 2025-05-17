import { TRANSPORT_COLLECTION_NAME, TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID } from "../../constants";
import { firebaseFirestore, renderMainPage, triggerPopUp, startLoading, stopLoading } from "../../index.js";
import { submitErrorHandle, submitSuccessHandle } from "../submitHandlers.js";
import { renderTransportForm } from "./renderTransportForm";

export async function addTransport() {
    renderTransportForm();
    const form = document.forms.addTransport;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Получение данных с формы
        const form = event.target
        const formElements = form.elements;

        const imageInput = formElements.transportImage;

        const transportTypeSelect = formElements.transportTypeSelect;
        const transportType = transportTypeSelect.selectedOptions[0].value;

        const transportNumberInput = formElements.transportNumber
        const transportNumber = transportNumberInput.value;

        const fuelLevel = formElements.fuelLevel.value;

        // Начало загрузки
        const loaderType = 'addTransportLoader';
        startLoading(loaderType);

        let transportData;
        const TRANSPORT_URL = `
            https://68135912129f6313e210ff51.mockapi.io/api/rentride/vehicles?plate_number=${transportNumber}
        `

        // Проверка номера транспорта и получение данных из MockAPI
        try {
            const responce = await fetch(TRANSPORT_URL);

            if (!responce.ok) {
                stopLoading();

                triggerPopUp({
                    title: 'Такого номера не существует!',
                    text: 'Проверьте пожалуйсто номер транспорта'
                })

                submitErrorHandle([transportNumberInput])

                throw new Error('Такого номера не существует!');
            }

            transportData = await responce.json();

            if (!transportData) {
                throw new Error('Ошибка получения данных');
            }

            transportData = transportData[0]

            submitSuccessHandle([transportNumberInput]);
        } catch (error) {
            stopLoading();
            console.error(error);

            submitErrorHandle([transportNumberInput]);
            return;
        }

        // Проверка на тип транспорта
        if (transportData.type !== transportType) {
            submitErrorHandle([transportTypeSelect, transportNumberInput]);
            stopLoading();
            return;
        } else {
            submitSuccessHandle([transportTypeSelect, transportNumberInput]);
        }

        // Проверка на уникальность
        if (await firebaseFirestore.getDoc(TRANSPORT_COLLECTION_NAME, transportData.plate_number)) {
            stopLoading()
            submitErrorHandle([transportTypeSelect, transportNumberInput]);

            triggerPopUp({
                title: 'Такой транспорт уже существует!',
                text: 'Такой транспорт уже существует!'
            })

            return;
        } else {
            submitSuccessHandle([transportTypeSelect, transportNumberInput]);
        }

        const newTransport = {
            status: 'active',
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

        const transportMarkersNewData = {
            status: newTransport.status,
            plate_number: newTransport.plate_number,
            cords: {},
            basic_info: newTransport.basic_info,
            type: newTransport.type,
        }

        if (formElements.nearby.checked) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        addDataToFirebaseAndFinish(
                            transportData,
                            newTransport,
                            transportMarkersNewData,
                            position.coords,
                            form
                        )
                    },
                    (error) => {
                        switch (error.code) {
                            case 'PERMISSION_DENIED':
                                stopLoading();

                                triggerPopUp({
                                    title: 'Ошибка геолокации',
                                    text: 'Доступ к геолокации запрещён. Разрешите его в настройках браузера'
                                })

                                break;
                            case 'POSITION_UNAVAILABLE':
                                stopLoading();

                                triggerPopUp({
                                    title: 'Ошибка геолокации',
                                    text: 'Не удалось получить данные геолокации.'
                                })

                                break;
                            case 'TIMEOUT':
                                stopLoading();

                                triggerPopUp({
                                    title: 'Ошибка геолокации',
                                    text: 'Время ожидания истекло.'
                                })

                                break;
                            default:
                                stopLoading();

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
                stopLoading();
                console.error("Геолокация не поддерживается вашим браузером");
                alert("Ваш браузер не поддерживает геолокацию!");
                return;
            }
        } else {
            const choosenPosition = localStorage.getItem('choosenPosition');

            if (!choosenPosition || choosenPosition.length === 0) {
                stopLoading();
                return;
            }

            const parsedPosition = JSON.parse(choosenPosition);

            addDataToFirebaseAndFinish(
                transportData, 
                newTransport, 
                transportMarkersNewData,
                parsedPosition, 
                form
            )
        }
    })
}

async function addDataToFirebaseAndFinish(transportData, newTransport, transportMarkersNewData, cords, form) {
    newTransport.cords = cords;
    transportMarkersNewData.cords = cords;

    try {
        await firebaseFirestore.setDoc(
            TRANSPORT_COLLECTION_NAME,
            transportData.plate_number,
            newTransport
        )

        const transportMarkersPrevData = await firebaseFirestore.getDoc(
            TRANSPORT_MARKERS_COLLECTION_NAME,
            TRANSPORT_MARKERS_DOC_ID
        )

        await firebaseFirestore.updateDoc(
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
}