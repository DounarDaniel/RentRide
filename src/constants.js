export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCSTSl4bXYt7Qnu1AOCkZsZzWarA7r8kXw",
    authDomain: "rentride-3ff8a.firebaseapp.com",
    projectId: "rentride-3ff8a",
    storageBucket: "rentride-3ff8a.firebasestorage.app",
    messagingSenderId: "549020825518",
    appId: "1:549020825518:web:c4748c73d785ee23e7fa3f",
    measurementId: "G-F84P41D9MH"
};

export const TRANSPORT_COLLECTION_NAME = "transport";
export const TRANSPORT_DOC_NAME = "transportList";
export const TRANSPORT_DOC_ID = "ONqHzt5Wqka6s8UQs93U";

const DEFAULT_MAP_ZOOM = 10;
const MIN_MAP_ZOOM = DEFAULT_MAP_ZOOM - 7.3;
const MAX_MAP_ZOOM = DEFAULT_MAP_ZOOM + 6;
const MAP_CENTER = { lat: 53.900252, lng: 27.546308 };

export const MAP_OPTIONS = {
    center: MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    minZoom: MIN_MAP_ZOOM,
    maxZoom: MAX_MAP_ZOOM,
    // styles: darkMapStyles
}

export const ROOT_ELEMENT = document.querySelector('#root');
