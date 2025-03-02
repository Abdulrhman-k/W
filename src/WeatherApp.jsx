import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'a900d2a830fc5f5ee9718eea5569c54f'; 
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric', 
        },
      });
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
    }
  };

  const fetchForecastData = async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric', 
        },
      });
      setForecastData(response.data);
    } catch (err) {
      setForecastData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
      fetchForecastData(city); // Corrected typo here
    }
  };

  useEffect(() => {
    if (city.trim()) {
      fetchWeatherData(city);
      fetchForecastData(city);
    }
  }, [city]);

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="current-weather">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>{new Date().toLocaleDateString()}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {forecastData && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecastData.list.slice(0, 5).map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                />
                <p>{item.weather[0].description}</p>
                <p>Temp: {item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;