const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('When there are initially some blogs...', () => {
  beforeEach(async () => {
    // Prepare a user
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

    // Prepare blogs
    const blogsWithOwner = helper.initialBlogs.map((blog) => {
      return { ...blog, user: user._id.toString() }
    })

    await Blog.deleteMany({})
    await Blog.insertMany(blogsWithOwner)
  })

  //NOTE - Exercist 4.9
  describe('Verify schema', () => {
    test("Blog uses 'id' instead of '_id'", async () => {
      const blogs = await helper.blogsInDb()
      const targetBlog = blogs[0]

      assert.strictEqual('_id' in targetBlog, false)
      assert('id' in targetBlog)
    })
  })

  //NOTE - Exercise 4.8
  describe('GET /api/blogs', () => {
    test('returns JSON format', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns all blogs', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })
  })

  //NOTE - Exercise 4.10 & Exercise 4.23*
  describe('POST /api/blogs', () => {
    test('rejects adding the blog and returns 401 if token is missing', async () => {
      const newBlog = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        url: 'https://letsgo.com/',
        likes: 4,
      }

      // Check response header
      const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // No blog is added
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('adds a valid blog successfully with correct owner', async () => {
      // login
      const response = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      })

      const token = response.body.token

      const newBlog = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        url: 'https://letsgo.com/',
        likes: 4,
      }

      // Check response header
      const savedBlog = await api
        .post('/api/blogs')
        .set({ authorization: `Bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Check number of blogs increased by 1
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

      // Check the correct blog is saved
      const titles = blogs.map((blog) => blog.title)
      assert(titles.includes('Lets Go'))

      // Check savedBlog
      const owner = await User.findById(savedBlog.body.user)
      assert.strictEqual(owner.username, 'root')
    })

    //NOTE - Exercise 4.11
    test('sets likes to 0 if not set', async () => {
      // login
      const response = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      })

      const token = response.body.token

      const newBlogWithoutLikes = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        url: 'https://letsgo.com/',
      }

      // Add the new blog
      const savedBlog = await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBlogWithoutLikes)

      // Check that likes = 0
      assert.strictEqual(savedBlog.body.likes, 0)
    })

    //NOTE - Exercise 4.12
    test('rejects missing url in request', async () => {
      // login
      const response = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      })

      const token = response.body.token

      const invalidBlog = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        likes: 90,
      }

      // Should reject the POST with 400 Bad Request
      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(invalidBlog)
        .expect(400)

      // Check no data is added to the database
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('rejects missing title in request', async () => {
      // login
      const response = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      })

      const token = response.body.token
      const invalidBlog = {
        author: 'Alex Exwards',
        url: 'https://letsgo.com',
        likes: 90,
      }

      // Should reject the POST with 400 Bad Request
      await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(invalidBlog)
        .expect(400)

      // Check no data is added to the database
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })
  })

  //NOTE - Exercise 4.13
  describe('DELETE /api/blogs/:id', () => {
    test('rejects the delete request and return 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      // Expect a 401
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('deletes the blog and returns 204 if valid', async () => {
      // login
      const response = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      })

      const token = response.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      // Expect a 204
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)

      // Check deletion
      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map((e) => e.title)
      assert(!titles.includes(blogToDelete.title))

      // Check length reduced by 1
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  //NOTE - Exercise 4.14
  describe('PUT /api/blogs/:id', () => {
    test('returns 200 if id is valid and data is updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes = 888

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Check contents of the updated blog
      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, 888)
    })

    test('returns 404 if id is invalid', async () => {
      const invalidId = '68af10916743fa7820609992'
      const blogToUpdate = {
        title: 'Full Stack Open',
        author: 'Kind Mand from U. of Helsinki',
        url: 'https://fullstackopen.com',
        likes: 10000,
      }
      await api.put(`/api/blogs/${invalidId}`).send(blogToUpdate).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
