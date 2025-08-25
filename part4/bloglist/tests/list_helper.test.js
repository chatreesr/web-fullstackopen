const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

const listWithTwoBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a67987d17f8',
    title: 'I will become an expert that beats AI',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const actual = listHelper.totalLikes([])
    assert.strictEqual(actual, 0)
  })

  test('of one-blog list is equal to the likes of that single blog', () => {
    const actual = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(actual, 5)
  })

  test('of a bigger list is equal to the sum of all likes', () => {
    const actual = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(actual, 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is empty object', () => {
    const actual = listHelper.favoriteBlog([])
    assert.deepStrictEqual(actual, {})
  })

  test('of one-blog list is the blog', () => {
    const actual = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(actual, listWithOneBlog[0])
  })

  test('of two blog list with equal likes is the first one found', () => {
    const actual = listHelper.favoriteBlog(listWithTwoBlogs)
    assert.deepStrictEqual(actual, listWithTwoBlogs[0])
  })

  test('of a bigger list is equal to the blog with most likes', () => {
    const actual = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepStrictEqual(actual, listWithManyBlogs[2])
  })
})

//ANCHOR - Exercise 4.6*
describe('most blogs', () => {
  test('of empty list is empty object', () => {
    const actual = listHelper.mostBlogs([])
    assert.deepStrictEqual(actual, {})
  })

  test('of one-blog list returns the author with one blog', () => {
    const actual = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(actual, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of two-blog list of the same author returns the author and the two blogs', () => {
    const actual = listHelper.mostBlogs(listWithTwoBlogs)
    assert.deepStrictEqual(actual, { author: 'Edsger W. Dijkstra', blogs: 2 })
  })

  test('of a bigger list returns correct thing', () => {
    const actual = listHelper.mostBlogs(listWithManyBlogs)
    assert.deepStrictEqual(actual, { author: 'Robert C. Martin', blogs: 3 })
  })
})

//ANCHOR - Exercise 4.7*
describe('most likes', () => {
  test('of empty list is empty object', () => {
    const actual = listHelper.mostLikes([])
    assert.deepStrictEqual(actual, {})
  })

  test('of one-blog list returns the author and the likes', () => {
    const actual = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(actual, { author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list returns the most likes author with a correct number', () => {
    const actual = listHelper.mostLikes(listWithManyBlogs)
    assert.deepStrictEqual(actual, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
