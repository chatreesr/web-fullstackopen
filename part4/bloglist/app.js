const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

morgan.token('request-body', (request) => JSON.stringify(request.body))
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) =>
    logger.error(`error connecting to MongoDB ${error.message}`)
  )

// Stop morgan from logging in the tests
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms :request-body'
    )
  )
}

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
