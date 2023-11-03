document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "88c360617e4e8a9fa9adfc0120cd8852"; // Replace with your API key
  const searchButton = document.getElementById("search");
  const cityInput = document.getElementById("city");
  const currentWeather = document.getElementById("current-weather");
  const forecastList = document.getElementById("forecast-list");
  const historyElement = document.getElementById("search-history-list");

  searchButton.addEventListener("click", function () {
    const city = cityInput.value;

    // Fetch current weather data
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process and display current weather data
        displayCurrentWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
      });

    // Fetch 5-day forecast data
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process and display 5-day forecast data
        displayForecast(data);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });

    // Add the city to the search history
    addToSearchHistory(city);
  });

  function displayCurrentWeather(data) {
    const cityName = data.name;
    const date = new Date(data.dt * 1000); // Convert timestamp to date
    const weatherIcon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const temperatureElement = document.getElementById("temperature");
    const descriptionElement = document.getElementById("description");

    // Update HTML elements with the retrieved data
    temperatureElement.textContent = `Temperature: ${temperature}°C`;
    descriptionElement.textContent = `Humidity: ${humidity}% | Wind Speed: ${windSpeed} m/s`;

    currentWeather.innerHTML = `
        <h2>${cityName}</h2>
        <p>Date: ${date.toLocaleString()}</p>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon" />
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}% | Wind Speed: ${windSpeed} m/s</p>
      `;
  }

  function displayForecast(data) {
    const forecastList = document.getElementById("forecast-list");
    forecastList.innerHTML = ""; // Clear the previous forecast data

    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000);
      const weatherIcon = forecast.weather[0].icon;
      const temperature = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;

      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <p>Date: ${date.toLocaleDateString()}</p>
          <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon" />
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}% | Wind Speed: ${windSpeed} m/s</p>
        `;

      forecastList.appendChild(listItem);
    }
  }

  function addToSearchHistory(city) {
    // This is a basic example using local storage
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the city to the search history if it's not already there
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    // Display the search history (you can customize how you want to display it)
    const historyElement = document.getElementById("search-history");
    historyElement.innerHTML = searchHistory
      .map((city) => `<p>${city}</p>`)
      .join("");
  }
});
