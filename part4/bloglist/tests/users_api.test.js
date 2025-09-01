const supertest = require('supertest')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is one user in db', () => {
  beforeEach(async () => {
    // clear the database
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    // create a new user
    const user = new User({
      name: 'Super Admin',
      username: 'root',
      passwordHash,
    })

    // save a new user to the test database
    await user.save()
  })

  test('GET /api/users returns 1 user called Super Admin', async () => {
    const users = await api.get('/api/users')

    // Only one user exists
    assert.strictEqual(users.body.length, 1)

    // Check if the correct user is there
    const user = users.body[0]
    assert.strictEqual(user.name, 'Super Admin')
    assert.strictEqual(user.username, 'root')
  })

  test('POST /api/users creates a new user if username is available', async () => {
    const usersAtStart = await helper.usersInDb()

    // Create a new user with valid username (unique)
    const newUser = {
      username: 'chatree',
      name: 'Chatree Sridaoduan',
      password: 'sekret!',
    }

    // Create a new user via POST
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Check if a number of user increased by 1
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    // Check if the created username exists
    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('POST /api/users rejects an already taken username', async () => {
    const usersAtStart = await helper.usersInDb()

    // Create a duplicate username
    const newUser = {
      username: 'root',
      name: 'Dark Chocolate',
      password: 'eat100%',
    }

    // Expect a bad request
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Confirm correct error message
    assert(result.body.error.includes('expected `username` to be unique'))

    // Confirm there's no change to the test database
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
