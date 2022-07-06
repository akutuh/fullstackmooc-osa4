const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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

test('delete blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const titles = blogsAtEnd.map(t => t.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('update likes on specific blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: 8 })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogAtEnd = blogsAtEnd[0]

  expect(updatedBlogAtEnd.likes).toBe(8)

})

describe('user test', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with non unique username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: '',
      password: 'salainensala',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creation fails with blank username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      name: 'rooster',
      password: 'salainensala',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with null username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: null,
      name: 'rooster',
      password: 'salainensala',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with blank password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jjlehto',
      name: 'rooster',
      password: '',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with null password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jjlehto',
      name: 'rooster',
      password: null,
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with username length less than 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ju',
      name: 'rooster',
      password: 'asddd',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with password length less than 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Jukka',
      name: 'JukkaJ',
      password: 'ds',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})