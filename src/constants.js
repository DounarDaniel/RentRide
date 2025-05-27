import { lightMapStyle } from "./mapStyles";

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCSTSl4bXYt7Qnu1AOCkZsZzWarA7r8kXw",
    authDomain: "rentride-3ff8a.firebaseapp.com",
    projectId: "rentride-3ff8a",
    storageBucket: "rentride-3ff8a.firebasestorage.app",
    messagingSenderId: "549020825518",
    appId: "1:549020825518:web:c4748c73d785ee23e7fa3f",
    measurementId: "G-F84P41D9MH"
};

export const TRANSPORT_MARKERS_COLLECTION_NAME = "transportMarkersData";
export const TRANSPORT_MARKERS_DOC_ID = "aCRWqZndAxq46h5IMtP5";

export const TRANSPORT_COLLECTION_NAME = 'transport';

export const TRIPS_COLLECTION_NAME = 'trips';

export const DEFAULT_AVATAR = 'https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg';

const DEFAULT_MAP_ZOOM = 10;
const MIN_MAP_ZOOM = DEFAULT_MAP_ZOOM - 7.3;
const MAX_MAP_ZOOM = DEFAULT_MAP_ZOOM + 6;
const MAP_CENTER = { lat: 53.900252, lng: 27.546308 };

export const MAP_OPTIONS = {
    center: MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    minZoom: MIN_MAP_ZOOM,
    maxZoom: MAX_MAP_ZOOM,
    styles: lightMapStyle
}

export const ROOT_ELEMENT = document.querySelector('#root');
export const DOCUMENT_ELEMENT = document.documentElement;

export const ESC_KEY_CODE = 27;
export const TRANSPORT_LIST = ['scooter', 'car', 'moped', 'electric_bike', 'bike'];

export const PIECE_OF_ADMIN_NICKNAME = 'adminLK0';

export const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};