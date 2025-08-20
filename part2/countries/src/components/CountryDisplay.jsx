import { useState, useEffect } from 'react'
import CountryDetails from './CountryDetails'

const CountryDisplay = ({ countries }) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    // every new display, CountryDetail should be reset.
    setCountry(null)
  }, [countries])

  const handleShowCountry = (country) => {
    setCountry(country)
  }

  // no countries, nothing to show
  if (!countries) {
    return null
  }

  // if the match is exactly one, show details
  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  // If the match contains more than 10 countries, complain.
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else {
    return (
      <>
        {countries.map((country) => {
          return (
            <div key={country.name.common}>
              {country.name.common}{' '}
              <button onClick={() => handleShowCountry(country)}>Show</button>
            </div>
          )
        })}
        <CountryDetails country={country} />
      </>
    )
  }
}

export default CountryDisplay
