const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

//NOTE - Exercise 4.18
loginRouter.post('/', async (request, response) => {
  // extract username and password from request
  const { username, password } = request.body

  // find the username in the database
  const user = await User.findOne({ username })

  // if found check password with the hash
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // check validity of both user and password
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }
  // create the object data I want to pass with jwt
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // return token
  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
