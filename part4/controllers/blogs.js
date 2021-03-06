const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end();
  }

  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: user.username,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch(exception) {
    next(exception);
  }

});

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  try {
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() === user.id.toString()) {
      await blog.remove();
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'Unauthorization user' });
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true});
    response.json(blog);
  } catch (exception) {
    next(exception);
  }

});

module.exports = blogsRouter;
