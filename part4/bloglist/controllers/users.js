const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//NOTE - Exercise 4.15
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })
  response.json(users)
})

// Create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate password; must be checked here instead of Mongoose.
  if (password.length == 0 || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long.' })
  }
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
