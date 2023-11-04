// Your API key
const apiKey = "88c360617e4e8a9fa9adfc0120cd8852";

// Event listener for form submit
document
  .getElementById("search-form")
  .addEventListener("submit", function (evt) {
    evt.preventDefault();
    const cityName = document.querySelector("[name='city-input']").value;
    getLatLon(cityName);
  });

function getLatLon(cityName) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
  )
    .then(function (response) {
      if (!response.ok) {
        alert("API key not authorized");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      const city = data[0].name;
      getWeather(lat, lon, city);
      getFiveDay(lat, lon);
      saveCity(city);
    })
    .catch(function (error) {
      console.error("Problem Getting Location Data:", error);
    });
}

function getWeather(lat, lon, city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const cardTitle = document.createElement("h2");
      cardTitle.textContent = city;

      const temp = document.createElement("p");
      temp.textContent = `Temp: ${data.main.temp} F`;

      const humidity = document.createElement("p");
      humidity.textContent = `Humidity: ${data.main.humidity} %`;

      const windSpeed = document.createElement("p");
      windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;

      const currentDate = new Date(data.dt * 1000);
      const date = document.createElement("p");
      date.textContent = `Date: ${currentDate.toLocaleDateString()}`;

      const cityMain = document.querySelector(".city-main");
      cityMain.innerHTML = ""; // Clear previous content
      cityMain.append(cardTitle, temp, humidity, windSpeed, date);
    })
    .catch((error) => {
      console.error("Problem Getting Weather Data:", error);
    });
}

function getFiveDay(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".container .row");
      container.innerHTML = ""; // Clear previous content

      for (let i = 0; i < 5; i++) {
        const fiveDay = data.list[i * 8];
        const fiveDayCard = document.createElement("div");
        fiveDayCard.className = "col-md-2";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const fiveCardDate = document.createElement("h4");
        fiveCardDate.textContent = new Date(
          fiveDay.dt * 1000
        ).toLocaleDateString();

        const fiveCardTemp = document.createElement("p");
        fiveCardTemp.textContent = `Temp: ${fiveDay.main.temp} F`;

        const fiveCardHumidity = document.createElement("p");
        fiveCardHumidity.textContent = `Humidity: ${fiveDay.main.humidity} %`;

        const fiveCardWind = document.createElement("p");
        fiveCardWind.textContent = `Wind Speed: ${fiveDay.wind.speed}`;

        cardBody.append(
          fiveCardDate,
          fiveCardTemp,
          fiveCardHumidity,
          fiveCardWind
        );
        fiveDayCard.append(cardBody);
        container.append(fiveDayCard);
      }
    })
    .catch((error) => {
      console.error("Problem Getting Weather Data:", error);
    });
}

// Save the city to local storage
function saveCity(city) {
  const savedArray = JSON.parse(localStorage.getItem("savedArray")) || [];
  savedArray.push(city);
  localStorage.setItem("savedArray", JSON.stringify(savedArray));
  renderButtons();
}

const textInput = document.querySelector(".form-control");
const saveButton = document.querySelector(".btn.btn-primary");
const buttonList = document.getElementById("input-list");

function renderButtons() {
  buttonList.innerHTML = "";

  const savedArray = JSON.parse(localStorage.getItem("savedArray")) || [];
  savedArray.forEach(function (text, index) {
    const button = document.createElement("button");
    button.textContent = text;
    buttonList.appendChild(button);

    button.addEventListener("click", function () {
      getLatLon(text); // Fetch weather data for the clicked city
    });
  });
}

saveButton.addEventListener("click", function () {
  const textValue = textInput.value.trim();

  if (textValue !== "") {
    saveCity(textValue);
    textInput.value = "";
  } else {
    alert("Please enter some text before saving.");
  }
});

renderButtons();
