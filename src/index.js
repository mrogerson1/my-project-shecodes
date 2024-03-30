function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#icon");

  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = Math.round(temperature);
  windSpeedElement.innerHTML = `${response.data.wind.speed}m/h`;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;

  getForecast(response.data.city);
}

function getTimezone(response) {
  // Extract latitude and longitude from the response
  let latitude = response.data.coordinates.latitude;
  let longitude = response.data.coordinates.longitude;
  let timestamp = Math.floor(Date.now() / 1000);
  let apiKey = "AIzaSyCstevPgCP0uRGxUJNhxN8YWFu74Id1s4U";
  let apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${timestamp}&key=${apiKey}`;
  axios.get(apiUrl).then(convertDatetime);

  console.log(timestamp);
  console.log(Date(timestamp));
}

function convertDatetime(response) {
  let localOffset = response.data.rawOffset * 1000;
  let dstAdjust = response.data.dstOffset * 1000;
  let timeZone = response.data.timeZoneName;
  let utcTimestamp = Date.now();
  let check_Date = new Date(utcTimestamp);
  // Actually generating EST time
  console.log(timeZone);
  console.log(localOffset);

  // 14400000 this number represents the conversion from EST --> UTC
  // During Daylight savings another hour of miliseconds would need to be added
  // 14400000 + 60*60*1000
  let date = new Date(utcTimestamp + localOffset + dstAdjust + 14400000);
  let timeElement = document.querySelector("#time");
  timeElement.innerHTML = formatDate(date);
  let timezoneElement = document.querySelector("#timezone");
  timezoneElement.innerHTML = response.data.timeZoneName;
  console.log(date);
  console.log(Date(check_Date));
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM
  hours = hours % 12; // Convert hours to 12-hour format
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Ensure minutes are displayed with leading zero if less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Get the day of the week
  let days = [
    "Sunday ",
    "Monday ",
    "Tuesday ",
    "Wednesday ",
    "Thursday ",
    "Friday ",
    "Saturday ",
  ];
  let day = days[date.getDay()];

  // Construct the formatted time string
  return `${day}${hours}:${minutes} ${ampm}`;
}

function searchCity(city) {
  let apiKey = "88ce19e7ct3e14a9169c6ob09cfa1a38";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(refreshWeather);
  axios.get(apiUrl).then(getTimezone);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "88ce19e7ct3e14a9169c6ob09cfa1a38";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios(apiUrl).then(displayForecast);
  console.log(apiUrl);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
<div class="weather-forecast-day">
      <div class="weather-forecast-date">${formatDay(day.time)}</div>
      <img src ="${day.condition.icon_url}" class="weather-forecast-icon" />
              <div class="weather-forecast-temperature">
                <dic class="weather-forecast-temperature-max"><strong>${Math.round(
                  day.temperature.maximum
                )}°</strong></div>
                <div class="weather-forecast-temperature-min">${Math.round(
                  day.temperature.minimum
                )}°</div>
              </div>
            </div>
            </div>
`;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("San Francisco");
