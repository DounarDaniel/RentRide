import { GEOLOCATION_OPTIONS } from "../constants";

let userMarker = null;
let watchId = null;

export function watchUserPosition(map) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            updateUserPosition(position, map);

            watchId = navigator.geolocation.watchPosition(
                updateUserPosition,
                (error) => {
                    console.error("Ошибка геолокации:", error);
                },
                GEOLOCATION_OPTIONS
            );
        },
        (error) => {
            console.error("Ошибка геолокации:", error);
        },
        GEOLOCATION_OPTIONS
    );
}

function updateUserPosition(position, map) {
    const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    if (!userMarker) {
        userMarker = new google.maps.Marker({
            position: userPos,
            map,
            title: "Ваше местоположение",
            icon: {
                url: '../../mapIcons/location.png',
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15),
            },

            info: new google.maps.InfoWindow({
                content: 'Ваше местонахождение'
            })
        });

        userMarker.addListener('click', function () {
            this.info.open(map, this);
        });
    } else {
        userMarker.setPosition(userPos);
    }
}

// function stopTracking(watchId) {
//     navigator.geolocation.clearWatch(watchId);
// }