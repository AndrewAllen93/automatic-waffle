const apiKey = "a3c1cdb5adfcc9b573893772664108c2";

document.querySelector(".search-btn").addEventListener("click", () => {
  const cityInput = document.querySelector(".city-input");
  const city = cityInput.value.trim();

  if (city) {
    saveSearch(city);
    fetchWeatherData(city);
  }
});

function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.push(city);

  searches = [...new Set(searches)];
  localStorage.setItem("searches", JSON.stringify(searches));
  updateSearchHistory();
}

function updateSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searches")) || [];
  const searchHistoryElement = document.querySelector(".search-history");

  if (searchHistoryElement) {
    searchHistoryElement.innerHTML = "";

    searchHistory.forEach((search, index) => {
      const searchItem = document.createElement("div");
      searchItem.textContent = search;
      searchHistoryElement.appendChild(searchItem);
    });
  }
}

window.addEventListener("load", updateSearchHistory);

function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
      const emojiMap = {
        '01d': '☀️', // Clear sky (day)
        '01n': '🌙', // Clear sky (night)
        '02d': '🌤️', // Few clouds (day)
        '02n': '🌤️', // Few clouds (night)
        '03d': '🌥️', // Scattered clouds (day)
        '03n': '🌥️', // Scattered clouds (night)
        '04d': '☁️', // Broken clouds (day)
        '04n': '☁️', // Broken clouds (night)
        '09d': '🌧️', // Rain (day)
        '09n': '🌧️', // Rain (night)
        '10d': '🌦️', // Rain and few clouds (day)
        '10n': '🌦️', // Rain and few clouds (night)
        '11d': '⛈️', // Thunderstorm (day)
        '11n': '⛈️', // Thunderstorm (night)
        '13d': '🌨️', // Snow (day)
        '13n': '🌨️', // Snow (night)
        '50d': '🌫️', // Mist (day)
        '50n': '🌫️', // Mist (night)
        // You can add more mappings for various weather conditions here
      };

      const weatherEmoji = emojiMap[data.weather[0].icon];

      document.querySelector(".current-weather h2").textContent = `${weatherEmoji} ${data.name}, ${data.sys.country}`;
      document.querySelector(".current-weather h6:nth-of-type(1)").textContent = `Temperature: ${data.main.temp}°F`;
      document.querySelector(".current-weather h6:nth-of-type(2)").textContent = `Wind: ${data.wind.speed} M/S`;
      document.querySelector(".current-weather h6:nth-of-type(3)").textContent = `Humidity: ${data.main.humidity}%`;

      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    })
    .then((response) => response.json())
    .then((data) => {
      const forecastCards = document.querySelectorAll(".weather-cards .card");

      for (let i = 0; i < 5; i++) {
        const day = data.list[i * 8];
        const date = new Date(day.dt * 1000);
        const temperature = day.main.temp;
        const wind = day.wind.speed;
        const humidity = day.main.humidity;

        const emojiMap = {
          '01d': '☀️', // Clear sky (day)
          '01n': '🌙', // Clear sky (night)
          '02d': '🌤️', // Few clouds (day)
          '02n': '🌤️', // Few clouds (night)
          '03d': '🌥️', // Scattered clouds (day)
          '03n': '🌥️', // Scattered clouds (night)
          '04d': '☁️', // Broken clouds (day)
          '04n': '☁️', // Broken clouds (night)
          '09d': '🌧️', // Rain (day)
          '09n': '🌧️', // Rain (night)
          '10d': '🌦️', // Rain and few clouds (day)
          '10n': '🌦️', // Rain and few clouds (night)
          '11d': '⛈️', // Thunderstorm (day)
          '11n': '⛈️', // Thunderstorm (night)
          '13d': '🌨️', // Snow (day)
          '13n': '🌨️', // Snow (night)
          '50d': '🌫️', // Mist (day)
          '50n': '🌫️', // Mist (night)
          // You can add more mappings for various weather conditions here
        };

        const weatherEmoji = emojiMap[day.weather[0].icon];

        forecastCards[i].querySelector("h3").textContent = `${weatherEmoji} ${date.toLocaleDateString()}`;
        forecastCards[i].querySelectorAll("h6")[0].textContent = `Temp: ${temperature}°F`;
        forecastCards[i].querySelectorAll("h6")[1].textContent = `Wind: ${wind} M/S`;
        forecastCards[i].querySelectorAll("h6")[2].textContent = `Humidity: ${humidity}%`;
      }
    })
    .catch((error) => console.error("Error:", error));
}

