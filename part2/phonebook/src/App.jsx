import { useState, useEffect } from 'react'
import personService from './services/persons'

import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  // Application states
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  // Effects
  useEffect(() => {
    console.log('use effect fired')
    personService.getAll().then((initialPersons) => {
      console.log('initialPersons', initialPersons)
      setPersons(initialPersons)
    })
  }, [])
  console.log('render', persons.length, 'persons')

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
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName.trim())
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            )
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            setNotifyMessage(
              `Information of ${newName.trim()} has already been removed from server`
            )
            setMessageType('error')
            setPersons(
              persons.filter((person) => person.name != newName.trim())
            )
            setTimeout(() => setNotifyMessage(null), 3000)
          })
        return
      }
    }

    // Save to the database via REST API
    const newPerson = { name: newName, number: newNumber }
    personService.create(newPerson).then((person) => {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
      setNotifyMessage(`Added ${person.name}`)
      setMessageType('info')
      setTimeout(() => setNotifyMessage(null), 3000)
    })
  }

  const handleDeletePerson = (id) => {
    const toBeDeleted = persons.find((person) => person.id === id)
    console.log('person to be deleted', toBeDeleted)
    if (window.confirm(`Delete ${toBeDeleted.name} ?`)) {
      console.log('proceed to delete')
      personService.deletePerson(id).then((deletedPerson) => {
        console.log('deletedPerson', deletedPerson)
        setPersons(persons.filter((person) => person.id !== deletedPerson.id))
      })
    }
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
      <Notification message={notifyMessage} type={messageType} />
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
      <Persons persons={personsToShow} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App
