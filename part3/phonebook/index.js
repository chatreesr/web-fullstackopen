const express = require('express')
const morgan = require('morgan')

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
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const generateRandomId = () => {
  return generateRandomInt(Number.MAX_SAFE_INTEGER)
}

// Define routes
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  // Validate input
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name and number are required.',
    })
  }

  // Check for existing name
  const existingName = persons.find(
    (person) => person.name === request.body.name
  )
  if (existingName) {
    return response.status(400).json({
      error: `name '${request.body.name}' already exists. Please choose a unique name.`,
    })
  }
  const person = {
    id: generateRandomId(),
    name: request.body.name,
    number: request.body.number,
  }

  persons = persons.concat(person)
  response.status(201).json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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
