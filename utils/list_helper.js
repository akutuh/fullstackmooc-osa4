const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(( sum, { likes }) => sum + likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0){
    return 0
  } else {
    const reduced = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
    const { _id, url, __v, ...rest } = reduced
    console.log(rest)
    return rest
  }

}

const mostBlogs = (blogs) => {
  const result = _.countBy(blogs, 'author')
  // { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }

  var maxKey = _.maxBy(_.keys(result), function (o) { return result[o] })

  let arr = Object.values(result)
  let maxValue = Math.max(...arr)

  const authorWithMostBlogs = {
    author: maxKey,
    blogs: maxValue
  }

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  const result = _.countBy(blogs, 'likes')
  console.log(result)
  // { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }
  /*
  var maxKey = _.maxBy(_.keys(result), function (o) { return result[o] })

  let arr = Object.values(result)
  let maxValue = Math.max(...arr)

  const authorWithMostBlogs = {
    author: maxKey,
    blogs: maxValue
  }

  return authorWithMostBlogs
  */
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}