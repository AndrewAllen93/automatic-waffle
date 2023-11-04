// Function to format a timestamp to a localized date string
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
}

// Define variables to select elements from the HTML
const searchForm = document.getElementById("search-form");
const cityInput = document.querySelector('input[name="city-input"]');
const currentWeatherContainer = document.getElementById("city-main");
const forecastContainer = document.getElementById("forecast");
const savedSearches = document.getElementById("input-list");

// Event listener for the search form
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value;
  getWeatherData(city);
});

// Function to fetch weather data from an API
function getWeatherData(city) {
  // Replace 'YOUR_API_KEY' with your actual API key
  const apiKey = "a3c1cdb5adfcc9b573893772664108c2";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      return data.coord; // Get coordinates for the 5-day forecast
    })
    .then((coord) => {
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
      saveSearch(city);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to display current weather
function displayCurrentWeather(data) {
  currentWeatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
  // You can add an icon representation of weather conditions here
}

// Function to display the 5-day forecast
function displayForecast(data) {
  forecastContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const forecast = data.list[i * 8]; // Data for every 8th hour (approximately a day)

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-box");
    forecastCard.innerHTML = `
      <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
      <p>Temperature: ${forecast.main.temp}°C</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
      <p>Wind Speed: ${forecast.wind.speed} m/s</p>
    `;
    // You can add an icon representation of weather conditions here

    forecastContainer.appendChild(forecastCard);
  }
}

// Function to save the city to search history
function saveSearch(city) {
  const searchItem = document.createElement("li");
  searchItem.textContent = city;
  savedSearches.appendChild(searchItem);

  searchItem.addEventListener("click", () => {
    getWeatherData(city);
  });
}
