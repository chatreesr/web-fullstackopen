require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('request-body', (request) => JSON.stringify(request.body))

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body'
  )
)

// Initial in-memory data
// let persons = [
//   {
//     id: '1',
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: '2',
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: '3',
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: '4',
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ]

// Define routes
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  // Validate input
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name and number are required.',
    })
  }

  // Check for existing name
  // FIXME Searching for existing name does not work
  // const existingName = Person.find({ name: request.body.name }).then(
  //   (person) => {
  //     console.log(person)
  //     person.name
  //   }
  // )
  // if (existingName) {
  //   return response.status(400).json({
  //     error: `name '${request.body.name}' already exists. Please choose a unique name.`,
  //   })
  // }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save().then((savedPerson) => {
    response.status(201).json(savedPerson)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const info = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toString()}</p>
  `
  response.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`)
})
