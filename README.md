# automatic-waffle
# Created base html for 5-day weather forecast using unorder list for displaying the 5 days worth of weather in their designated boxes.
# Created CSS stylesheet to style the page with help from "Hannah Moore (family member) on the styling and layout.
# Created javascript file (with much trial and error) to make website functional. 
# Javascript
* OpenweatherAPI key
* Event listener that triggers when user clicks on the search button
* saveSearch and fetchWeatherData functions to save city search and display city weather information
* saveSearch function then saves to localstorage as JSON data
* updateSearchHistory function takes saved data in localstorage and puts into array. If no data then defaults to empty array.
* fetchWeatherData function uses openWeatherAPI to fetch the information with a then method that parses response as JSON and a second then method that declares emojiMap.
* fetchWeatherData continuation which targets the card class inside the weather-cards class to display weather forecast.
* Function maps weather condition code to emojiMap.

