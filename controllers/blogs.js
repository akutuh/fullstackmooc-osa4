const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const getBlogs = await Blog.find({}).populate('user', { username: 1 })
  response.status(200).json(getBlogs)

})

blogsRouter.get('/:id', async (request, response) => {
  const getBlog = await Blog.findById(request.params.id).populate('user', { username: 1 })
  response.status(200).json(getBlog)

})


blogsRouter.post('/', async (request, response) => {

  const body = request.body
  const blog1 = new Blog(request.body)
  if(!blog1.title || !blog1.url){
    response.status(400).json(blog1)
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: decodedToken.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if( blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(200).end()
  } else {
    return response.status(400).json({ error: 'you are not allowed to delete this blog' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  //console.log(body.likes)
  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  console.log(updatedBlog)
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter