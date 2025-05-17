import { TRANSPORT_MARKERS_DOC_ID, TRANSPORT_MARKERS_COLLECTION_NAME } from "../constants.js";
import { firebaseFirestore } from "../index.js";
import { renderTransportCard } from "../transportCard/renderTransportCard.js";

export async function addMapMarkers(map) {
    const transportMarkersData = await firebaseFirestore.getDoc(TRANSPORT_MARKERS_COLLECTION_NAME, TRANSPORT_MARKERS_DOC_ID)
    const transportList = transportMarkersData.transportData;

    transportList.forEach(transport => {
        const position = {
            lat: +transport.cords.lat,
            lng: +transport.cords.lon
        };

        let transportImageUrl

        switch (transport.type) {
            case 'scooter':
                transportImageUrl = '../../mapIcons/scooter.png'
                break;
            case 'car':
                transportImageUrl = '../../mapIcons/car.png'
                break
            case 'moped':
                transportImageUrl = '../../mapIcons/moped.png'
                break
            case 'electric_bike':
                transportImageUrl = '../../mapIcons/electric_bike.png'
                break
            case 'bike':
                transportImageUrl = '../../mapIcons/pedal_bike.png'
                break
            default:
                transportImageUrl = '../../mapIcons/help.png'
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
                url: '../../mapIcons/scooter.png',
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