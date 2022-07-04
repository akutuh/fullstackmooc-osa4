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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}