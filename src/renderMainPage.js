import { initMap, renderTransportContainer, renderHeader } from "./index.js";

export function renderMainPage(isAdmin = false, isOnTrip = false) {
    initMap();
    renderTransportContainer();
    renderHeader(isAdmin, isOnTrip);
}