import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  console.log("Weather prop received:", weather); // Debugging

  useEffect(() => {
    if (!data || !data.name) return;

    const fetchForecastData = async () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        console.log("Forecast API Response:", response.data); // Debugging
        const dailyData = response.data.list.filter((_, index) => index % 8 === 0);
        setForecastData(dailyData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data?.name]);

  if (!data || !data.weather) {
    return <p>Loading weather data...</p>;
  }

  // Mapping OpenWeatherMap icons to ReactAnimatedWeather icons
  const weatherIcons = {
    "01d": "CLEAR_DAY",
    "01n": "CLEAR_NIGHT",
    "02d": "PARTLY_CLOUDY_DAY",
    "02n": "PARTLY_CLOUDY_NIGHT",
    "03d": "CLOUDY",
    "03n": "CLOUDY",
    "04d": "CLOUDY",
    "04n": "CLOUDY",
    "09d": "RAIN",
    "09n": "RAIN",
    "10d": "RAIN",
    "10n": "RAIN",
    "11d": "SLEET",
    "11n": "SLEET",
    "13d": "SNOW",
    "13n": "SNOW",
    "50d": "FOG",
    "50n": "FOG",
  };

  const icon = weatherIcons[data.weather[0]?.icon] || "CLEAR_DAY";

  return (
    <div className="forecast-container">
      <div className="city-name">
        <h2>{data.name}, <span>{data.sys?.country}</span></h2>
      </div>

      <div className="weather-display">
        <ReactAnimatedWeather
          icon={icon}
          color="#ffcc00"
          size={80}
          animate={true}
        />
        <div className="temp">
          {Math.round(data.main.temp)}°{isCelsius ? "C" : "F"}
        </div>
      </div>

      <p className="weather-des">{data.weather[0]?.description}</p>

      <button
        className="toggle-temp-btn"
        onClick={() => setIsCelsius(!isCelsius)}
      >
        Switch to {isCelsius ? "°F" : "°C"}
      </button>

      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-list">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</p>
              <ReactAnimatedWeather
                icon={weatherIcons[day.weather[0]?.icon] || "CLOUDY"}
                color="#ffcc00"
                size={50}
                animate={true}
              />
              <p>{Math.round(day.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
