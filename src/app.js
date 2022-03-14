// Day forecast
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day}, ${hours}:${minutes}h`;
}

//From displayForecast - adding the days of the week (since API only gives timestamps)

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Adding Forecast Multiple Days
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class ="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col">
          <div class="weather-forecast-date">
          ${formatDay(forecastDay.dt)}
          </div>
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt="" width="60">
          <div class="weather-forecast-temperature">
            <span class="weather-forecast-max">${Math.round(
              forecastDay.temp.max
            )}º</span>
            <span class="weather-forecast-min">${Math.round(
              forecastDay.temp.min
            )}º</span>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Change Container Forecast - API (called in displayTemperature)
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "8cb4b09ce92dcd0f47ea25293231322e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

//Change Container Current Temp - API (last Line - call for function getForecast)
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = Math.round(response.data.main.temp);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

//Axios API
function search(city) {
  let apiKey = "8cb4b09ce92dcd0f47ea25293231322e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
//Submit City to search
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//Celsius to Fahrenheit
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  //remove class from celsius to fahrenheit
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//Current Position Button + Geolocation
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiKey = "8cb4b09ce92dcd0f47ea25293231322e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

  axios.get(`${apiUrl}`).then(displayTemperature);
}

//Navigator Geolocation
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function changingBackground(response) {
  let descriptionElement = response.data.weather[0].description;

  if (descriptionElement === "Clear Sky") {
    document.body.style.background = `linear-gradient: (26deg, rgb(243, 248, 179) 15%, rgb(115, 235, 252) 97%) `;
  } else if (descriptionElement === "Scattered Clouds") {
    document.body.style.background = `linear-gradient: (26deg, rgb(166, 167, 155) 15%, rgb(115, 235, 252) 97%) `;
  } else if (descriptionElement === "Few Clouds") {
    document.body.style.background = `linear-gradient: (26deg, rgb(221, 221, 218) 15%, rgb(101, 180, 252) 97%) `;
  } else if (descriptionElement === "Broken Clouds") {
    document.body.style.background = `linear-gradient: (26deg, rgb(231, 232, 238) 46%, rgb(45, 128, 211) 100% `;
  } else if (descriptionElement === "Shower Rain") {
    document.body.style.background = `linear-gradient: (26deg, rgb(248, 156, 202) 20%, rgb(112, 118, 248) 100%) `;
  } else if (descriptionElement === "Rain") {
    document.body.style.background = `linear-gradient: (26deg, rgb(255, 250, 252) 17%, rgb(170, 168, 168) 100%) `;
  } else if (descriptionElement === "Thunderstorm") {
    document.body.style.background = `linear-gradient: (26deg, rgb(248, 248, 151) 28%, rgb(238, 183, 15) 80%) `;
  } else if (descriptionElement === "Snow") {
    document.body.style.background = `linear-gradient: (26deg, rgb(248, 245, 246) 26%, rgb(35, 231, 250) 86%) `;
  } else if (descriptionElement === "Mist") {
    document.body.style.background = `linear-gradient: (26deg, rgb(91, 160, 114) 26%, rgb(242, 246, 246) 75%) `;
  }
}

function getDescription(coordinates) {
  let apiKey = "8cb4b09ce92dcd0f47ea25293231322e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.long}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(changingBackground);
}

//Button for current location
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentLocation);

// Call City at Load
search("Lisbon");
