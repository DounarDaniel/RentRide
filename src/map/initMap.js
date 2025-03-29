import { MAP_OPTIONS, ROOT_ELEMENT } from '../constants.js';
import { addMapMarkers } from "./addMapMarkers.js";
import { watchUserPosition } from "./watchUserPos.js";

export async function initMap() {
    createAndAppendMapElement()
    let map;

    try {
        map = new google.maps.Map(document.getElementById('map'), MAP_OPTIONS);
    } catch (error) {
        console.log(error)
    }

    await addMapMarkers(map);

    if (navigator.geolocation) {
        watchUserPosition(map)
    } else {
        alert("Геолокация не поддерживается вашим браузером");
        console.warn("Геолокация не поддерживается вашим браузером");
    }
}

function createAndAppendMapElement() {
    const mapWidth = '100%';
    const mapHeight = '100vh'

    const mapElem = document.createElement('div');
    mapElem.setAttribute('id', 'map');
    mapElem.style.width = mapWidth;
    mapElem.style.height = mapHeight;

    ROOT_ELEMENT.appendChild(mapElem);
}
