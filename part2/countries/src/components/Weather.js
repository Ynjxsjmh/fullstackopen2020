import React, { useState } from 'react';
import axios from 'axios';

const Weather = ({capital}) => {
  const [ weather, setWeather ] = useState();

  const weather_api_key = process.env.REACT_APP_WEATHER_API_KEY;
  const request_url = `http://api.weatherstack.com/current?access_key=${weather_api_key}&query=${capital}`;

  const getWeather = async capital => {
    const response = await axios.get(request_url);
    console.log(response.data);
    return response.data;
  };

  getWeather(capital).then(e => setWeather(e));

  if (weather === undefined) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <h2>Weather in {capital}</h2>
        <p><b>temperature:</b>{weather.current.temperature}</p>
        <p>{weather.current.weather_icons}</p>
        <p><b>wind</b>{weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
      </>
    );
  }
};

export default Weather;
