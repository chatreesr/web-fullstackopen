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

app.post('/api/persons', (request, response, next) => {
  // Validate input
  // REVIEW: moongoose validation vs manual
  // if (!request.body.name || !request.body.number) {
  //   return response.status(400).json({
  //     error: 'name and number are required.',
  //   })
  // }

  // Check for existing name
  // FIXME: Find a way to prevent creating a record with an existing name
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

  person
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      // Update the details
      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  // Read all persons from the database
  Person.find({}).then((persons) => {
    const info = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>
      `
    response.send(info)
  })
})

// Handle unknown endpoints
const unknownEndpoints = (request, response) => {
  response.status(404).json({
    error: 'unknown endpoint',
  })
}
app.use(unknownEndpoints)

// Handle errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`)
})
