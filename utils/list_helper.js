const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(( sum, { likes }) => sum + likes, 0)
}

module.exports = {
  dummy,
  totalLikes
}