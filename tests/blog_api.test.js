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
test('blog can be added', async () => {
  const newBlog = {
    title: 'Dog blog',
    author: 'Pekka Järvi',
    url: 'http//blog.dogblog1000.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialNotes.length + 1)
  expect(titles).toContain(
    'Dog blog'
  )
})

test('if likes has no value it is assigned to 0', async () => {
  const newBlog = {
    title: 'Dog blog',
    author: 'Pekka Järvi',
    url: 'http//blog.dogblog1000.com',
    likes: undefined
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response._body

  expect(response.body).toHaveLength(helper.initialNotes.length + 1)
  contents.forEach(blog => {
    expect(blog.likes).toBeDefined()
    console.log(blog.title)
    console.log(blog.likes)
  }

  )
})

test('if title and url is missing return status 400', async () => {
  const newBlog = {
    author: 'Jukka Pekka',
    likes: 2
  }
  /*
  const newBlogg = {
    title: 'Dogcat blog',
    author: 'Pekka Järvi',
    url: 'http//blog.dogblog1000.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlogg)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  */
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
afterAll(() => {
  mongoose.connection.close()
})