import { initMap, createTransportContainer, renderHeader } from "./index.js";

export function renderMainPage(){
    initMap();
    createTransportContainer();
    renderHeader();
}