import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  // Application states
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  // Application handlers
  const handleNewName = (event) => {
    console.log('name>', event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log('number>', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    console.log('search terms>', event.target.value)
    setSearch(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()

    if (newName.trim() === '') {
      setNewName('')
      return
    }

    if (persons.find((person) => person.name === newName.trim())) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, number: newNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow =
    search !== ''
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        )
      : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text="filter shown with" value={search} onChange={handleSearch} />

      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        onNameChange={handleNewName}
        number={newNumber}
        onNumberChange={handleNewNumber}
        onSubmit={handleAddPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
