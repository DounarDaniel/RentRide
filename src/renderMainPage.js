import { initMap, renderTransportContainer, renderHeader } from "./index.js";

export function renderMainPage(isAdmin = false) {
    initMap();
    renderTransportContainer();
    renderHeader(isAdmin);
}