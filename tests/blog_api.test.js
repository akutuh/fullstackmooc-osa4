const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialNotes)
})

test('right ammount of blogs returned', async () => {
  const response = await api.get('/api/blogs')

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(6)
})

test('blog identifier is id', async () => {
  const response = await api.get('/api/blogs')
  const contents = response._body
  contents.forEach(blog => {
    //expect(blog).toHaveProperty('id')
    expect(blog['id']).toBeDefined()

  })
})
afterAll(() => {
  mongoose.connection.close()
})