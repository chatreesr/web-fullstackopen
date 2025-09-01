const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//NOTE - Exercise 4.15
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// Create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
