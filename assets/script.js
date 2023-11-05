const apiKey = 'a3c1cdb5adfcc9b573893772664108c2'; // Replace with your OpenWeather API key

// Event listener for the Search button
document.querySelector('.search-btn').addEventListener('click', () => {
  const cityInput = document.querySelector('.city-input');
  const city = cityInput.value.trim();

  if (city) {
    // Save the search to Local Storage
    saveSearch(city);
    fetchWeatherData(city);
  }
});

// Function to save the search to Local Storage
function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.push(city);
  // Remove duplicates
  searches = [...new Set(searches)];
  localStorage.setItem('searches', JSON.stringify(searches));
  updateSearchHistory();
}

// Function to update the search history displayed on the page
function updateSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searches')) || [];
  const searchHistoryElement = document.querySelector('.search-history');

  // Clear previous search history
  searchHistoryElement.innerHTML = '';

  // Display the search history
  searchHistory.forEach((search, index) => {
    const searchItem = document.createElement('div');
    searchItem.textContent = search;
    searchHistoryElement.appendChild(searchItem);
  });
}

// When the page loads, update the search history
window.addEventListener('load', updateSearchHistory);

// Function to fetch weather data and update the DOM
function fetchWeatherData(city) {
  // Fetch current weather data with units set to imperial (Fahrenheit)
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      // Update the current weather details
      document.querySelector('.current-weather h2').textContent = `${data.name}, ${data.sys.country}`;
      document.querySelector('.current-weather h6:nth-of-type(1)').textContent = `Temperature: ${data.main.temp}°F`;
      document.querySelector('.current-weather h6:nth-of-type(2)').textContent = `Wind: ${data.wind.speed} M/S`;
      document.querySelector('.current-weather h6:nth-of-type(3)').textContent = `Humidity: ${data.main.humidity}%`;

      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    })
    .then(response => response.json())
    .then(data => {
      const forecastCards = document.querySelectorAll('.weather-cards .card');

      for (let i = 0; i < 5; i++) {
        const day = data.list[i * 8];
        const date = new Date(day.dt * 1000);
        const temperature = day.main.temp;
        const wind = day.wind.speed;
        const humidity = day.main.humidity;

        // Update the forecast cards
        forecastCards[i].querySelector('h3').textContent = date.toLocaleDateString();
        forecastCards[i].querySelectorAll('h6')[0].textContent = `Temp: ${temperature}°F`;
        forecastCards[i].querySelectorAll('h6')[1].textContent = `Wind: ${wind} M/S`;
        forecastCards[i].querySelectorAll('h6')[2].textContent = `Humidity: ${humidity}%`;
      }
    })
    .catch(error => console.error('Error:', error));
}
