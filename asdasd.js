test('blog can be added', async () => {

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testuser', passwordHash })

    await user.save()

    const userThings = {
      username: user.username,
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(userThings)
      .expect(200)

    const newBlog = {
      title: 'Dog blog',
      author: 'Pekka Järvi',
      url: 'http//blog.dogblog1000.com',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${result._body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialNotes.length + 1)
    expect(titles).toContain(
      'Dog blog'
    )
  })