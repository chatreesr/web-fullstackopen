const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

//NOTE - Exercise 4.17
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

//NOTE - Exercise 4.19

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'url and title are required.',
    })
  }

  if (!body.likes) {
    body.likes = 0
  }

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user._id,
  }

  const newBlog = new Blog(blog)
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

//NOTE - Exercise 4.21*
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  // Fetch the blog details using the id from decodedToken
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'you are not the owner of this blog.' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  //REVIEW - What is the type of blog? A document?
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
