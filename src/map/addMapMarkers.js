import { firebase } from "../index.js";
import { TRANSPORT_COLLECTION_NAME, TRANSPORT_DOC_ID } from '../constants.js';

export async function addMapMarkers(map) {
    const transportData = await firebase.getDoc(TRANSPORT_COLLECTION_NAME, TRANSPORT_DOC_ID);
    const transportList = transportData.transportList;

    transportList.forEach(transport => {
        const position = {
            lat: +transport.cords.lat,
            lng: +transport.cords.lon
        };

        let transportImageUrl

        switch (transport.name) {
            case 'scooter':
                transportImageUrl = '../../public/mapIcons/scooter.png'
                break;
            case 'car':
                transportImageUrl = '../../public/mapIcons/car.png'
                break
            case 'moped':
                transportImageUrl = '../../public/mapIcons/moped.png'
                break
            case 'electric_bike':
                transportImageUrl = '../../public/mapIcons/electric_bike.png'
                break
            case 'bike':
                transportImageUrl = '../../public/mapIcons/pedal_bike.png'
                break
            default:
                transportImageUrl = '../../public/mapIcons/help.png'
                break;
        }

        const marker = new google.maps.Marker({
            position,
            map,
            title: transport.name,
            icon: {
                url: transportImageUrl,
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15)
            },

            info: new google.maps.InfoWindow({
                content: transport.basic_info
            })
        })

        marker.addListener('click', function () {
            this.info.open(map, this);
        });
    });
}