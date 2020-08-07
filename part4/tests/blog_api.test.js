const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const api = supertest(app);
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

const user123Login = async () => {
  const loginForm = {
    username: '123',
    password: '123'
  };

  const response = await api
        .post('/api/login')
        .send(loginForm)
        .expect(200);

  const user = response.body;

  return user;
};

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();

  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('123', 10);
  const user = new User({ username: '123', passwordHash });

  await user.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the unique identifier property of the blog posts is named "id"', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

test('a valid blog can be added', async () => {
  const user = await user123Login();

  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + user.token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(r => r.title);
  expect(titles).toContain(
    'Canonical string reduction'
  );
});

test('POST /api/blogs/ a blog without token cannot be added', async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

  const titles = blogsAtEnd.map(r => r.title);
  expect(titles).not.toContain(
    'Canonical string reduction'
  );
});

test('new blogs has 0 likes if not specified', async () => {
  const user = await user123Login();

  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  };

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + user.token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await Blog.find({ title: newBlog.title });

  expect(blogs[0].likes).toBe(0);
});

test('POST /api/blogs check if title is empty, 400 Bad request is returned', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 1
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('POST /api/blogs check if url is empty, 400 Bad request is returned', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 1
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('DELETE /api/blogs/:id check deleting a single blog post resource', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  );

  const titles = blogsAtEnd.map(r => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test('PUT /api/blogs/:id check functionality for updating the information of an individual blog post', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];
  blogToUpdate.likes = 999;

  const response = await api
                     .put(`/api/blogs/${blogToUpdate.id}`)
                     .send(blogToUpdate);

  expect(response.body).toEqual(blogToUpdate);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.filter(blog => blog.id === blogToUpdate.id)[0];

  expect(updatedBlog).toEqual(blogToUpdate);
});

afterAll(() => {
  mongoose.connection.close();
});
