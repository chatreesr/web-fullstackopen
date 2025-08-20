import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country) {
      weatherService
        .getWeatherDetails(country.capital[0])
        .then((weatherDetails) => setWeather(weatherDetails))
    }
  }, [country])

  if (!country || !weather) {
    return null
  }

  const iconUrl = weatherService.getWeatherIconUrl(
    weather.weather[0].icon,
    '4x'
  )

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital.join(', ')}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => {
          return <li key={language}>{language}</li>
        })}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {country.capital[0]}</h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img src={iconUrl} alt={weather.description} />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default CountryDetails
