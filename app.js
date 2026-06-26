const weatherEmoji = document.getElementById('weather-emoji');
const weatherTemp = document.getElementById('weather-temp');
const weatherSummary = document.getElementById('weather-summary');
const weatherNote = document.getElementById('weather-note');

const conditionEmoji = (code) => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 86) return '🌧️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌈';
};

const weatherLabel = (code) => {
  switch (code) {
    case 0:
      return 'Clear skies';
    case 1:
      return 'Mainly clear';
    case 2:
      return 'Partly cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Foggy';
    case 51:
    case 53:
    case 55:
      return 'Light drizzle';
    case 56:
    case 57:
      return 'Freezing drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain showers';
    case 66:
    case 67:
      return 'Freezing rain';
    case 71:
    case 73:
    case 75:
      return 'Snow showers';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain';
    case 85:
    case 86:
      return 'Snow';
    case 95:
    case 96:
    case 99:
      return 'Thunderstorms';
    default:
      return 'Current conditions';
  }
};

const showWeather = ({ temperature, weathercode, windspeed }) => {
  weatherEmoji.textContent = conditionEmoji(weathercode);
  weatherTemp.textContent = `${Math.round(temperature)}°F`;
  weatherSummary.textContent = `${weatherLabel(weathercode)} · ${Math.round(windspeed)} mph wind`;
  weatherNote.textContent = 'Updated for your current location.';
};

const showError = (message) => {
  weatherEmoji.textContent = '⚠️';
  weatherSummary.textContent = message;
  weatherNote.textContent = 'Enable location access or try again later.';
};

const fetchWeather = (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`;
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Weather request failed');
      return response.json();
    })
    .then((data) => {
      if (data.current_weather) {
        showWeather(data.current_weather);
      } else {
        throw new Error('No weather data');
      }
    })
    .catch(() => showError('Unable to load weather right now.'));
};

const initWeather = () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        showError('Location permission denied.');
      } else {
        showError('Could not determine your location.');
      }
    },
    { timeout: 12000 }
  );
};

window.addEventListener('DOMContentLoaded', initWeather);
