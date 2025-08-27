const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

describe('When there are initially some blogs...', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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

  //NOTE - Exercise 4.10
  describe('POST /api/blogs', () => {
    test('adds a valid blog successfully', async () => {
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
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Check number of blogs increased by 1
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

      // Check the correct blog is saved
      const titles = blogs.map((blog) => blog.title)
      assert(titles.includes('Lets Go'))
    })

    //NOTE - Exercise 4.11
    test('sets likes to 0 if not set', async () => {
      const newBlogWithoutLikes = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        url: 'https://letsgo.com/',
      }

      // Add the new blog
      const response = await api.post('/api/blogs').send(newBlogWithoutLikes)
      const savedBlog = response.body

      // Check that likes = 0
      assert.strictEqual(savedBlog.likes, 0)
    })

    //NOTE - Exercise 4.12
    test('rejects missing url in request', async () => {
      const invalidBlog = {
        title: 'Lets Go',
        author: 'Alex Exwards',
        likes: 90,
      }

      // Should reject the POST with 400 Bad Request
      await api.post('/api/blogs').send(invalidBlog).expect(400)

      // Check no data is added to the database
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })

    test('rejects missing title in request', async () => {
      const invalidBlog = {
        author: 'Alex Exwards',
        url: 'https://letsgo.com',
        likes: 90,
      }

      // Should reject the POST with 400 Bad Request
      await api.post('/api/blogs').send(invalidBlog).expect(400)

      // Check no data is added to the database
      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })
  })

  //NOTE - Exercise 4.13
  describe('DELETE /api/blogs/:id', () => {
    test('returns 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      // Expect a 204
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      // Check deletion
      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map((e) => e.title)
      assert(!titles.includes(blogToDelete.title))

      // Check length reduced by 1
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    //TODO - Consider adding a test if id is invalid
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
