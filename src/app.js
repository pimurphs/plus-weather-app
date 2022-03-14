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
  changingBackground(response.data.weather[0].description);
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

function changingBackground(description) {
  console.log(description);
  if (description === "clear sky") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(243, 248, 179) 15%, rgb(115, 235, 252) 97%)`;
  } else if (description === "scattered clouds") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(82, 175, 250) 0%, rgb(255, 133, 195) 79%)`;
  } else if (description === "few clouds") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(221, 221, 218) 15%, rgb(101, 180, 252) 97%)`;
  } else if (description === "broken clouds") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(253, 253, 7) 0%, rgb(125, 233, 187) 100%)`;
  } else if (description === "overcast clouds") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(122, 248, 158) 11%, rgb(113, 49, 253) 100%)`;
  } else if (description === "shower rain") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(236, 122, 248) 0%, rgb(250, 229, 103) 65%);`;
  } else if (description === "rain") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(246, 241, 241) 15%, rgb(104, 100, 116) 95%)`;
  } else if (description === " light rain") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(62, 37, 180) 0%, rgb(250, 227, 135) 85%);`;
  } else if (description === "thunderstorm") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(41, 16, 161) 0%, rgb(135, 211, 250) 85%)`;
  } else if (description === "snow") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(248, 245, 246) 26%, rgb(35, 231, 250) 100%)`;
  } else if (description === "mist") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(113, 228, 124) 0%, rgb(241, 102, 181) 100%)`;
  } else if (description === "haze") {
    document.body.style.backgroundImage = `linear-gradient(26deg, rgb(253, 253, 89) 0%, rgb(230, 55, 154) 100%)`;
  }
}

//Button for current location
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentLocation);

// Call City at Load
search("Lisbon");
