const config = require('./utils/config')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

morgan.token('request-body', (request) => JSON.stringify(request.body))
mongoose.connect(config.MONGODB_URI)

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body'
  )
)
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
