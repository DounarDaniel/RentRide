import { initMap, renderTransportContainer, renderHeader } from "./index.js";

export function renderMainPage(isAdmin) {
    initMap();
    renderTransportContainer();
    renderHeader(isAdmin);
}