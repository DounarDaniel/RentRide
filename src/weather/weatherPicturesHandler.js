export function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWeatherBackground(weatherMain) {
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