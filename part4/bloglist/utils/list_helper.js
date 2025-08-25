const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => {
    return prev.likes >= current.likes ? prev : current
  }, {})
}

//ANCHOR - Exercise 4.6*
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const countBlogByAuthor = blogs.reduce((acc, blog) => {
    const author = blog.author
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})

  return Object.entries(countBlogByAuthor).reduce(
    (acc, [key, value]) => {
      if (value > acc.blogs) {
        return { author: key, blogs: value }
      }

      return acc
    },
    { author: '', blogs: 0 }
  )
}

//ANCHOR - Exercise 4.7*
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const countLikeByAuthor = blogs.reduce((acc, blog) => {
    const author = blog.author
    acc[author] = (acc[author] || 0) + blog.likes
    return acc
  }, {})

  return Object.entries(countLikeByAuthor).reduce(
    (acc, [key, value]) => {
      if (value > acc.likes) {
        return { author: key, likes: value }
      }

      return acc
    },
    { author: '', likes: 0 }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
