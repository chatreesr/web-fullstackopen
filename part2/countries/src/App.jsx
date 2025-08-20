import { useState, useEffect } from 'react'
import countryService from './services/country'

import CountryDisplay from './components/CountryDisplay'

const App = () => {
  const [term, setTerm] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
      .getCountries()
      .then((initialCountries) => setCountries(initialCountries))
  }, [])

  const handleTermChange = (event) => {
    setTerm(event.target.value)
  }

  const countriesToShow =
    term === ''
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(term.toLowerCase())
        )

  return (
    <div>
      <div>
        find countries{' '}
        <input type="text" value={term} onChange={handleTermChange} />
      </div>
      <CountryDisplay countries={countriesToShow} />
    </div>
  )
}

export default App
