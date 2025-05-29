const API_KEY = '776a2046074c1c6eea6f33521c8af590';

function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function getWeatherBackground(weatherMain) {
    const weatherImages = {
        'Clear': 'https://images.unsplash.com/photo-1516912481808-3406841bd33c',
        'Clouds': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
        'Rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
        'Snow': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5',
        'Thunderstorm': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b',
        'Drizzle': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
        'Mist': 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55',
        'Fog': 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55'
    };
    return weatherImages[weatherMain] || 'https://images.unsplash.com/photo-1516912481808-3406841bd33c';
}

async function displayWeather() {
    try {
        const ipResponse = await fetch('https://ipapi.co/json/');

        if (!ipResponse.ok) throw new Error('Location error');

        const location = await ipResponse.json();
        const lat = location.latitude;
        const lon = location.longitude;
        const city = location.city;

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) throw new Error('Weather data error');
        const currentWeather = await weatherResponse.json();

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
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
        weatherCard.classList.add();

        // Поменять классы 
        const weather = `
        <div id="weatherContent">
            <div class="weather-card-top">
                <p>${currentWeather.weather[0].main}</p>
                <p>${city.toUpperCase()}</p>
                <p>${new Date().toLocaleString()}</p>
                <h1>${Math.round(currentWeather.main.temp)}°C</h1>
            </div>

            <div class="weather-image" style="background-image: url('${getWeatherBackground(currentWeather.weather[0].main)}')">
                <img src="${getWeatherIcon(currentWeather.weather[0].icon)}" alt="Weather icon" style="width: 150px; height: 100%; object-fit: cover;">
            </div>

            <div class="weather-card-bottom">
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
            </div>
        </div>`

        weatherCard.insertAdjacentHTML('afterbegin', weather);
        // Вставить в рут элемент
    } catch (error) {
        console.error('Error:', error);
    }
}

displayWeather();