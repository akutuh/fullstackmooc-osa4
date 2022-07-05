const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const getBlogs = await Blog.find({})
  response.status(200).json(getBlogs)

})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.title || !blog.url){
    response.status(400).json(blog)
  }
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
