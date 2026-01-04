const API_KEY = "781b875076a84152972084f8ba1b2493";

// ================= GET WEATHER =================
function getWeather(event) {
  event.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  // ---------- CURRENT WEATHER ----------
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert("City not found");
        return;
      }

      displayCurrentWeather(data);
      localStorage.setItem("weatherCity", city);

      // ---------- FORECAST (MIN / MAX) ----------
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      )
        .then(res => res.json())
        .then(forecast => {
          displayMinMax(forecast);
        });
        console.log(data);
        
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong");
    });
}

// ================= DISPLAY CURRENT =================
function displayCurrentWeather(data) {
  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("datetime").textContent =
    new Date().toLocaleString();

  document.getElementById("forecast").textContent =
    data.weather[0].description;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
  document.getElementById("temp").textContent =
    Math.round(data.main.temp) + "°C";

  document.getElementById("realFeel").textContent =
    Math.round(data.main.feels_like) + "°C";

  document.getElementById("humidity").textContent =
    data.main.humidity + "%";

  document.getElementById("wind").textContent =
    data.wind.speed + " m/s";

  document.getElementById("pressure").textContent =
    data.main.pressure + " hPa";

  document.getElementById("weatherBody").style.display = "block";
  document.getElementById("weatherInfo").style.display = "flex";
}

// ================= DISPLAY MIN / MAX =================
function displayMinMax(forecast) {
  const temps = forecast.list
    .slice(0, 8) 
    .map(item => item.main.temp);

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  document.getElementById("minTemp").textContent =
    Math.round(minTemp);

  document.getElementById("maxTemp").textContent =
    Math.round(maxTemp);
}

// ================= LOAD SAVED CITY =================
window.onload = () => {
  const savedCity = localStorage.getItem("weatherCity");
  if (savedCity) {
    document.getElementById("cityInput").value = savedCity;
    getWeather(new Event("submit"));
  }
};
