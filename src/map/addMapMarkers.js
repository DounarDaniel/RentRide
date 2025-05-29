import { TRANSPORT_MARKERS_DOC_ID, TRANSPORT_MARKERS_COLLECTION_NAME } from "../constants.js";
import { firebaseFirestore } from "../index.js";
import { renderTransportCard } from "../transportCard/renderTransportCard.js";

export async function addMapMarkers(map) {
    const transportMarkersData = await firebaseFirestore.getDoc(TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID)
    const transportList = transportMarkersData.transportData;

    if (!transportList.length) {
        return;
    }

    transportList.forEach(transport => {
        if (transport.status !== 'active') {
            return;
        }

        const position = {
            lat: +transport.cords.lat,
            lng: +transport.cords.lng
        };

        let transportImage

        const theme = localStorage.getItem('theme') || 'light'

        let color;

        if (theme === 'light') {
            color = 'black'
        } else {
            color = 'white';
        }

        switch (transport.type) {
            case 'scooter':
                transportImage = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14C16.8954 14 16 14.8954 16 16C16 17.1046 16.8954 18 18 18Z" stroke="black" stroke-width="2"/>
                    <path d="M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14C4.89543 14 4 14.8954 4 16C4 17.1046 4.89543 18 6 18Z" stroke="black" stroke-width="2"/>
                    <path d="M8 16H16M10 16L12 6H14M16 12H20" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                </svg>`
                break;

            case 'electro_bike':
                transportImage = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="17" r="3" stroke="${color}" stroke-width="2"/>
                    <circle cx="17" cy="17" r="3" stroke="${color}" stroke-width="2"/>
                    <path d="M10 17L14 7H17M14 17L10 7H7" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="14" cy="7" r="1" fill="${color}"/> <!-- Электро-значок -->
                </svg>`

            case 'car':
                transportImage = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="10" width="16" height="6" rx="1" fill="${color}"/>
                    <rect x="6" y="6" width="12" height="4" fill="${color}"/>
                    <circle cx="8" cy="16" r="2" fill="${color}"/>
                    <circle cx="16" cy="16" r="2" fill="${color}"/>
                </svg>`
                break

            case 'electric_scooter':
                transportImage =
                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14C16.8954 14 16 14.8954 16 16C16 17.1046 16.8954 18 18 18Z" stroke="black" stroke-width="2"/>
                    <path d="M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14C4.89543 14 4 14.8954 4 16C4 17.1046 4.89543 18 6 18Z" stroke="black" stroke-width="2"/>
                    <path d="M8 16H16M10 16L12 6H14M16 12H20" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="6" r="1" fill="${color}"/>
                </svg>`

                break

            case 'bike':
                transportImage = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="17" r="3" stroke="${color}" stroke-width="2"/>
                    <circle cx="17" cy="17" r="3" stroke="${color}" stroke-width="2"/>
                    <path d="M10 17L14 7H17M14 17L10 7H7" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                </svg>`
                break

            default:
                transportImage = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2"/>
                    <circle cx="12" cy="18" r="1" fill="${color}"/>
                    <path d="M12 14V12.5C12 11 13 11 13 10C13 9 12 8 11 8C10 8 9 9 9 10" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                </svg>`
                break;
        }

        const infoWindowContent = `
        <div>
            <h3>${transport.type}</h3>
            <p>${transport.basic_info}</p>
            <p>Номер: ${transport.plate_number}</p>
        </div>`

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        })

        const marker = new google.maps.Marker({
            position,
            map,
            title: transport.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(transportImage))),
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15)
            },

            info: infoWindow,
        })

        marker.addListener('click', function () {
            this.info.open(map, this);
        });

        renderTransportCard(transport.plate_number);
    });
}