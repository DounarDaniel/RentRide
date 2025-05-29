import { ROOT_ELEMENT, WEATHER_API_KEY } from '../constants.js';
import { getWeatherBackground, getWeatherIcon } from './weatherPicturesHandler.js';

import styles from './weather.module.css'

export async function displayWeather() {
    try {
        const ipResponse = await fetch('https://ipapi.co/json/');

        if (!ipResponse.ok) throw new Error('Location error');

        const location = await ipResponse.json();
        const lat = location.latitude;
        const lon = location.longitude;
        const city = location.city;

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) throw new Error('Weather data error');
        const currentWeather = await weatherResponse.json();

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) throw new Error('Forecast data error');
        const forecast = await forecastResponse.json();

        const hourlyForecast = forecast.list[0];

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        const tomorrowForecast = forecast.list.find(item => {
            const itemDate = new Date(item.dt * 1000);

            return itemDate.getDate() === tomorrow.getDate() &&
                itemDate.getHours() === 12;
        }) || forecast.list[8];

        const weatherCard = document.createElement('div');
        weatherCard.classList.add(styles.weatherCard);
        weatherCard.setAttribute('id', 'weatherCard');

        // Поменять классы 
        const weather = `
            <div class=${styles.weatherCardTop}>
                <p>${currentWeather.weather[0].main}</p>
                <p>${city.toUpperCase()}</p>
                <p>${new Date().toLocaleString()}</p>
                <h1>${Math.round(currentWeather.main.temp)}°C</h1>
            </div>

            <div class=${styles.weatherImage} style="background-image: url('${getWeatherBackground(currentWeather.weather[0].main)}')">
                <img src="${getWeatherIcon(currentWeather.weather[0].icon)}" alt="Weather icon" style="width: 150px; height: 100%; object-fit: cover;">
            </div>

            <div class=${styles.weatherCardBottom}>
                <table>
                    <tr>
                        <td>Через час</td>
                        <td>${Math.round(hourlyForecast.main.temp)}°C</td>
                    </tr>

                    <tr>
                        <td>Завтра</td>
                        <td>${Math.round(tomorrowForecast.main.temp)}°C</td>
                    </tr>
                </table>
            </div>`

        weatherCard.insertAdjacentHTML('afterbegin', weather);

        ROOT_ELEMENT.appendChild(weatherCard);
    } catch (error) {
        console.error('Error:', error);
    }
}