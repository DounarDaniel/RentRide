import { MAP_OPTIONS, ROOT_ELEMENT } from '../constants.js';
import { addMapMarkers } from "./addMapMarkers.js";
import { watchUserPosition } from "./watchUserPos.js";
import { startLoading, stopLoading } from '../index.js';

let map;
export async function initMap() {
    startLoading()

    createAndAppendMapElement();

    try {
        map = new google.maps.Map(document.getElementById('map'), MAP_OPTIONS);
    } catch (error) {
        window.location.reload();
        console.error('Error in creating map element', error);
    }

    await addMapMarkers(map);

    if (navigator.geolocation) {
        watchUserPosition(map)
    } else {
        alert("Геолокация не поддерживается вашим браузером");
        console.warn("Геолокация не поддерживается вашим браузером");
    }

    stopLoading();
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
