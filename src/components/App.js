import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("New York"); // Default city
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const fetchWeather = async (city) => {
    if (!city) return;
    
    setWeather({ ...weather, loading: true });
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await axios.get(url);
      setWeather({ data: res.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather(query); // Fetch weather for default city on mount
  }, []); 

  const search = (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      fetchWeather(query);
    }
  };

  return (
    <div className="App">
      {/* SearchEngine component */}
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {weather.loading && <h4>Searching...</h4>}

      {weather.error && (
        <span className="error-message">
          Sorry, city not found. Please try again later.
        </span>
      )}

      {weather.data?.weather && <Forecast weather={weather} />}
    </div>
  );
}

export default App;
