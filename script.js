// Wait until HTML loads
document.addEventListener("DOMContentLoaded", function() {

    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    // Search button click
    searchBtn.addEventListener("click", getWeather);

    // Enter key
    cityInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            getWeather();
        }
    });

});

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");

    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }

    message.innerText = "Loading...";

    try {

        // Get city coordinates
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok) {
            throw new Error("Location API error!");
        }

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        // Get weather data
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error("Weather API error!");
        }

        const current = weatherData.current;

        // Display data
        document.getElementById("temperature").innerText =
            current.temperature_2m + "°C";

        document.getElementById("cityName").innerText =
            location.name + ", " + location.country;

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            current.wind_speed_10m + " km/h";

        document.getElementById("feelsLike").innerText =
            current.apparent_temperature + "°C";

        // Weather condition
        const code = current.weather_code;

        let condition = "";
        let icon = "";

        if (code === 0) {
            condition = "Clear Sky";
            icon = "☀️";
        }
        else if (code <= 3) {
            condition = "Partly Cloudy";
            icon = "⛅";
        }
        else if (code <= 48) {
            condition = "Foggy";
            icon = "🌫️";
        }
        else if (code <= 67) {
            condition = "Rainy";
            icon = "🌧️";
        }
        else if (code <= 77) {
            condition = "Snowy";
            icon = "❄️";
        }
        else if (code <= 82) {
            condition = "Rain Showers";
            icon = "🌦️";
        }
        else if (code <= 86) {
            condition = "Snow Showers";
            icon = "🌨️";
        }
        else {
            condition = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("condition").innerText = condition;
        document.getElementById("weatherIcon").innerText = icon;

        message.innerText = "";

    }

    catch (error) {

        message.innerText = "Error: " + error.message;
        console.log(error);

    }

}