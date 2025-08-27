const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

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
app.use('/api/blogs', blogsRouter)

module.exports = app
