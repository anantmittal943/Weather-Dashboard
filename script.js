// API Key for OpenWeatherMap
const apiKey = 'b8583e5bc2ac0acdf621a922e2df8cea';

// DOM Elements
const elements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    suggestionsContainer: document.getElementById('suggestions'),
    weatherInfo: document.getElementById('weather-info'),
    loading: document.getElementById('loading'),
    forecastContainer: document.getElementById('forecast-container'),
    cityName: document.getElementById('city-name'),
    weatherIcon: document.getElementById('weather-icon'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
};

// Mapping Weather Icons
const weatherIcons = {
    '01d': 'wi-day-sunny',
    '01n': 'wi-night-clear',
    '02d': 'wi-day-cloudy',
    '02n': 'wi-night-alt-cloudy',
    '03d': 'wi-cloud',
    '03n': 'wi-cloud',
    '04d': 'wi-cloudy',
    '04n': 'wi-cloudy',
    '09d': 'wi-showers',
    '09n': 'wi-showers',
    '10d': 'wi-day-rain',
    '10n': 'wi-night-alt-rain',
    '11d': 'wi-thunderstorm',
    '11n': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '13n': 'wi-snow',
    '50d': 'wi-fog',
    '50n': 'wi-fog',
};

// Show Loading Animation
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.weatherInfo.classList.add('hidden');
    elements.forecastContainer.innerHTML = '';
}

// Hide Loading Animation
function hideLoading() {
    elements.loading.classList.add('hidden');
    elements.weatherInfo.classList.remove('hidden');
}

// Fetch Weather Data
async function fetchWeather(city) {
    showLoading();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(city);
    } catch (error) {
        alert(error.message);
        hideLoading();
    }
}

// Display Current Weather
function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const iconCode = weather[0].icon;

    elements.cityName.textContent = name;
    elements.weatherIcon.className = `wi ${weatherIcons[iconCode] || 'wi-na'}`;
    elements.temperature.textContent = `${Math.round(main.temp)}°C`;
    elements.description.textContent = weather[0].description;
    elements.humidity.textContent = `${main.humidity}%`;
    elements.windSpeed.textContent = `${Math.round(wind.speed)} m/s`;

    hideLoading();
}

// Fetch 5-Day Forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error('Unable to fetch forecast');
        const data = await response.json();
        displayForecast(data.list);
    } catch (error) {
        alert(error.message);
    }
}

// Display 5-Day Forecast
function displayForecast(forecastList) {
    elements.forecastContainer.innerHTML = '';
    const filteredForecast = forecastList.filter((entry) =>
        entry.dt_txt.includes('12:00:00')
    );

    filteredForecast.forEach((entry) => {
        const { dt_txt, main, weather } = entry;
        const date = new Date(dt_txt).toLocaleDateString('en-US', {
            weekday: 'short',
        });
        const iconCode = weather[0].icon;

        const forecastHTML = `
            <div class="forecast-item">
                <p>${date}</p>
                <i class="wi ${weatherIcons[iconCode] || 'wi-na'} weather-icon"></i>
                <p class="temperature">${Math.round(main.temp)}°C</p>
            </div>
        `;
        elements.forecastContainer.innerHTML += forecastHTML;
    });
}

// Event Listener for Search Button
elements.searchBtn.addEventListener('click', () => {
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

// Autocomplete Suggestions (Optional)
const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Berlin', 'Rome'];

elements.cityInput.addEventListener('input', () => {
    const query = elements.cityInput.value.toLowerCase();
    const matches = cities.filter((city) =>
        city.toLowerCase().startsWith(query)
    );

    elements.suggestionsContainer.innerHTML = '';
    matches.forEach((match) => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.textContent = match;
        suggestion.addEventListener('click', () => {
            elements.cityInput.value = match;
            fetchWeather(match);
            elements.suggestionsContainer.innerHTML = '';
        });
        elements.suggestionsContainer.appendChild(suggestion);
    });
});

// Hide Suggestions on Blur
elements.cityInput.addEventListener('blur', () => {
    setTimeout(() => {
        elements.suggestionsContainer.innerHTML = '';
    }, 200);
});
