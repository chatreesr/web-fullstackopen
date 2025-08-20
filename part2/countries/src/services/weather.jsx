import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const iconUrl = 'https://openweathermap.org/img/wn'

const appId = import.meta.env.VITE_OPENWEATHER_KEY

const getWeatherDetails = (city) => {
  return axios
    .get(`${baseUrl}?q=${city}&units=metric&appid=${appId}`)
    .then((response) => response.data)
}

const getWeatherIconUrl = (iconId, size) => {
  return `${iconUrl}/${iconId}@${size}.png`
}

export default { getWeatherDetails, getWeatherIconUrl }
